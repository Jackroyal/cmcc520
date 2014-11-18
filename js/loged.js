    var rex=/\/LogoutServlet\?(wlanacname=.*?)\&(wlanuserip=.*?)\&(ssid=.*?)\&(ATTRIBUTE_USERNAME=.*?)\&(ATTRIBUTE_UUID=.*?)\&(ATTRIBUTE_IPADDRESS=.*?)\&/;
    var result=rex.exec(document.head.innerText);
    if(result!=null){
        chrome.runtime.sendMessage(null,JSON.stringfy(result),function(aa){alert('我是loged.js插入的信息,应该发送了');});

    }


    //document.write('<center>OK,终于可以关闭这个烦人的计时页面而不会导致掉线了,↖(^ω^)↗</center>');
    // console.clear();
    // console.clear();
    console.log('clear');
