import { getVideoId } from './helpers/videoId.js';
import { createDoughnutChart } from './helpers/chartCreator.js';
import { commentsDataCalcs } from './helpers/chartCalculation.js';

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  let videoId;
  let url = tabs[0].url;
  let usp = new URL(url);
  let params = new URLSearchParams(usp.search);

  if (url.includes('https://www.youtube.com/watch?v=')) {
    videoId = getVideoId(params);

    // xmlhttp request
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `https://commentiment.herokuapp.com/sentiment/yt?id=${videoId}`, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        const response = JSON.parse(xhr.responseText);
        let resArray = [];
        resArray.push(response);
        let positiveScores = resArray[0].filter(id => id.score > 0).map(id => id.score);
        let negativeScores = resArray[0].filter(id => id.score < 0).map(id => id.score);
        let percentPositive = commentsDataCalcs(positiveScores, negativeScores)[0];
        let percentNegative = commentsDataCalcs(positiveScores, negativeScores)[1];

        createDoughnutChart(percentPositive, percentNegative);
    }
  }
    xhr.send();
  } else {
    /* if not on a YouTube page */
    document.querySelector("h1").innerHTML = "Go to YouTube.com to use this app!";
    document.getElementById("myChart").style.display = "none";
  }
});