function checkUrl(tabId,info,tab) {
    if (!/.*?wlanacname.*?wlanuserip=.*?ssid=.*/.test(tab.url))
        return;
    else
        bb.dispatch(tabId,info,tab);
}


chrome.tabs.onUpdated.addListener(checkUrl);
