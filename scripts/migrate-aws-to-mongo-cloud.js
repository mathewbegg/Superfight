var MongoClient = require('mongodb').MongoClient;
var AWS = require('aws-sdk');

AWS.config.update({
  region: 'ca-central-1',
});
var docClient = new AWS.DynamoDB.DocumentClient();

mongoUri = 'mongodb+srv://mathewbegg:<password>-uiike.mongodb.net/SuperfightDB?retryWrites=true&w=majority';

MongoClient.connect(
  mongoUri,
  { useUnifiedTopology: true },
  (err, client) => {
    if (err) console.error(err);
    console.log('Connected to MongoDB');
    const collection = client.db('superfightDB').collection('whiteCatalogue');
    const yeet = collection.find({text: 'Abraham Lincoln'}).toArray.forEach(x => {
      console.log('yeet', x);
    });
    // console.log('yeet', yeet);
    client.close();
  }
);
