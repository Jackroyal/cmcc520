var bb={
    dispatch:function (tabId, info, tab) {
        if (/.*?\/portal\/\?.*?wlanacname.*?wlanuserip=.*?ssid=CMCC-EDU/.test(tab.url))
        {
            bb.redirect(tabId,info,tab);
        }
        else
        if (/http.+?portal\/loginOnLine\.jsp;jsessionid.*?\?.*?ssid=CMCC520/i.test(tab.url) && info.status=='complete') {
            console.log('login over');
            bb.loged(tabId,tab);
            //bb.login(tabId,info,tab);
        }else
        if (/(http.+?)\?(.*?ssid=)CMCC520/i.test(tab.url) && info.status=='complete') {
            console.log('from login oo');
            bb.login(tabId, info, tab);
        };
    },
    redirect:function(tabId, info, tab){
        var regex1=/(http.+?)\?(.*?ssid=)CMCC-EDU/i;//匹配url,额,正则水平有限,但愿没有误杀
        a=regex1.exec(tab.url);//讲地址分为三段,直接跳
        console.log('找到了,准备跳转!Go!Go!Go');
        chrome.pageAction.show(tabId);
        console.log(a[1]+'loginFree.jsp?'+a[2]+'CMCC520');
        chrome.tabs.update(tab.id, {url: a[1]+'loginFree.jsp?'+a[2]+'CMCC520'},function (tab){
            //bb.login(tab.id,tab.status,tab);
            console.log(tab);
            console.log('over');
        });
    },

    login:function (tabId,info,tab) {
        chrome.pageAction.show(tab.id);
        if (tab.status=="complete")
        {
            console.log('from update function');
            console.log(tab);
            chrome.tabs.executeScript(tab.id,{
                code: 'alert(1123);document.getElementById(\'loginForm\').submit();alert(000999999999999999);window.onload=function(){alert(111111);document.getElementById(\'loginForm\').submit();}',
                runAt: "document_end"
            });
        }

    },

    loged:function(tabId,tab){
        console.log('I am loged');
        console.log(tabId);
        console.log(tab);
        chrome.tabs.executeScript(tabId,{
        code: "alert('fuckkkkkkkkkkkkkkkkkkk');console.clear();document.write('<center>OK,终于可以关闭这个烦人的计时页面而不会导致掉线了,↖(^ω^)↗</center>');",
        runAt: "document_end"
      });

    }

};
