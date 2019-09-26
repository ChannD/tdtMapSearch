var map;
    var zoom = 14;
    var localsearch;
    let closeSearchResultsNode = document.getElementById("closeSearchResults");
    function onLoad() {
        //初始化地图对象
        map = new T.Map("mapDiv");
        //设置显示地图的中心点和级别
        map.centerAndZoom(new T.LngLat(118.42781400022, 31.35400699992), zoom);

        var config = {
            pageCapacity: 10,	//每页显示的数量
            onSearchComplete: localSearchResult	//接收数据的回调函数
        };
        //创建搜索对象
        localsearch = new T.LocalSearch(map, config);

        /**
         * 注册地图点击事件
         */
        function addMapClick() {
            removeMapClick();
            map.addEventListener("click", MapClick);
        }

        /**
         * 移除地图点击事件
         */
        function removeMapClick() {
            map.removeEventListener("click", MapClick);
        }

        /**
         * 输出
         */
        function MapClick(e) {
            alert(e.lnglat.getLng() + "," + e.lnglat.getLat());
        }
        addMapClick();
    }

    function localSearchResult(result) {
        //清空地图及搜索列表
        clearAll();

        //添加提示词
        prompt(result);

        //根据返回类型解析搜索结果
        switch (parseInt(result.getResultType())) {
            case 1:
                //解析点数据结果
                pois(result.getPois());
                break;
            case 2:
                //解析推荐城市
                statistics(result.getStatistics());
                break;
            case 3:
                //解析行政区划边界
                area(result.getArea());
                break;
            case 4:
                //解析建议词信息
                suggests(result.getSuggests());
                break;
            case 5:
                //解析公交信息
                lineData(result.getLineData());
                break;
        }
    }

    //解析提示词
    function prompt(obj) {
        var prompts = obj.getPrompt();
        if (prompts) {
            var promptHtml = "";
            for (var i = 0; i < prompts.length; i++) {
                var prompt = prompts[i];
                var promptType = prompt.type;
                var promptAdmins = prompt.admins;
                var meanprompt = prompt.DidYouMean;
                if (promptType == 1) {
                    promptHtml += "<p>您是否要在" + promptAdmins[0].name + "</strong>搜索更多包含<strong>" + obj.getKeyword() + "</strong>的相关内容？<p>";
                }
                else if (promptType == 2) {
                    promptHtml += "<p>在<strong>" + promptAdmins[0].name + "</strong>没有搜索到与<strong>" + obj.getKeyword() + "</strong>相关的结果。<p>";
                    if (meanprompt) {
                        promptHtml += "<p>您是否要找：<font weight='bold' color='#035fbe'><strong>" + meanprompt + "</strong></font><p>";
                    }
                }
                else if (promptType == 3) {
                    promptHtml += "<p style='margin-bottom:3px;'>有以下相关结果，您是否要找：</p>"
                    for (i = 0; i < promptAdmins.length; i++) {
                        promptHtml += "<p>" + promptAdmins[i].name + "</p>";
                    }
                }
            }
            if (promptHtml != "") {
                document.getElementById("promptDiv").style.display = "block";
                document.getElementById("promptDiv").innerHTML = promptHtml;
            }
        }
    }



    //解析点数据结果
    function pois(obj) {
        if (obj) {
            //显示搜索列表
            var divMarker = document.createElement("div");
            divMarker.innerHTML = "";
            divMarker.id = "divMarker";
            divMarker.className = "divMarker";
            //添加页头提示
            var searchResultHeadNode = document.createElement("div");
            searchResultHeadNode.innerHTML = "<font style='font-weight: 600;  color: #777; margin-left: 10px; font-size: 14px;'>搜索结果 : </font>"
            divMarker.appendChild(searchResultHeadNode);

            var headAftDiv = document.createElement("div");
            headAftDiv.style.height = "8px";
            divMarker.appendChild(headAftDiv);
            //坐标数组，设置最佳比例尺时会用到
            var zoomArr = [];
            for (var i = 0; i < obj.length; i++) {
                //闭包
                (function (i) {
                    //名称
                    var name = obj[i].name;
                    //地址
                    var address = obj[i].address;
                    //坐标
                    var lnglatArr = obj[i].lonlat.split(" ");
                    var lnglat = new T.LngLat(lnglatArr[0], lnglatArr[1]);
                    console.log(lnglat)
                    var winHtml = "地址:" + address;



                    //创建标注对象
                    // var marker = new T.Marker(lnglat);
                    //地图上添加标注点
                    //创建图片对象
                    var icon = new T.Icon({
                        iconUrl: getDominAndPort() + "/img/poi_icon.png",
                        iconSize: new T.Point(27, 27),
                        iconAnchor: new T.Point(10, 25)
                    });

                    var marker = new T.Marker(new T.LngLat(lnglat.lng,lnglat.lat), {icon: icon});
                    map.addOverLay(marker);
                    //注册标注点的点击事件
                    marker.addEventListener("click", function () {
                        this.showPosition(marker, name, winHtml);
                        map.centerAndZoom(new T.LngLat(lnglat.lng, lnglat.lat), 14);
                        alert(lnglat.lng + ":" + lnglat.lat);
                    }, this);


                    zoomArr.push(lnglat);

                    //在页面上显示搜索的列表
                    var a = document.createElement("a");
                    var div = document.createElement("div");

                    //设置样式
                    a.style.cssText = "padding: 0px; list-style-type: none; margin-top: 5px; margin-left: 8px; font-weight: 600; color: #009688; height: 20px;";
                    div.style.cssText = "height: 5px;";


                    a.href = "javascript://";
                    a.innerHTML = name;
                    a.onclick = function () {
                        showPosition(marker, name, winHtml);
                    }
                    a.onmouseover = "changeResultNodeFn(this, "+i+")";
                    // a.setAttribute("onmouseover ", "changeResultNodeFn(this, "+i+")");
                    // divMarker.appendChild(document.createTextNode( "<font style='font-weight: 600; color: #777;'>"+(i + 1)+".</font>"));

                    var linkCountNode = document.createElement("font");
                    linkCountNode.style.cssText = "font-weight: 600;color: #777;    margin-left: 10px;";
                    linkCountNode.textContent = (i + 1) + ".";
                    divMarker.appendChild(linkCountNode);
                    divMarker.appendChild(a);
                    divMarker.appendChild(document.createElement("br"));
                    divMarker.append(div);

                    // map.centerAndZoom(new T.LngLat(marker.or.lng, marker.or.lat), 14);
                })(i);
            }

            setTimeout(function () {
                let tdtMarkerPaneNode = document.getElementsByClassName("tdt-marker-pane");
                console.log(tdtMarkerPaneNode)
                console.log("sjsjsj")
                for(let i = 0; i < tdtMarkerPaneNode[0].childNodes.length; i++){
                    console.log(tdtMarkerPaneNode[0].childNodes[i]);
                    tdtMarkerPaneNode[0].childNodes[i].style.animation = "big-litter-log 1s infinite";
                    tdtMarkerPaneNode[0].childNodes[i].setAttribute("src", "img/poi_icon.png");
                }
            },500)

            //显示地图的最佳级别
            map.setViewport(zoomArr);
            //显示搜索结果
            //divMarker.appendChild(document.createTextNode('共' + localsearch.getCountNumber() + '条记录，分' + localsearch.getCountPage() + '页,当前第' + localsearch.getPageIndex() + '页'));
            var pageInfoNode = document.createElement("div");
            pageInfoNode.style.marginLeft = "10px";
            pageInfoNode.style.marginTop = "6px";
            pageInfoNode.innerHTML = ""
                + "<font style='font-weight: 600; color: #777;'>共</font>" + "<font style='font-weight: 600; color: #009688;'>" + localsearch.getCountNumber() + "</font>"
                + "<font style='font-weight: 600; color: #777;'>条记录，分</font>" + "<font style='font-weight: 600; color: #009688;'>" + localsearch.getCountPage() + "</font>"
                + "<font style='font-weight: 600; color: #777;'>页,当前第</font>" + "<font style='font-weight: 600; color: #009688;'>" + localsearch.getPageIndex() + "</font>"
                + "<font style='font-weight: 600; color: #777;'>页</font>";
            divMarker.appendChild(pageInfoNode);
            document.getElementById("searchDiv").appendChild(divMarker);
            document.getElementById("resultDiv").style.display = "block";

        }
    }

    //显示信息框
    function showPosition(marker, winHtml) {
        var markerInfoWin = new T.InfoWindow(winHtml, {autoPan: true});
        marker.openInfoWindow(markerInfoWin);
    }

    //解析推荐城市
    function statistics(obj) {
        if (obj) {
            //坐标数组，设置最佳比例尺时会用到
            var pointsArr = [];
            var priorityCitysHtml = "";
            var allAdminsHtml = "";
            var priorityCitys = obj.priorityCitys;
            if (priorityCitys) {
                //推荐城市显示
                priorityCitysHtml += "<font style='margin-left: 9px; font-weight: 600; color: #777;'>在中国以下城市有结果</font><div style='height: 5px;'></div><ul>";
                for (var i = 0; i < priorityCitys.length; i++) {
                    priorityCitysHtml += "<li style='    margin-left: 19px; margin-top: 3px; font-weight: 600; color: #009688;'>" + priorityCitys[i].name + "(" + priorityCitys[i].count + ")</li>";
                }
                priorityCitysHtml += "</ul>";
            }

            var allAdmins = obj.allAdmins;
            if (allAdmins) {
                allAdminsHtml += "<div style='height: 5px;'></div><font style='margin-left: 9px; font-weight: 600; color: #777;'>更多城市</font><div style='height: 5px'></div><ul>";
                for (var i = 0; i < allAdmins.length; i++) {
                    allAdminsHtml += "<li><font style='margin-left: 19px; margin-top: 3px; font-weight: 600; color: #009688;'>" + allAdmins[i].name + "(" + allAdmins[i].count + ")</font>";
                    var childAdmins = allAdmins[i].childAdmins;
                    if (childAdmins) {
                        for (var m = 0; m < childAdmins.length; m++) {
                            allAdminsHtml += "<blockquote style='margin-left: 37px; font-weight: 600; color: #999999c9;'>" + childAdmins[m].name + "(" + childAdmins[m].count + ")</blockquote>";
                        }
                    }
                    allAdminsHtml += "</li>"
                }
                allAdminsHtml += "</ul>";
            }
            document.getElementById("statisticsDiv").style.display = "block";
            document.getElementById("statisticsDiv").innerHTML = priorityCitysHtml + allAdminsHtml;
        }
    }

    //解析行政区划边界
    function area(obj) {
        if (obj) {
            if(obj.points){
                //坐标数组，设置最佳比例尺时会用到
                var pointsArr = [];
                var points = obj.points;
                for (var i = 0; i < points.length; i++) {
                    var regionLngLats = [];
                    var regionArr = points[i].region.split(",");
                    for (var m = 0; m < regionArr.length; m++) {
                        var lnglatArr = regionArr[m].split(" ");
                        var lnglat = new T.LngLat(lnglatArr[0], lnglatArr[1]);
                        regionLngLats.push(lnglat);
                        pointsArr.push(lnglat);
                    }
                    //创建线对象
                    var line = new T.Polyline(regionLngLats, {
                        color: "blue",
                        weight: 3,
                        opacity: 1,
                        lineStyle: "dashed"
                    });
                    //向地图上添加线
                    map.addOverLay(line);
                }
                //显示最佳比例尺
                map.setViewport(pointsArr);
            }
            if(obj.lonlat){
                var regionArr = obj.lonlat.split(",");
                map.panTo(new T.LngLat(regionArr[0], regionArr[1]));
            }
        }
    }

    //解析建议词信息
    function suggests(obj) {
        if (obj) {
            //建议词提示，如果搜索类型为公交规划建议词或公交站搜索时，返回结果为公交信息的建议词。
            var suggestsHtml = "<div style='    margin-left: 8px; color: #666; font-size: 14px; margin-bottom: 5px; margin-top: 5px; font-weight: 600; '>建议词提示</div><ul>";
            for (var i = 0; i < obj.length; i++) {
                suggestsHtml += ""
                    + "<li style='padding: 0px; list-style-type: none; margin-top: 5px;  margin-left: -25px; font-weight: 600; color: #009688; height: 20px;' "
                    // +" onmouseover='changeThisNode(this, "+i+")' onclick='resToInputFn(&quot;"+obj[i].name+"&quot;);'>"
                    + " onmouseover='changeThisNode(this, "+i+")' "
                    +   "onclick='strToInputValueAndCleanDivFn(&quot;"+obj[i].name+"&quot;"+","+"&quot;"+"searchInput"+"&quot;"+"," + "&quot;"+"suggestsDivImmediately"+"&quot;);'>"
                    + "<font id = 'searchRsultStr"+i+"' style=''>" + obj[i].name
                    + "</font>"
                    + "&nbsp;&nbsp;<font style='color:#666666;' id='adminArea"+i+"'>"
                    + obj[i].address + "</font></li>";
            }
            suggestsHtml += "</ul>";
            document.getElementById("suggestsDivImmediately").style.display = "block";
            document.getElementById("suggestsDivImmediately").innerHTML = suggestsHtml;
        }
    }

    /**
     * 验证经纬度是否符合规范
     * @param longitude
     * @param latitude
     * @param str
     * @returns string
     */
    function verifylonglat(str , idStr){
        let idStrNode = document.getElementById(idStr);
        let lnglat = str.split(":");

        if(lnglat.length == 2){
            var longitude = lnglat[0];
            var latitude = lnglat[1];

            // 经度，整数部分为 0-180 小数部分为 0 到 6 位
            var longreg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
            if(!longreg.test(longitude)){
                idStrNode.style.cssText = "border: solid 1px red; border-color: red!important; width: 150px;";
                return "提示 : 经度整数为0到180, 小数部分为0到6位!";
            }

            // 纬度，整数部分为 0-90 小数部分为 0 到 6 位
            var latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
            if(!latreg.test(latitude)){
                idStrNode.style.cssText = "border: solid 1px red; border-color: red!important; width: 150px;";
                return "提示 : 纬度整数为0到90, 小数部分为0到6位!";
            }

            idStrNode.style.cssText = "border: solid 1px #009688; border-color: #009688!important; width: 150px;";        idStrNode.style.border = "border: solid 1px #009688";
            return "正确";
        }else{
            idStrNode.style.cssText = "border: solid 1px red; border-color: red!important; width: 150px;";
            return "提示 : 经纬度格式不对 ! ";
        }
    }

    /**
     * 调整本身节点的样式
     */
    let previousNode;
    let previousINum;
    function changeThisNode(node, iNum) {
        if (previousNode != undefined) {
            previousNode.style.cssText = "padding: 0px;  width: 331px; list-style-type: none; margin-top: 5px; margin-left: -30px; font-weight: 600; height: 20px; border-radius: 3px;";
            document.getElementById("searchRsultStr" + previousINum).style.cssText = "color: #009688;";
            document.getElementById("adminArea" + previousINum).style.cssText = "color: #666666;";
        }
        node.style.cssText = "padding: 0px; width: 331px; list-style-type: none; margin-top: 5px; margin-left: -30px; font-weight: 600; color: red;  height: 23px; background-color: rgb(0, 150, 136); border-radius: 3px;";
        document.getElementById("searchRsultStr" + iNum).style.cssText = "    font-size: 16px; color: white; margin-left: 6px;";
        document.getElementById("adminArea" + iNum).style.cssText = "color: white;";

        previousNode = node;
        previousINum = iNum;
    }

    /**
     * 将值键入input 并清除掉某个节点
     * @param str
     * @param idStr
     */
    function strToInputValueAndCleanDivFn(str, idStr, clearDiv) {
        let idStrNode = document.getElementById(idStr);
        let clearDivNode = document.getElementById(clearDiv);
        clearDivNode.innerHTML = "";
        clearDivNode.style.cssText = "";
        idStrNode.value = str;
    }

    //解析公交信息
    function lineData(obj) {
        if (obj) {
            //公交提示
            var lineDataHtml = "公交提示<ul>";
            for (var i = 0; i < obj.length; i++) {
                lineDataHtml += "<li>" + obj[i].name + "&nbsp;&nbsp;<font style='color:#666666'>共" + obj[i].stationNum + "站</font></li>";
            }
            lineDataHtml += "</ul>";
            document.getElementById("lineDataDiv").style.display = "block";
            document.getElementById("lineDataDiv").innerHTML = lineDataHtml;
        }
    }

    /**
     * 监听搜索框的输入信息
     */
    $("#searchInput").keyup(function () {
        clearSearchResultDivs();
        // document.getElementById("searchResultAllDiv").style.right = "1716px"

        var searchStr = document.getElementById('searchInput').value;
        if(searchStr.length > 0){
            closeSearchResultsNode.style.marginLeft = "310px";
            document.getElementById("suggestsDivImmediately").style.cssText  =  " position: fixed; width: 348px; height: 283px; background-color: rgba(255, 255, 255, 0.92); top: 120px; left: 64px; z-index: 11111; border: 1px solid rgb(194, 194, 194); border-radius: 4px; display: block; box-shadow: 0 0 6px 0 #999;";
            localsearch.search(document.getElementById('searchInput').value,4)
        }else{
            document.getElementById("suggestsDivImmediately").style.cssText = "";
            document.getElementById("suggestsDivImmediately").innerHTML = "";
        }
    });

    //清空地图及搜索列表
    function clearAll() {
        map.clearOverLays();
        document.getElementById("searchDiv").innerHTML = "";
        document.getElementById("resultDiv").style.display = "none";
        document.getElementById("statisticsDiv").innerHTML = "";
        document.getElementById("statisticsDiv").style.display = "none";
        document.getElementById("promptDiv").innerHTML = "";
        document.getElementById("promptDiv").style.display = "none";
        document.getElementById("suggestsDivImmediately").innerHTML = "";
        document.getElementById("suggestsDivImmediately").style.display = "none";
        document.getElementById("lineDataDiv").innerHTML = "";
        document.getElementById("lineDataDiv").style.display = "none";
    }

    /**
     * 清除搜索结果产生的各个节点数据
     */
    function clearSearchResultDivs(){
        // //正确搜索结果
        // let searchDivNode = document.getElementById("searchDiv");
        // searchDivNode.innerHTML = "";

        // map.clearOverLays();
        document.getElementById("searchDiv").innerHTML = "";
        document.getElementById("resultDiv").style.display = "none";
        document.getElementById("statisticsDiv").innerHTML = "";
        document.getElementById("statisticsDiv").style.display = "none";
        document.getElementById("promptDiv").innerHTML = "";
        document.getElementById("promptDiv").style.display = "none";
        document.getElementById("suggestsDivImmediately").innerHTML = "";
        document.getElementById("suggestsDivImmediately").style.display = "none";
        document.getElementById("lineDataDiv").innerHTML = "";
        document.getElementById("lineDataDiv").style.display = "none";


    }

    /**
     * 获取网络地址
     * @returns {string}
     */
    function getDominAndPort() {
        return "http://" + location.host;
    }

    /**
     * 隐藏搜索结果
     */
    function hiddenSearchResultNode(status) {
        let searchResultAllDivNode = document.getElementById("searchResultAllDiv");
        let suggestsDivImmediatelyNode = document.getElementById("suggestsDivImmediately");
        let searchInputNode = document.getElementById("searchInput");
        let closeSearchResultsNode = document.getElementById("closeSearchResults");

        if (status == "hidden") {
            //搜索结果
            searchResultAllDivNode.style.marginLeft = "-40%";
            closeSearchResultsNode.style.right = "1944px";

            //自动提示结果
            // suggestsDivImmediatelyNode.style.cssText = "";
        }

        // if(status == "show"){
        //     console.log(suggestsDivImmediatelyNode);
        //     if(searchInputNode.value == null || searchInputNode.value == undefined ||
        //     searchInputNode.value == ""){
        //         suggestsDivImmediatelyNode.style.cssText = "";
        //         // suggestsDivImmediatelyNode.innerHTML = "";
        //     }else {
        //         suggestsDivImmediatelyNode.style.cssText  =  " position: fixed; width: 345px; height: 283px; background-color: rgba(255, 255, 255, 0.92); right: 935px; top: 63px; z-index: 11111;border: solid 2px #c2c2c2; border-radius: 4px;";
        //
        //     }
        // }
    }

    /**
     * 搜索按钮点击后需要隐掉搜索提示 下拉框
     */
    $("#searchBtn").bind("click", function () {
        // alert("提交");
        let suggestsDivImmediatelyNode = document.getElementById("suggestsDivImmediately");
        // suggestsDivImmediatelyNode.style.left = "-50%";
        suggestsDivImmediatelyNode.innerHTML = "";

        let searchResultsAllDivNode = document.getElementById("searchResultAllDiv");
        searchResultsAllDivNode.style.marginLeft = "3.3%";
        closeSearchResultsNode.style.marginLeft = "310px";

        //清空一次结果
        clearSearchResultDivs();


        let statisticsDivNode = document.getElementById("statisticsDiv");
        statisticsDivNode.innerHTML = "";
    });

    /**
     * 实时监听搜索框
     */
    // $("#searchInput").bind("input propertychange", function () {
    //     localsearch.search(document.getElementById('searchInput').value,4)
    // });