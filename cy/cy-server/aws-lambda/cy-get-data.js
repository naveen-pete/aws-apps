const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10', region: 'ap-south-1' });

exports.handler = (event, context, callback) => {
  const type = event.type;
  if (event.type === 'all') {
    const params = {
      TableName: 'compare-yourself'
    };

    dynamodb.scan(params, function (err, data) {
      if (err) {
        console.log('getData (All) error:', err);
        callback(err);
      } else {
        console.log('getData (All) result:', data);
        const items = data.Items.map(i => ({
          age: +i.Age.N,
          height: +i.Height.N,
          income: +i.Income.N
        }));
        callback(null, items);
      }
    });
  } else if (event.type === 'single') {
    const params = {
      Key: {
        UserId: {
          S: "u02"
        }
      },
      TableName: 'compare-yourself'
    };

    dynamodb.getItem(params, function (err, data) {
      if (err) {
        console.log('getData (Single) error:', err);
        callback(err);
      } else {
        console.log('getData (Single) result:', data);
        const items = [{
          age: +data.Item.Age.N,
          height: +data.Item.Height.N,
          income: +data.Item.Income.N
        }];
        callback(null, items);
      }
    });
  } else {
    callback('getData - type is wrong or missing');
  }
};
