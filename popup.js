import {
  getVideoId
} from './helpers/videoId.js';
import {
  createDoughnutChart,
  createPieChart
} from './helpers/chartCreator.js';
import {
  doughnutChartDataCalcs,
  pieChartDataCalcs
} from './helpers/chartCalculation.js';
import {
  getRandomColor
} from './helpers/randColorGenerator.js';

chrome.tabs.query({
  active: true,
  currentWindow: true
}, function (tabs) {
  let videoId;
  let url = tabs[0].url;
  let usp = new URL(url);
  let params = new URLSearchParams(usp.search);

  if (url.includes('https://www.youtube.com/watch?v=')) {
    videoId = getVideoId(params);

    // xmlhttp request
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `https://commentiment.herokuapp.com/sentiment/yt?id=${videoId}`, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        const response = JSON.parse(xhr.responseText);
        let resArray = [];
        resArray.push(response);

        // Doughnut chart
        let positiveScores = resArray[0].filter(id => id.score > 0).map(id => id.score);
        let negativeScores = resArray[0].filter(id => id.score < 0).map(id => id.score);
        let percentPositive = doughnutChartDataCalcs(positiveScores, negativeScores)[0];
        let percentNegative = doughnutChartDataCalcs(positiveScores, negativeScores)[1];

        // Pie chart
        let colorArray = [];
        Object.keys(pieChartDataCalcs(resArray)).forEach(() => colorArray.push(getRandomColor()));
        let sumPos = Object.values(pieChartDataCalcs(resArray)).reduce((prev, curr) => curr + prev);
        let labelArray = Object.keys(pieChartDataCalcs(resArray));
        let dataArray = Object.values(pieChartDataCalcs(resArray)).map(val => ((val / sumPos) * 100).toFixed(0));

        createDoughnutChart(percentPositive, percentNegative);
        createPieChart(labelArray, colorArray, dataArray);
      }
    }
    xhr.send();
  } else {
    /* if not on a YouTube page */
    document.querySelector("h1").innerHTML = "Go to YouTube.com to use this app!";
    document.getElementById("myChart").style.display = "none";
  }
});