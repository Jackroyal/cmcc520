var bb={
    wlanacname:(window.localStorage.getItem('wlanacname')||null),
    wlanuserip:window.localStorage.getItem('wlanuserip')||null,
    url:window.localStorage.getItem('url')||null,
    ssid:'ssid=CMCC520',
    userAgent_1:'userAgent_1=Mozilla%2F5.0+%28Windows+NT+6.2%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F38.0.2125.111+Safari%2F537.36',
    logoutUrl:window.localStorage.getItem('logoutUrl')||null,
    isStorage:window.localStorage.getItem('isStorage')||null,
    lastStoreTime:window.localStorage.getItem('lastStoreTime')||null,
    lastLoginTime:window.localStorage.getItem('lastLoginTime')||null,
    allowAjax:window.localStorage.getItem('allowAjax')||true,
    lget:function(name) {
        localStorage.getItem(name)=bb[name]=bb[name]||localStorage.getItem(name);
        return bb[name];
    },
    init:function(tab){
        var a=regE('(http\\:\\/\\/[\\d\\.\\:]+?\\/[\\w]+?)\\/.*?(wlanacname.*?)&.*(wlanuserip=.*?)&',tab.url);
        if(a!=null && !bb.is_Storage(a)){
            bb.store(a);//存储登陆信息
        }else{
            console.log('url error,please check again');
            console.log(tab.url);
            return;
        }
        if (bb.isStorage==null) {
            lset('isStorage',false);
        };

    },
    store:function(a){
        if(bb.lastStoreTime==null||comTime(bb.lastStoreTime,60,bb.lastLoginTime)){
            //存储 登陆用的wlan的name和登录的url
            lset('url',a[1]);
            lset('wlanacname',a[2]);
            lset('wlanuserip',a[3]);
            lset('lastStoreTime',new Date());
            lset('isStorage',false);
        }
    },

    is_Storage:function(a){
        return bb.url!=null && bb.logoutUrl!=null && bb.wlanacname!=null && bb.wlanuserip!=null&&bb.wlanacname==a[2] && bb.wlanuserip==a[1];//&&comTime(bb.lastStoreTime,60,null,'>');
    },
    is_init:function(){
        return bb.url!=null && bb.logoutUrl!=null && bb.wlanacname!=null && bb.wlanuserip!=null&&bb.allowAjax&&bb.ssid!=null&&bb.userAgent_1!=null&&bb.lastStoreTime!=null&&bb.lastLoginTime!=null&&bb.isStorage!=null;//&&comTime(bb.lastStoreTime,60,null,'>');
    },

    dispatch:function (tabId, info, tab) {
        chrome.pageAction.show(tabId);
        bb.init(tab);
        if (/.*?\/portal\/\?.*?wlanacname.*?wlanuserip=.*?ssid=CMCC-EDU/.test(tab.url) && info.status=='loading')
        {
            if(bb.is_init())
                bb.login(tabId, info, tab);
            else{
                bb.redirect(tabId,info,tab);

            }
        }
        else
        if (/http.+?portal\/loginOnLine\.jsp;jsessionid.*?\?.*?ssid=CMCC520/i.test(tab.url) && info.status=="complete") {
            console.log('login is over,now loged');
            bb.loged(tabId,tab);
        }else
        if (/(http.+?)loginFree\.jsp\?(.*?ssid=)CMCC520/.test(tab.url) && info.status=='complete') {
            //避免频繁提交
            // if ( (!bb.isStorage || info.status=='complete')&&comTime(bb.lastLoginTime,60) )
                console.log('from login outter');
            if ( bb.lastLoginTime==null || comTime(bb.lastLoginTime,10) )
            {
                console.log('from login inner');
                bb.login(tabId, info, tab);
            }
            else{
                console.log('提交过于频繁了  wait');
                alert('提交过于频繁了,让我们一起倒数一分钟好不好?');
            }
        };
    },

    redirect:function(tabId, info, tab){
        var regex1=/(http.+?)\?(.*?ssid=)CMCC-EDU/i;//匹配url,额,正则水平有限,但愿没有误杀
        a=regex1.exec(tab.url);//讲地址分为三段,直接跳
        chrome.tabs.update(tab.id, {url: a[1]+'loginFree.jsp?'+a[2]+'CMCC520'},
            function (tab){
                console.log('refirect over');
                bb.login(tabId, info, tab);
            }
        );
    },

    login:function (tabId,info,tab) {
        // if (tab.status=="complete")
        {
            lset('lastLoginTime',new Date());
            console.log('from update function  '+info.status);
            console.log(tab);
            file='js/login.js';
            chrome.tabs.executeScript(tab.id,{
                file : file,
                runAt: "document_end"
            },function(aa){
                console.log('I am aa'+aa);
                if (bb.allowAjax&&bb.url && bb.wlanacname && bb.wlanuserip&&bb.ssid&&bb.userAgent_1) {
                    chrome.tabs.sendMessage(tab.id,{'allowAjax':bb.allowAjax,'url':bb.url,'wlanacname':bb.wlanacname,'wlanuserip':bb.wlanuserip,'ssid':bb.ssid,'userAgent_1':bb.userAgent_1},function(response){
                        if(response===true){
                            console.log('ajax登陆成功');
                        }
                        else
                            console.log('ajax'+response);
                    });
                }else{
                    chrome.tabs.sendMessage(tab[0].id,{'allowAjax':bb.allowAjax},function(response){
                        if(response===true){
                            console.log('非ajax登陆成功');
                        }
                        else
                            console.log('非ajax'+response);
                    });
                }
            });
        }

    },

    loged:function(tabId,tab){
        console.log('I am loged');
        console.log(tabId);
        console.log(tab);
        file='js/loged.js';
        if (bb.isStorage || tab.status=="complete")
        {
            chrome.tabs.executeScript(tabId,{
                file:file,
                runAt: "document_start"
            });
        }

    }

};
