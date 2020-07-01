import { CatalogueConnection } from '../server-models/server-models';
import { Card } from '../../../shared-models';

export class DynamoCatalogue implements CatalogueConnection {
  AWS: any;
  docClient: any;
  constructor() {
    this.AWS = require('aws-sdk');
    this.AWS.config.update({ region: 'ca-central-1' });
    this.docClient = new this.AWS.DynamoDB.DocumentClient();
  }

  scanDynamoDBTable(tableName: string): Promise<Card[]> {
    const params = {
      TableName: tableName,
    };
    return new Promise<Card[]>((resolve, reject) => {
      this.docClient.scan(params, (err: any, data: any) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.info(
            'Scanned ',
            data.ScannedCount,
            ' items from ',
            tableName
          );
          resolve(data.Items);
        }
      });
    });
  }

  getWhiteCatalogue(): Promise<Card[]> {
    return this.scanDynamoDBTable('superfightWhiteCatalogue');
  }

  getBlackCatalogue(): Promise<Card[]> {
    return this.scanDynamoDBTable('superfightBlackCatalogue');
  }
}
