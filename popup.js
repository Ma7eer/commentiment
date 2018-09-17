const uniqueChar = 'v=';
let videoId;

const getVideoId = url => url.slice(url.indexOf(uniqueChar) + 2);

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  videoId = getVideoId(tabs[0].url);

  // http request
  // inspect body of chrome extension to see the result in the console
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `https://commentiment.herokuapp.com/sentiment/yt?id=${videoId}`, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      const response = JSON.parse(xhr.responseText);
      // const response = JSON.stringify({ "data" : xhr.responseText });
      console.log(response);
  }
}
  xhr.send();
});