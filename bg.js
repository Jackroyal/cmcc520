function checkUrl(tabId,info,tab) {
    if (!/.*?wlanacname.*?wlanuserip=.*?ssid=.*/.test(tab.url))
        return;
    else
        bb.dispatch(tabId,info,tab);
}

function handleCommand(command){
    console.log(command);
    // chrome.tabs.getCurrent(function(tab){
    //     console.log(tab);
    //     chrome.tabs.executeScript(tab, {file: "kill.js"}, function() {
    //     console.log('下线成功,如果要重新登录,你可能要刷新一下页面')});
    // });

}

chrome.tabs.onUpdated.addListener(checkUrl);

 chrome.commands.onCommand.addListener(handleCommand);
