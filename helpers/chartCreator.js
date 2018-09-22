export const createDoughnutChart = (positive, negative) => {
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