import { CatalogueConnection } from '../server-models';
import { Card } from '../../../shared-models';
import { whiteCatalogue } from '../../../data/superfightWhiteCatalogue';
import { blackCatalogue } from '../../../data/superfightBlackCatalogue';

export class LocalJsonCatalogue implements CatalogueConnection {
  getWhiteCatalogue(): Promise<Card[]> {
    return new Promise((fullfill) => {
      fullfill(whiteCatalogue);
    });
  }

  getBlackCatalogue(): Promise<Card[]> {
    return new Promise((fullfill) => {
      fullfill(blackCatalogue);
    });
  }
}
