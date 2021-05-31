import '../ui/presentation';

chrome.runtime.sendMessage({}, (response) => {
  console.log({ response });

  var checkReady = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(checkReady);
      console.log("We're in the (updated) injected content script!");
    }
  });
});
