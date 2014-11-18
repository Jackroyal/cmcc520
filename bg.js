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

chrome.runtime.onMessage.addListener(function(req,sen,senr){console.log('I from extension');console.log(req);});

chrome.tabs.onUpdated.addListener(checkUrl);

 chrome.commands.onCommand.addListener(handleCommand);
