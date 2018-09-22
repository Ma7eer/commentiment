export const createDoughnutChart = (positive, negative) => {
  var ctx = document.getElementById("myChart1").getContext("2d");
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

var ctx2 = document.getElementById('myChart2').getContext('2d');
var ctx3 = document.getElementById('myChart3').getContext('2d');
var data = {
  datasets: [{
      data: [10, 20, 30],
      backgroundColor: ["green", "red", "blue"]
  }],

  // These labels appear in the legend and in the tooltips when hovering different arcs
  labels: [
      'Red',
      'Yellow',
      'Blue'
  ]
};

// For a pie chart
var myPieChart = new Chart(ctx2,{
  type: 'pie',
  data: data,
  options: {}
});

// And for a doughnut chart
var myDoughnutChart = new Chart(ctx3, {
  type: 'doughnut',
  data: data,
  options: {}
});
