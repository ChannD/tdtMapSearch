# tdtMapSearch
PS: 利用天地图JSAPI实现的一个简易的地图搜索组件!难度不大!好在节约时间!, 表单如果需要配置坐标信息的话, 可以比较方便的集成进表单!


> 前言 : 最近项目上用到一个功能,要用到地理坐标的一些信息(类似举办一场活动, 活动必然要关联上某个实际位置的), 腾讯, 阿里, Goolge都有很不错的接口可以调用, 问题是这些地图提供商获取到坐标系非 **wgs84** 坐标系(PS: 微信js-jdk倒是可以获取到GPS坐标系,不过无法用在非微信Web环境), 好在中国有个国家地理信息开放平台(地址:[国家地理信息服务开放平台](http://tianditu.gov.cn)), 它可以提供我GPS坐标系经纬度!

> PS : 解释下坐标系
> - **WGS84(地图坐标)**
美国GPS使用的是WGS84的坐标系统。GPS系统获得的坐标系统，基本为标准的国际通用的WGS84坐标系统
> - **GCJ-02(火星坐标)**
GCJ-02是由中国国家测绘局制订的地理信息系统的坐标系统。它是一种对经纬度数据的加密算法，即加入随机的偏差。国内出版的各种地图系统（包括电子形式），出于国家安全考虑，必须至少采用GCJ-02对地理位置进行首次加密。
所有的电子地图所有的导航设备，都需要加入国家保密插件。第一步，地图公司测绘地图，测绘完成后，送到国家测绘局，将真实坐标的电子地图，加密成“火星坐标”，这样的地图才是可以出版和发布的，然后才可以让GPS公司处理。第二步，所有的GPS公司，只要需要汽车导航的，需要用到导航电子地图的，统统需要在软件中加入国家保密算法，将COM口读出来的真实的坐标信号，加密转换成国家要求的保密的坐标，这样，GPS导航仪和导航电子地图就可以完全匹配，GPS也就可以正常工作。(在国内发行的地图都使用GCJ02进行首次加密，)
>  1. 这儿吐槽一下百度,最早之前选用过百度, 它是在GCJ02基础上, 进行了BD-09二次加密, 百度自己的API提供了WGS/GCJ转换, 但是没提供反转的方案, 网上也可以找到反转的方案,但是终究是有偏差. 至于 凯立德的K码, 这儿就不长篇大论了!

> **如下表 :**

|地图|坐标系|
|-------|-------|
|百度地图|百度坐标(BD-09)|
|腾讯地图|火星坐标|
|图吧地图|图吧坐标|
|高德地图|火星坐标|
|凯立德地图|火星坐标(转K码)|

> **接前言:** 活动需要关联一个位置, 让用户自己去输入坐标或者用户自己去输入地址, 这两个都不现实, 坐标容易输入错误,地址的话太笼统了!那么解决方案就是用户点击输入框的时候,弹出地图让用户自己选择位置, 通过接口调用获取到坐标, 再通过坐标逆向信息获取出坐标的Poi信息!思路有了就可以!这个共两个是两年前写的!不记录一下怕忘记了! 代码可能有点乱! 天地图的开发者AK,可以自己去替换, 大致信息如下图所示:

> **[预览DEMO](http://www.jiangdalong.com/tdtMapSearch/index.html)**

> **[源码地址](https://github.com/ChannD/tdtMapSearch)**

> **如图:**
![微信截图_20190926211855.png](https://www.jiangdalong.com/upload/2019/9/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20190926211855-e1b65b620c354da7ac7ee3ebc0526f44.png)![微信截图_20190926211920.png](https://www.jiangdalong.com/upload/2019/9/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20190926211920-3cf6284d34d74f94bf816163754d5525.png)![微信截图_20190926211950.png](https://www.jiangdalong.com/upload/2019/9/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20190926211950-6321977ba3d44f9882bf67a3fbde0e1d.png)






