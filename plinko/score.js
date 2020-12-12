const outputs = [];

const predictionPoint = 300;


function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSetSize = 100;
  const k = 10;

  _.range(0, 3).forEach(feature => {
    // https://www.udemy.com/course/machine-learning-with-javascript/learn/lecture/12279544#questions
    const data = _.map(outputs, row => [row[feature], _.last(row)]);
    const [testSet, trainingSet] = splitDataSet(minMax(data,1),testSetSize);
    const accuracy = _.chain(testSet)
    .filter(testPoint => knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint))
    .size()
    .divide(testSetSize)
    .value();

    console.log('For feature of: ', feature, ' Accuracy is: ', accuracy);
  });
}

// https://www.udemy.com/course/machine-learning-with-javascript/learn/lecture/12265836#questions
function knn(data, point, k){
  return _.chain(data)
    .map(row => {
    
      return [
        distance(_.initial(row), point), 
        _.last(row)
      ]
    
    })
    .sortBy(row => row[0])
    .slice(0, k)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt()
    .value(); // value() terminates the entire chain.
}

function distance(pointA, pointB){
  return _.chain(pointA)
    .zip(pointB)
    .map(([a, b]) => (a - b) ** 2)
    .sum()
    .value() ** 0.5;
 }

 function splitDataSet(data, testCount) {
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];

 }

 function minMax(data, featureCount){
  const clonedData = _.cloneDeep(data);

  for (let i = 0; i < featureCount; i++){
    const column = clonedData.map(row => row[i]);

    const min = _.min(column);
    const max = _.max(column);

    for (let j = 0; j < clonedData.length; j++){
      clonedData[j][i] = (clonedData[j][i] - min) / (max - min);

    }
  }
  return clonedData;
 }

