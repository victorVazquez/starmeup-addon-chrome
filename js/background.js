console.log('BACKGROUND.JS');

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
   if (changeInfo.status == 'complete') {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
         chrome.tabs.sendMessage(tabs[0].id, {type: "load", tab: tab}, function(response) {});
      });
   }
});
