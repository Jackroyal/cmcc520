chrome.runtime.onMessage.addListener(bb.handleMessage);

chrome.tabs.onUpdated.addListener(bb.checkUrl);

 chrome.commands.onCommand.addListener(bb.handleCommand);
