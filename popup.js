const videoIdQueryParamId = 'v';

/* returns youtube video id from youtube url */
const getVideoId = params => params.get(videoIdQueryParamId);

/* uses chartsjs to create a doughnut chart*/
const createDoughnutChart = (positive, negative) => {
  var ctx = document.getElementById("myChart").getContext("2d");
  var myDoughnutChart = new Chart(ctx,{
    type: "doughnut",
    data: {
      labels: [ "Positive", "Negative"],
      datasets: [{
          label: "Youtube Comment Sentiment",
          backgroundColor: ["green", "red"],
          borderColor: "white",
          data: [positive, negative],
      }]
  },
    options: {}
});
}

/* returns an array with two values: percent of positive comments and percent of
negative ones */
const commentsDataCalcs = (positiveScores, negativeScores) => {
  if(positiveScores.length > 0 && negativeScores.length > 0) {
  let sumPos = positiveScores.reduce((prev, curr) => curr + prev);
  let avgPos = (sumPos / positiveScores.length);
  let sumNeg = negativeScores.reduce((prev, curr) => curr + prev);
  let avgNeg = (sumNeg / negativeScores.length);
  let maxVal = avgPos + (-avgNeg);
  let positive = (avgPos*(100/maxVal)).toFixed(0);
  let negative = (-avgNeg*(100/maxVal)).toFixed(0);
  return [positive, negative];
  } else if (positiveScores.length === 0) {
    return [0, 100];
  } else {
    return [100, 0];
  }
}

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