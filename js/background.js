console.log('BACKGROUND.JS');

// chrome.browserAction.onClicked.addListener(function(){
//   alert('Browser Action Clicked');
//   if ('userSMULogged' in localStorage) {
//     alert('Integration Enabled');
//     // window.location.href = 'main.html';
//   }else{
//     alert('Integration Disabled')
//   }
// });

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
   if (changeInfo.status == 'complete') {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
         chrome.tabs.sendMessage(tabs[0].id, {type: "load", tab: tab}, function(response) {});
      });
   }
});
