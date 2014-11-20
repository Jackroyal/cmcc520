var bb={
    wlanacname:(window.localStorage.getItem('wlanacname')||null),//记录CMCC-EDU分配的网络名
    wlanuserip:window.localStorage.getItem('wlanuserip')||null,//记录CMCC-ED分配的ip
    url:window.localStorage.getItem('url')||null,//网站的主要地址,例如ttp://120.202.164.10:8080/portal
    ssid:'ssid=CMCC520',//网络的SSID
    userAgent_1:'userAgent_1=Mozilla%2F5.0+%28Windows+NT+6.2%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F38.0.2125.111+Safari%2F537.36',//浏览器useragent
    logoutUrl:window.localStorage.getItem('logoutUrl')||null,//记录注销的url
    isStorage:window.localStorage.getItem('isStorage')||null,//是否所有信息都存储了,包括登录和注销用的参数
    lastStoreTime:window.localStorage.getItem('lastStoreTime')||null,//最近一次执行初始化操作的时间
    lastLoginTime:window.localStorage.getItem('lastLoginTime')||null,//最后一次执行login操作的时间
    allowAjax:window.localStorage.getItem('allowAjax')||true,//是否允许ajax登录,如果网速不好可以禁用ajax登录
    logoutTime:window.localStorage.getItem('logoutTime')||null,//记录下线时间

    init:function(tab){
        var a=bb.regE('(http\\:\\/\\/[\\d\\.\\:]+?\\/[\\w]+?)\\/.*?(wlanacname.*?)&.*(wlanuserip=.*?)&',tab.url);
        if(a!=null && !bb.is_Storage(a)){
            bb.store(a);//存储登陆信息
        }else{
            console.log('url error,please check again');
            console.log(tab.url);
            return;
        }
        if (bb.isStorage==null) {
            bb.lset('isStorage',false);
        };

    },
    store:function(a){
        if(bb.lastStoreTime==null||comTime(bb.lastStoreTime,60,bb.lastLoginTime)){
            //存储 登陆用的wlan的name和登录的url
            window.localStorage.clear();
            bb.lset('url',a[1]);
            bb.lset('wlanacname',a[2]);
            bb.lset('wlanuserip',a[3]);
            bb.lset('lastStoreTime',new Date());
            bb.lset('isStorage',false);
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
            bb.lset('lastLoginTime',new Date());
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

    },
    //以下是工具函数
    lget:function(name) {
        localStorage.setItem(name,bb[name]=bb[name]||localStorage.getItem(name));
        return bb[name];
    },

    lset:function(name, value) {
        bb[name]=value;
        localStorage.setItem(name, value);
    },

    regE:function(patt, attr) {
        var regx1 = new RegExp(patt);
        return regx1.exec(attr);
    },

    comTime:function(t, a, T, f) {
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
    },
    createHttpRequest:function() {
        var request = null;
        request = new XMLHttpRequest;
        return request;
    },
    checkUrl:function (tabId,info,tab) {
        if (!/.*?wlanacname.*?wlanuserip=.*?ssid=.*/.test(tab.url))
            return;
        else{
            bb.dispatch(tabId,info,tab);
        }
    },
    handleCommand:function (command){
        if (!bb.lget('logoutTime') || bb.comTime(bb.lget('logoutTime'),10)) {
            //notice
            lset('logoutTime',new Date());
            chrome.tabs.query({'active':true,'highlighted':true,'currentWindow':true},function(tab){
                if (bb.url!=null && bb.logoutUrl!=null)
                {
                    chrome.tabs.executeScript(tab[0].id, {file: "js/logout.js"}, function(a) {
                        console.log(a);
                        console.log('I from exec a');
                        chrome.tabs.sendMessage(tab[0].id,{'url':bb.url,'logoutUrl':bb.logoutUrl},function(response){
                            if(response===true){
                                console.log('下线成功,如果要重新登录,你可能要刷新一下页面');
                            }
                            else
                                console.log(response);
                        });
                    })
                }else{
                    alert('注销参数获取不正确,下线失败,sorry');
                }
            });
        }else{
            alert('下线提交太频繁了,wait!');
        }
    },
    handleMessage:function(req,sen,senr){
        var aa=JSON.parse(req);
        // 0: "/LogoutServlet?wlanacname=1022.0027.270.00&wlanuserip=10.80.97.209&ssid=CMCC520&ATTRIBUTE_USERNAME=iWuhanFree0304&ATTRIBUTE_UUID=26FBE9A694B6221958CF6DE2704F0ECA&ATTRIBUTE_IPADDRESS=10.80.97.209&"
        // 1: "wlanacname=1022.0027.270.00"
        // 2: "wlanuserip=10.80.97.209"
        // 3: "ssid=CMCC520"
        // 4: "ATTRIBUTE_USERNAME=iWuhanFree0304"
        // 5: "ATTRIBUTE_UUID=26FBE9A694B6221958CF6DE2704F0ECA"
        // 6: "ATTRIBUTE_IPADDRESS=10.80.97.209"
        if(aa!=null){
            var xarr=['logoutUrl','wlanacname','wlanuserip','ssid','ATTRIBUTE_USERNAME','ATTRIBUTE_UUID','ATTRIBUTE_IPADDRESS'];
            for(var i in xarr){
                if(this[xarr[i]]!=aa[i]){
                    bb.lset(xarr[i],aa[i]);
                }
            }
            bb.lset('isStorage',true);
        }else{
            console.log(aa);
            bb.lset('isStorage',false);
        }
        senr(bb.isStorage);
    }

};
