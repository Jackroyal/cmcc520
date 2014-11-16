function createHttpRequest()
{
    var request = null;
    request = new XMLHttpRequest;
    return request;
}


function pageOnunload()
{
    try
    {   //alert("1");
        if(!g_httpRequest){ g_httpRequest = createHttpRequest(); }
        //alert("2");
        g_httpRequest.abort();
        //alert("3");
        g_httpRequest.open("GET", "servlets/LogoutServlet?wlanacname=1022.0027.270.00&wlanuserip=10.80.121.235&ssid=CMCC520&ATTRIBUTE_USERNAME=iWuhanFree1492&ATTRIBUTE_UUID=B963432C92AD20460E7080D38398224D&ATTRIBUTE_IPADDRESS=10.80.121.235&cancelAutomatismLogin=false", false);
        // alert("ATTRIBUTE_UUID");
        // alert("B963432C92AD20460E7080D38398224D");
        // alert("10.80.121.235");
        // alert(document.getElementById("cancelAutomatismLogin").checked);
        g_httpRequest.send();
        //alert("4");
        if (g_httpRequest.status == 200)
        {
         // alert("5");
          window.status = "notifyBaseLogout : |" + g_httpRequest.responseText + "|";
          if(g_httpRequest.responseText.indexOf("SUCCESS") != -1)
          {
            return true;
          }
          else
          {
            return false;
          }
        }
        else
        {
            alert("request error "  + g_httpRequest.status);
            return null;
        }
    }
    catch (e)
    {
        alert("下线请求失败！");
        return null;
    }
}
