/**
 * Created by Administrator on 2015/7/17.
 */


function get(url,callback){

    //1、创建对象：XMLhttpRequest
    //兼容
    var xmlHttp ;
    if(window.XMLHttpRequest){
        xmlHttp = new XMLHttpRequest();//ff,chrome,safari,IE7+
    }else{
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");//ie6
    }

    //4、获取服务器响应（同步、异步）
    xmlHttp.onreadystatechange = function(){

        if(xmlHttp.readyState == 4){
            if(xmlHttp.status == 200){
                callback(xmlHttp);
            }else{
                alert('请求失败'+xmlHttp.status);
            }
        }




    };


    //2、初始化XMLhttpRequest对象：open方法
    xmlHttp.open('GET',url,true);//true,异步

    //3、发送请求：send（post、get）
    xmlHttp.send();



}

function post(url,callback,data){

    //1、创建对象：XMLhttpRequest
    //兼容
    var xmlHttp ;
    if(window.XMLHttpRequest){
        xmlHttp = new XMLHttpRequest();//ff,chrome,safari,IE7+
    }else{
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");//ie6
    }

    //4、获取服务器响应（同步、异步）
    xmlHttp.onreadystatechange = function(){

        if(xmlHttp.readyState == 4){
            if(xmlHttp.status == 200){
                callback(xmlHttp);
            }else{
                alert('请求失败'+xmlHttp.status);
            }
        }




    };


    //2、初始化XMLhttpRequest对象：open方法
    xmlHttp.open('POST',url,true);//true,异步

    xmlHttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');

    //3、发送请求：send（post、get）
    xmlHttp.send(data);



}

function getJSONP(url,callback){
    var cbnum = 'cb' + getJSONP.counter++;
    var cbname = "getJSONP." + cbnum;

    if (url.indexOf("?") === -1){
        url += "?jsonp=" + cbname;
    }else{
        url += "&jsonp=" + cbname;
    }

    var script = document.createComment('script');
    xmlHttp = new XMLHttpRequest();
    getJSONP[cbnum] = function(xmlHttp){
        try{
            callback(xmlHttp);
        }
        finally{
            delete  getJSONP[cbnum];
            script.parentNode.removeChild(script);
        }
    };

    script.src = url;
    document.body.appendChild(script);
}

getJSONP.counter = 0;


