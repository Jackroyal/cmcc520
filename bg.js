function checkUrl(tabId,info,tab) {
    if (!/.*?wlanacname.*?wlanuserip=.*?ssid=.*/.test(tab.url))
        return;
    else
        bb.dispatch(tabId,info,tab);
}

function handleCommand(command){
    alert('from  handleCommand');
    console.log(command);
    //notice
    chrome.tabs.query({'active':true,'highlighted':true,'currentWindow':true},function(tab){
        console.log(tab);
        console.log('   from   getCurrent');
        console.log(tab[0].id);
        chrome.tabs.executeScript(tab[0].id, {file: "js/logout.js"}, function(a) {
            console.log(a);
            console.log('I from exec a');
            chrome.tabs.sendMessage(tab[0].id,{'wlan':lget('wlanacname'),'wlanuserip':lget('wlanuserip')},function(rr){
                console.log(rr);
            });
            console.log('下线成功,如果要重新登录,你可能要刷新一下页面');
        });
    });

}

chrome.runtime.onMessage.addListener(
    function(req,sen,senr){
        console.log('I from extension');
        var aa=JSON.parse(req);
        // 0: "/LogoutServlet?wlanacname=1022.0027.270.00&wlanuserip=10.80.97.209&ssid=CMCC520&ATTRIBUTE_USERNAME=iWuhanFree0304&ATTRIBUTE_UUID=26FBE9A694B6221958CF6DE2704F0ECA&ATTRIBUTE_IPADDRESS=10.80.97.209&"
        // 1: "wlanacname=1022.0027.270.00"
        // 2: "wlanuserip=10.80.97.209"
        // 3: "ssid=CMCC520"
        // 4: "ATTRIBUTE_USERNAME=iWuhanFree0304"
        // 5: "ATTRIBUTE_UUID=26FBE9A694B6221958CF6DE2704F0ECA"
        // 6: "ATTRIBUTE_IPADDRESS=10.80.97.209"
        if(aa!=null){
            if(lget('wlanacname')!=aa[1]){
                lset('wlanacname',aa[1]);
            }
            if(lget('wlanuserip')!=aa[2]){
                lset('wlanuserip',aa[2]);
            }
            if(lget('ssid')!=aa[3]){
                lset('ssid',aa[3]);
            }
            if(lget('ATTRIBUTE_USERNAME')!=aa[4]){
                lset('ATTRIBUTE_USERNAME',aa[4]);
            }
            if(lget('ATTRIBUTE_UUID')!=aa[5]){
                lset('ATTRIBUTE_UUID',aa[5]);
            }
            if(lget('ATTRIBUTE_IPADDRESS')!=aa[6]){
                lset('ATTRIBUTE_IPADDRESS',aa[6]);
            }
            lset('isStorage',true);
        }else
            lset('isStorage',false);
    }
);

chrome.tabs.onUpdated.addListener(checkUrl);

 chrome.commands.onCommand.addListener(handleCommand);
