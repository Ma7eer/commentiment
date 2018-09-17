const uniqueChar = 'v=';
let videoId;
let resArray = [];

const getVideoId = url => url.slice(url.indexOf(uniqueChar) + 2);

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

  if (tabs[0].url.includes(uniqueChar)) {
    videoId = getVideoId(tabs[0].url);

    // http request
    // inspect body of chrome extension to see the result in the console
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `https://commentiment.herokuapp.com/sentiment/yt?id=${videoId}`, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        const response = JSON.parse(xhr.responseText);
        let positive = [];
        let negative = [];
        let token =[];
        resArray.push(response);
        resArray[0].forEach((id) => {
          // console.log(typeof(id.score));
          if(id.score > 0) {
            positive.push(id.comparative);
          } else {
            negative.push(id.comparative);
          }
        });
        let sumPos = positive.reduce((previous, current) => current += previous);
        let avgPos = (sumPos / positive.length);
        let sumNeg = negative.reduce((previous, current) => current += previous);
        let avgNeg = (sumNeg / negative.length);

        var ctx = document.getElementById('myChart').getContext('2d');
        var myDoughnutChart = new Chart(ctx,{
          type: 'doughnut',
          data: {
            labels: [ "Positive", "Negative"],
            datasets: [{
                label: "Youtube Comment Sentiment",
                backgroundColor: ['green', 'red'],
                borderColor: 'white',
                data: [(avgPos*(100/5)).toFixed(2)*10, (-avgNeg*(100/5)).toFixed(2)*10],
            }]
        },
          options: {}
      });
    }
  }
    xhr.send();
  } else {
    console.log('wrong page');
  }
});