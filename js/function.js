var bb={
    init:function(tab){
        var a=regE('(wlanacname.*?)&.*(wlanuserip=(.*?))&',tab.url);
        if(a!=null){
            bb.store(a);//存储登陆信息
        }else{
            console.log('url error,please check again');
            return;
        }

    },
    dispatch:function (tabId, info, tab) {

        if(!bb.isStorage())
        {
            bb.init(tab);
        }
        if (/.*?\/portal\/\?.*?wlanacname.*?wlanuserip=.*?ssid=CMCC-EDU/.test(tab.url))
        {
            bb.redirect(tabId,info,tab);
        }
        else
        if (/http.+?portal\/loginOnLine\.jsp;jsessionid.*?\?.*?ssid=CMCC520/i.test(tab.url) && info.status=='loading') {
            console.log('login over');
            bb.loged(tabId,tab);
        }else
        if (/(http.+?)loginFree\.jsp\?(.*?ssid=)CMCC520/.test(tab.url) && info.status=='complete') {
            //避免频繁提交
            if (comTime(lget('lastLoginTime'),60))
            {
                console.log('from login oo');
                bb.login(tabId, info, tab);
            }
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
        lset('lastLoginTime',new Date());
        chrome.pageAction.show(tab.id);
        if (tab.status=="complete")
        {
            console.log('from update function');
            console.log(tab);
            file='js/login.js';
            chrome.tabs.executeScript(tab.id,{
                file : file,
                runAt: "document_start"
            });
        }

    },

    loged:function(tabId,tab){
        console.log('I am loged');
        console.log(tabId);
        console.log(tab);
        chrome.tabs.executeScript(tabId,{
        code: "document.write('<center>OK,终于可以关闭这个烦人的计时页面而不会导致掉线了,↖(^ω^)↗</center>');console.clear();console.clear();",
        runAt: "document_end"
      });

    },

    store:function(a){
        if(lget('lastStoreTime')==null||comTime(lget('lastStoreTime'),60,lget('lastLoginTime'))){
            //存储 登陆用的wlan的name和ip
            lset('wlanacname',a[1]);
            lset('wlanuserip',a[2]);
            lset('ip',a[3]);
            lset('lastStoreTime',new Date());
        }
    },

    isStorage:function(){
        return lget('lastLoginTime')!=null && lget('wlanacname')!=null && lget('wlanuserip')!=null&&comTime(lget('lastStoreTime'),60,null,'>');
    }

};
