var AWS = require('aws-sdk');
var fs = require('fs');

AWS.config.update({
  region: 'ca-central-1',
});

var docClient = new AWS.DynamoDB.DocumentClient();

const params = { TableName: 'superfightBlackCatalogue' };
const results = [];

docClient.scan(params, function (err, data) {
  if (err) {
    console.error(err);
  } else {
    console.log('scan succeeded');
    console.log(data);
    data.Items.forEach((item) => {
      console.log(item);
      results.push({
          text: item.text,
          color: item.color,
          specials: item.specials,
        });
    });
    fs.writeFile('../data/superfightBlackCatalogue.json', JSON.stringify(results, null, 2), (err) => {
      console.error(err);
    });
  }
});

//CREATING TABLE CODE
// const paramsLocal = {
//   TableName: "superfightWhiteCatalogue",
//   KeySchema: [{ AttributeName: "text", KeyType: "HASH" }],
//   AttributeDefinitions: [{ AttributeName: "text", AttributeType: "S" }],
//   ProvisionedThroughput: {
//     ReadCapacityUnits: 10,
//     WriteCapacityUnits: 10,
//   },
// };

// docClientLocal.createTable(paramsLocal, function (err, data) {
//   if (err) {
//     console.error(
//       'Unable to create table. Error JSON:',
//       JSON.stringify(err, null, 2)
//     );
//   } else {
//     console.log(
//       'Created table. Table description JSON:',
//       JSON.stringify(data, null, 2)
//     );
//   }
// });