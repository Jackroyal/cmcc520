function createHttpRequest() {
    var request = null;
    request = new XMLHttpRequest;
    return request;
}
function lget(name) {
    return localStorage.getItem(name);
}
alert('logout insert success');
function pageOnunload(url,logoutUrl) {
    // try {
        var g_httpRequest;
        if (!g_httpRequest) {
            g_httpRequest = createHttpRequest();
        }
        g_httpRequest.abort();
        g_httpRequest.open("GET", url+"/"+logoutUrl+"false", false);
        g_httpRequest.send();
        if (g_httpRequest.status == 200) {
            window.status = "notifyBaseLogout : |" + g_httpRequest.responseText + "|";
            if (g_httpRequest.responseText.indexOf("SUCCESS") != -1) {
                alert('下线成功!!!!!!!!');
                console.log('下线成功鸟急急急急急急');
                return true;
            } else {
                alert('下线失败');
                console.log('下线 失败鸟');
                return false;
            }
        } else {
            return ("request error " + g_httpRequest.status);
        }
    // } catch (e) {
    //     console.log(e);
    //     alert("下线请求失败！");
    //     return null;
    // }
}
/*
    req:发送的消息内容
    sen:发消息的扩展的id
    senr:消息的回传函数(别名)
 */
chrome.extension.onMessage.addListener(function(req,sen,senr){
    if(req!=null){
        senr( pageOnunload(req['url'],req['logoutUrl']));
    }else{
        senr({'error':"下线请求失败！扩展传递参数有误"});
    }
});
