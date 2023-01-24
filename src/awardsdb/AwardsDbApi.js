import GoldenGlobesApi from './GoldenGlobesApi';
import OscarsApi from './OscarsApi';

export default class AwardsDbApi {
  _goldenGlobes;
  _oscars;

  constructor() {}

  goldenGlobes() {
    return this._goldenGlobes || (this._goldenGlobes = new GoldenGlobesApi());
  }

  oscars() {
    return this._oscars || (this._oscars = new OscarsApi());
  }
}
