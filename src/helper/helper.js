export function attempts_Number(result) {
  return result.filter((r) => r != undefined).length;
}

export function earnedPoints_Number(result, answers, pointsPerQuestion) {
  return result
    .map((r, i) => answers[i] === r)
    .filter((i) => i)
    .map((i) => pointsPerQuestion)
    .reduce((prev, curr) => prev + curr, 0);
}

export function resultStatus(totalPoints, earnedPoints) {
    return (totalPoints * 50/100) < earnedPoints /** if 50% of total points is less than earned points */
}