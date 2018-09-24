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
        let x = resArray[0].filter(id => id.positive.length > 0).map(id => id.positive).concat(resArray[0].filter(id => id.negative.length > 0).map(id => id.negative));
        var merged = [].concat.apply([], x);
        console.log(merged);
        function countInArray(array, what) {
          var count = 0;
          for (var i = 0; i < array.length; i++) {
              if (array[i].includes(what)) {
                  count++;
              }
          }
          return count;
      }
      let obj = {};
      merged.forEach(val => {
        obj[val] = countInArray(merged, val);
      })
      console.log(obj);
      console.log(Object.keys(obj));
      console.log(Object.values(obj));
      let colorArray = [];
      console.log(colorArray);
      function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
      Object.keys(obj).forEach(() => colorArray.push(getRandomColor()));
      let sumPos = Object.values(obj).reduce((prev, curr) => curr + prev)
      var ctx2 = document.getElementById('myChart2').getContext('2d');
      var myPieChart = new Chart(ctx2,{
        type: 'pie',
        data: {
          labels: Object.keys(obj),
          datasets: [{
              backgroundColor: colorArray,
              borderColor: "white",
              data: Object.values(obj).map(val => ((val/sumPos)*100).toFixed(0)),
          }]
      },
        options: {}
      });

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