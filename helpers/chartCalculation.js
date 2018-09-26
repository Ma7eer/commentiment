/* returns an array with two values: percent of positive comments and percent of
negative ones */
export const doughnutChartDataCalcs = (positiveScores, negativeScores) => {
  if (positiveScores.length > 0 && negativeScores.length > 0) {
    let sumPos = positiveScores.reduce((prev, curr) => curr + prev);
    let avgPos = (sumPos / positiveScores.length);
    let sumNeg = negativeScores.reduce((prev, curr) => curr + prev);
    let avgNeg = (sumNeg / negativeScores.length);
    let maxVal = avgPos + (-avgNeg);
    let positive = (avgPos * (100 / maxVal)).toFixed(0);
    let negative = (-avgNeg * (100 / maxVal)).toFixed(0);
    return [positive, negative];
  } else if (positiveScores.length === 0) {
    return [0, 100];
  } else {
    return [100, 0];
  }
}

export const pieChartDataCalcs = (arr) => {
  let posAndNegWordsString = arr[0].filter(id => id.positive.length > 0).map(id => id.positive).concat(arr[0].filter(id => id.negative.length > 0).map(id => id.negative));
  let merged = [].concat.apply([], posAndNegWordsString); // remove empty arrays
  const countInArray = (array, what) => {
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
  return obj;
}