    function post_ajax(allowAjax,url,wlanacname,wlanuserip,ssid,userAgent_1){
        if(!allowAjax){
            if(document.head.getElementsByTagName('script').length==1){
                document.getElementById('loginForm').submit();
                return true;
            }
            else{
                document.head.removeChild(document.head.getElementsByTagName('script')[0]);
                alert('gogo');
                return false;
            }
        }
        else{
            document.write('<center>正在发送登录请求,请稍等,不要关闭本页,↖(^ω^)↗</center>');//console.clear();;
            var xhr=new XMLHttpRequest();
            xhr.abort();
            xhr.open('POST',url+"/servlets/SingleLoginServlet");
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xhr.send(wlanacname+"&"+wlanuserip+"&"+ssid+"&"+userAgent_1);
            xhr.onreadystatechange=function(){
                if(xhr.readyState==4 && xhr.status==200){
                    var rex=/servlets\/LogoutServlet\?(wlanacname=.*?)\&(wlanuserip=.*?)\&(ssid=.*?)\&(ATTRIBUTE_USERNAME=.*?)\&(ATTRIBUTE_UUID=.*?)\&(ATTRIBUTE_IPADDRESS=.*?)\&cancelAutomatismLogin\=/;
                    var result=rex.exec(xhr.responseText);
                    var mes=(xhr.responseText).match(/<script.*?>[\s\S]*?<\/script>/g);
                    if(result!=null && (xhr.responseText).indexOf('成功')!=-1){
                        result[result.length]=true;
                        chrome.runtime.sendMessage(null,JSON.stringify(result),function(aa){
                            if(aa){
                                document.write('<center>OK,终于可以关闭这个烦人的计时页面而不会导致掉线了,↖(^ω^)↗</center>');
                                return true;
                            }else{
                                return ('loged.js  error');
                            }
                        });

                    }else
                    if(mes.length==2){
                        var warn=mes[0].match(/alert\(([\S]*?)\)/);
                        alert(warn[1]);
                        document.close();
                        document.write("<center>'"+warn[1]+"'</center>");
                        return  (warn[1]);
                    }else{
                        alert('对不起,登陆不成功,可能是你所在的区域不支持,请重试');
                        return ('对不起,登陆不成功,可能是你所在的区域不支持,请重试');

                    }
                }
            };
        }
    }

    chrome.runtime.onMessage.addListener(function(req,sen,senr){
        if(req!=null){
            if(req['allowAjax']){
                post_ajax(req['allowAjax'],req['url'],req['wlanacname'],req['wlanuserip'],req['ssid'],req['userAgent_1']);
                senr(true);
            }else
                if(req['allowAjax']==false)
                    senr( post_ajax(req['allowAjax'],null,null,null,null,null));
                else
                    senr(false);

        }else{
            senr({'error':"登陆请求失败！扩展传递参数有误"});
        }
    });
