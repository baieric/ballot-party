import axios from 'axios';

export default class GoldenGlobesApi {
  constructor(){
    this._source_content_type = "application/json";
  }

  search(query, pageSize=15, page=1) {
    const from = (page - 1) * pageSize;
    return axios.get("https://www.goldenglobes.com/__es/elasticsearch_index_pantheon_live_nominations_ag77nkpx/_search", {
  		params: {
  			source: JSON.stringify(query.toJSON()),
  			size: pageSize,
        from: from,
        source_content_type: this._source_content_type
  		}
  	});
	}

  parseSearchResponse(response) {
    return response.data.hits.hits.map(hit => hit._source);
  }

}
