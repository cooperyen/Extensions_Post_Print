chrome.action.onClicked.addListener((tabs) => {
  chrome.tabs.create({
    url: 'popup.html',
  });
});

// chrome.runtime.onInstalled.addListener(function (details) {
//   if (details.reason == "install") {
//     chrome.tabs.create({
//       url: 'options.html'
//     });
//   }
// });
