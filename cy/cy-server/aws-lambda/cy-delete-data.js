const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10', region: 'ap-south-1' });

exports.handler = (event, context, callback) => {
  console.log('event:', event);

  const params = {
    Key: {
      UserId: {
        S: event.userId
      }
    },
    TableName: 'compare-yourself'
  };

  dynamodb.deleteItem(params, function (err, data) {
    if (err) {
      console.log('deleteData error:', err);
      callback(err);
    } else {
      console.log('deleteData result:', data);
      callback(null, data);
    }
  });
};
