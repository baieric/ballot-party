import GoldenGlobesApi from './goldenGlobesApi';

export class AwardsDbApi {
  _goldenGlobes;
  _oscars;

  constructor() {}

  goldenGlobes() {
    return this._goldenGlobes || (this._goldenGlobes = new GoldenGlobesApi());
  }
}
