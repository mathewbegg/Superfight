import { CatalogueConnection } from "./server-models";
import { Card } from '../../../shared-models';

export class DynamoCatalogue implements CatalogueConnection {
  AWS: any;
  constructor() {
    this.AWS = require('aws-sdk');

    this.AWS.config.update({ region: 'ca-central-1' });

    var docClient = new this.AWS.DynamoDB.DocumentClient();
  };

  getWhiteCatalogue(): Card[] {
    const params = {
      TableName: 'superfightWhiteCatalogue'
    }

    return null;
  }

  getBlackCatalogue(): Card[] {
    return null;
  }
}