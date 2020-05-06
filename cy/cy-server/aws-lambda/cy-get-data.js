const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10', region: 'ap-south-1' });
const cisp = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });

exports.handler = (event, context, callback) => {
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
    const cispParams = {
      AccessToken: event.accessToken
    };

    cisp.getUser(cispParams, (err, result) => {
      if (err) {
        console.log('getUser error:', err);
        callback(err);
      } else {
        console.log('getUser result:', result);
        const userId = result.UserAttributes[0].Value;

        const params = {
          Key: {
            UserId: {
              S: userId
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

            if (!data.Item) {
              console.log('User data not found.');
              callback('User data not found.');
              return;
            }

            const items = [{
              age: +data.Item.Age.N,
              height: +data.Item.Height.N,
              income: +data.Item.Income.N
            }];
            callback(null, items);
          }
        });
      }
    });
  } else {
    callback('getData - type is wrong or missing');
  }
};
