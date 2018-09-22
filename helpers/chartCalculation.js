/* returns an array with two values: percent of positive comments and percent of
negative ones */
export const commentsDataCalcs = (positiveScores, negativeScores) => {
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