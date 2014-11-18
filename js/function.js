var bb={
    init:function(tab){
        var a=regE('(http\\:\\/\\/[\\d\\.\\:]+?\\/[\\w]+?)\\/.*?(wlanacname.*?)&.*(wlanuserip=.*?)&',tab.url);
        if(a!=null && !bb.isStorage(a)){
            bb.store(a);//存储登陆信息
        }else{
            console.log('url error,please check again');
            console.log(tab.url);
            return;
        }
        if (lget('isStorage')==null) {
            lset('isStorage',false);
        };

    },
    dispatch:function (tabId, info, tab) {
        chrome.pageAction.show(tabId);
        bb.init(tab);
        if (/.*?\/portal\/\?.*?wlanacname.*?wlanuserip=.*?ssid=CMCC-EDU/.test(tab.url))
        {
            bb.redirect(tabId,info,tab);
        }
        else
        if (/http.+?portal\/loginOnLine\.jsp;jsessionid.*?\?.*?ssid=CMCC520/i.test(tab.url)) {
            console.log('login over');
            bb.loged(tabId,tab);
        }else
        if (/(http.+?)loginFree\.jsp\?(.*?ssid=)CMCC520/.test(tab.url) && info.status=='complete') {
            //避免频繁提交
            // if ( (!lget('isStorage') || info.status=='complete')&&comTime(lget('lastLoginTime'),60) )
            if ( comTime(lget('lastLoginTime'),60) )
            {
                console.log('from login oo');
                bb.login(tabId, info, tab);
            }else{
                alert('提交过于频繁了,让我们一起倒数一分钟好不好?');
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
        chrome.pageAction.show(tab.id);
        if (tab.status=="complete")
        {
            lset('lastLoginTime',new Date());
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
        file='js/loged.js';
        if (lget('isStorage') || tab.status=="complete")
        {
            chrome.tabs.executeScript(tabId,{
                file:file,
                runAt: "document_end"
            });
        }

    },

    store:function(a){
        if(lget('lastStoreTime')==null||comTime(lget('lastStoreTime'),60,lget('lastLoginTime'))){
            //存储 登陆用的wlan的name和登录的url
            lset('url',a[1]);
            lset('wlanacname',a[2]);
            lset('wlanuserip',a[3]);
            lset('lastStoreTime',new Date());
            lset('isStorage',false);
        }
    },

    isStorage:function(a){
        return lget('lastLoginTime')!=null && lget('wlanacname')!=null && lget('wlanuserip')!=null&&lget('wlanacname')==a[2] && lget('wlanuserip')==a[1];//&&comTime(lget('lastStoreTime'),60,null,'>');
    }

};
