const uniqueChar = 'v=';
let videoId;

const getVideoId = url => url.slice(url.indexOf(uniqueChar) + 2);

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  videoId = getVideoId(tabs[0].url);
  document.querySelector('h1').innerHTML = videoId;
});