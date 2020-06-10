var MongoClient = require('mongodb');
var AWS = require('aws-sdk');

AWS.config.update({
  region: 'ca-central-1',
});

var docClient = new AWS.DynamoDB.DocumentClient();

MongoClient.connect(
  'mongodb://localhost:27017',
  {
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) return console.error(err);
    console.log('mongoDB connected');
    db = client.db('superfightDB');
    db.collection('blackCatalogue')
      .find()
      .toArray()
      .then((catalogue) => {
        catalogue.forEach((card) => {
          const params = {
            TableName: 'superfightBlackCatalogue',
            Item: {
              text: card.text,
              color: card.color,
              specials: card.specials || null,
            },
          };

          docClient.put(params, function (err, data) {
            if (err) {
              console.error(
                'Unable to add card. Error JSON:',
                JSON.stringify(err, null, 2)
              );
            } else {
              console.log('added card ', params.Item);
            }
          });
        });
      });
  }
);
