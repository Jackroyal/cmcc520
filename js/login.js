    document.body.style.backgroundColor="red";
    alert(1123);
    function post_ajax(allowAjax,url,wlanacname,wlanuserip,ssid,userAgent){
        if(!allowAjax){
            if(document.head.getElementsByTagName('script').length==1){
                document.getElementById('loginForm').submit();
            }
            else{
                document.head.removeChild(document.head.getElementsByTagName('script')[0]);
                alert('gogo');
            }
        }
        else{
            var xhr=new XMLHttpRequest();
            xhr.abort();
            xhr.open('POST',url+"/servlets/SingleLoginServlet");
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xhr.send(wlanacname+"&"+wlanuserip+"&"ssid+"&"+userAgent);
            xhr.onreadystatechange=function(){
                if(xhr.readyState==4 && xhr.status==200){
                    console.log(xhr.responseText);
                    var rex=/servlets\/LogoutServlet\?(wlanacname=.*?)\&(wlanuserip=.*?)\&(ssid=.*?)\&(ATTRIBUTE_USERNAME=.*?)\&(ATTRIBUTE_UUID=.*?)\&(ATTRIBUTE_IPADDRESS=.*?)\&cancelAutomatismLogin\=/;
                    var result=rex.exec(xhr.responseText);
                    var mes=(xhr.responseText).match(/<script.*?>[\s\S]*?<\/script>/g);
                    if(result!=null && mes.length==1){
                        console.log( JSON.stringify(result));
                        chrome.runtime.sendMessage(null,JSON.stringify(result),function(aa){
                            if(aa){
                                alert('我是loged.js插入的信息,应该发送了qqqqqqq');
                                document.write('<center>OK,终于可以关闭qqqqqqqqqqq这个烦人的计时页面而不会导致掉线了,↖(^ω^)↗</center>');
                                console.clear();
                                console.clear();
                            }else{
                                console.log('loged.js  error');
                            }
                        });

                    }else
                    if(mes.length==2){
                        var warn=mes[0].match(/alert\(([\S]*?)\)/);
                        alert(warn[1]);
                    }else{
                        alert('对不起,登陆不成功,可能是你所在的区域不支持,请重试');
                    }
                    console.log('clear');
                }
            };
        }
    }

    chrome.runtime.onMessage.addListener(function(req,sen,senr){
    if(req!=null){
        if(req.length==1){
            senr( post_ajax(req['allowAjax'],req['url'],req['wlanacname'],req['wlanuserip'],req['ssid'],req['userAgent']));
        }else
            senr( post_ajax(req['allowAjax'],null,null,null,null,null));

    }else{
        senr({'error':"登陆请求失败！扩展传递参数有误"});
    }
});
    alert(000999999999999999);
