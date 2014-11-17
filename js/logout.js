function createHttpRequest() {
    var request = null;
    request = new XMLHttpRequest;
    return request;
}
function lget(name) {
    return localStorage.getItem(name);
}
alert('999888888888888888888888888888888888');
function pageOnunload(wlan,ip) {
        alert('qqqqqqqqqqqqqqzzzzzzzzzzzzzzzzzzzzzzzzz');
    // try {
        var g_httpRequest;
        if (!g_httpRequest) {
            g_httpRequest = createHttpRequest();
        }
        g_httpRequest.abort();
        g_httpRequest.open("GET", "http://120.202.164.10:8080/portal/servlets/LogoutServlet?"+wlan+"&"+ip+"&ssid=CMCC520&ATTRIBUTE_USERNAME=iWuhanFree2030&ATTRIBUTE_UUID=26FBE9A694B6221958CF6DE2704F0ECA&ATTRIBUTE_IPADDRESS="+lget('ip')+"&cancelAutomatismLogin=false", false);
        console.log("http://120.202.164.10:8080/portal/servlets/LogoutServlet?"+wlan+"&"+ip+"&ssid=CMCC520&ATTRIBUTE_USERNAME=iWuhanFree2030&ATTRIBUTE_UUID=26FBE9A694B6221958CF6DE2704F0ECA&ATTRIBUTE_IPADDRESS="+lget('ip')+"&cancelAutomatismLogin=false");
        // alert("ATTRIBUTE_UUID");
        // alert("B963432C92AD20460E7080D38398224D");
        // alert("10.80.121.235");
        // alert(document.getElementById("cancelAutomatismLogin").checked);
        g_httpRequest.send();
        //alert("4");
        if (g_httpRequest.status == 200) {
            // alert("5");
            window.status = "notifyBaseLogout : |" + g_httpRequest.responseText + "|";
            if (g_httpRequest.responseText.indexOf("SUCCESS") != -1) {
                return true;
            } else {
                return false;
            }
        } else {
            alert("request error " + g_httpRequest.status);
            return null;
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
    if(sen!=null){
        pageOnunload(req['wlan'],req['wlanuserip']);
    }
    senr({'haha':'I am ok'});
});

//pageOnunload();
