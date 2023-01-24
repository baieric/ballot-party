const esb = require('elastic-builder');

export default class GoldenGlobesQuery {
  constructor(body=null, query = null){
    this._requestBody = body ?? esb.requestBodySearch()
      .sort(esb.sort('year', 'desc'))
      .source(["url","winner","year","category_name","category_type","name", "title", "person_nominations","person_wins","film_nominations","film_wins"]);

    this._query = query ?? esb.boolQuery();
  }

  toJSON(){
    return this._requestBody.query(this._query).toJSON();
  }

  sortByYearAsc(){
    return new GoldenGlobesQuery(
      this._requestBody.sort(esb.sort('year', 'asc')),
      this._query,
    );
  }

  sortByYearDesc(){
      return new GoldenGlobesQuery(
        this._requestBody.sort(esb.sort('year', 'desc')),
        this._query,
      );
  }

  setSource(source) {
    return new GoldenGlobesQuery(
      this._requestBody.source(source),
      this._query,
    );
  }

  categoryName(name){
    return new GoldenGlobesQuery(
      this._requestBody,
      this._query.must(esb.termQuery('category_name', name)),
    );
  }

  year(year){
    return new GoldenGlobesQuery(
      this._requestBody,
      this._query.must(esb.termQuery('year', year)),
    );
  }
  categoryType(type){ // see GoldenGlobesConstants GoldenGlobesResultsCategory
    return new GoldenGlobesQuery(
      this._requestBody,
      this._query.must(esb.termQuery('category_type', type))
    );
  }
  nameOrTitle(nameOrTitle){
    return new GoldenGlobesQuery(
      this._requestBody,
      this._query.must(esb.boolQuery().should([
        esb.termQuery('title', nameOrTitle),
        esb.termQuery('name', nameOrTitle),
        esb.termQuery('title_c', nameOrTitle),
        esb.termQuery('name_c', nameOrTitle),
        esb.wildcardQuery('title', nameOrTitle),
        esb.wildcardQuery('name', nameOrTitle),
        esb.wildcardQuery('title_c', nameOrTitle),
        esb.wildcardQuery('name_c', nameOrTitle),
        esb.wildcardQuery('title.keyword', nameOrTitle),
        esb.wildcardQuery('name.keyword', nameOrTitle),
        esb.wildcardQuery('title_c.keyword', nameOrTitle),
        esb.wildcardQuery('name_c.keyword', nameOrTitle),
      ])),
    );
  }
}
