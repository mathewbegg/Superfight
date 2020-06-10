var AWS = require('aws-sdk');

AWS.config.update({
  region: 'ca-central-1',
});

var docClient = new AWS.DynamoDB.DocumentClient();

const params = {
  TableName: 'superfightWhiteCatalogue',
  Key: {
    text: 'velociraptor',
  },
};

docClient.get(params, function (err, data) {
  if (err) {
    console.error(
      'Unable to read item. Error JSON:',
      JSON.stringify(err, null, 2)
    );
  } else {
    console.log('GetItem succeeded:', JSON.stringify(data, null, 2));
  }
});
