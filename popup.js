const uniqueChar = 'v=';

const getVideoId = url => url.slice(url.indexOf(uniqueChar) + 2);

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

const commentsDataCalcs = (positiveScores, negativeScores) => {
  let sumPos = positiveScores.reduce((previous, current) => current += previous);
  let avgPos = (sumPos / positiveScores.length);
  let sumNeg = negativeScores.reduce((previous, current) => current += previous);
  let avgNeg = (sumNeg / negativeScores.length);
  let maxVal = avgPos + (-avgNeg);
  let positive = (avgPos*(100/maxVal)).toFixed(0);
  let negative = (-avgNeg*(100/maxVal)).toFixed(0);
  return [positive, negative];
}

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  let videoId;

  if (tabs[0].url.includes(uniqueChar)) {
    videoId = getVideoId(tabs[0].url);

    // xmlhttp request
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `https://commentiment.herokuapp.com/sentiment/yt?id=${videoId}`, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        const response = JSON.parse(xhr.responseText);
        let resArray = [];
        let positiveScores = [];
        let negativeScores = [];
        resArray.push(response);
        resArray[0].forEach(val => {
          if(val.score > 0) {
            positiveScores.push(val.score);
          } else {
            negativeScores.push(val.score);
          }
        });
        let percentPositive = commentsDataCalcs(positiveScores, negativeScores)[0];
        let percentNegative = commentsDataCalcs(positiveScores, negativeScores)[1];

        createDoughnutChart(percentPositive, percentNegative);
    }
  }
    xhr.send();
  } else {
    document.querySelector("h1").innerHTML = "Go to YouTube.com to use this app!";
    document.getElementById("myChart").style.display = "none";
  }
});