import {ajaxObservable} from './util';

export default class GoldenGlobesApi {
  constructor(){
    this.BASE_URL = "https://www.goldenglobes.com/__es/elasticsearch_index_pantheon_live_nominations_ag77nkpx/_search";
    this._source_content_type = "application/json";
  }

  search(query, pageSize=15, page=1) {
    const from = (page - 1) * page_size;
		const url = `${this.BASE_URL}?source=${query.toJSON()}&size=${pageSize}&from=${from}&source_content_type=${this._source_content_type}`;
    return ajaxObservable(url);
	}
}
