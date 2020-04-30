const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10', region: 'ap-south-1' });

exports.handler = (event, context, callback) => {
  const params = {
    Item: {
      UserId: {
        S: event.userId
      },
      Age: {
        N: event.age
      },
      Height: {
        N: event.height
      },
      Income: {
        N: event.income
      }
    },
    TableName: "compare-yourself"
  };

  dynamodb.putItem(params, function (err, data) {
    if (err) {
      console.log('storeData error:', err);
      callback(err);
    } else {
      console.log('storeData result:', data);
      callback(null, data);
    }
  });
};
