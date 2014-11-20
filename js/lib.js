function createHttpRequest() {
    var request = null;
    request = new XMLHttpRequest;
    return request;
}


function pageOnunload() {
    try {
        if (!g_httpRequest) {
            g_httpRequest = createHttpRequest();
        }
        g_httpRequest.abort();
        //http://120.202.164.10:8080/portal/servlets/LogoutServlet?wlanacname=1022.0027.270.00&wlanuserip=10.80.121.235&ssid=CMCC520&ATTRIBUTE_USERNAME=iWuhanFree1626&ATTRIBUTE_UUID=B963432C92AD20460E7080D38398224D&ATTRIBUTE_IPADDRESS=10.80.121.235&cancelAutomatismLogin=false
        g_httpRequest.open("GET", "http://120.202.164.10:8080/portal/servlets/LogoutServlet?"+lget('wlanacname')+"&"+lget('wlanuserip')+"&ssid=CMCC520&ATTRIBUTE_USERNAME=iWuhanFree1492&ATTRIBUTE_UUID=B963432C92AD20460E7080D38398224D&ATTRIBUTE_IPADDRESS="+lget('ip')+"&cancelAutomatismLogin=false", false);
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
    } catch (e) {
        alert("下线请求失败！");
        return null;
    }
}

function lset(name, value) {
    bb[name]=value;
    localStorage.setItem(name, value);
}

function lget(name) {
    localStorage.setItem(name,bb[name]=bb[name]||localStorage.getItem(name));
    return bb[name];
}

function regE(patt, attr) {
    var regx1 = new RegExp(patt);
    return regx1.exec(attr);
}

function comTime(t, a, T, f) {
    var result = null;
    if (T != null)
        b = new Date(T);
    else
        b = new Date();

    switch (f) {
        case '>':
            result = (new Date(t)).getTime() + a * 1000 > b.getTime();
            break;
        case '<':
            result = (new Date(t)).getTime() + a * 1000 < b.getTime();
            break;
        case '=':
            result = (new Date(t)).getTime() + a * 1000 == b.getTime();
            break;
        default:
            result = (new Date(t)).getTime() + a * 1000 < b.getTime();
    }

    return result;
}
