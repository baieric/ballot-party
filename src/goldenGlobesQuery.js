const esb = require('elastic-builder');

export default class GoldenGlobesQuery {
  constructor(body=null){
    this._requestBody = body ?? esb.boolQuery()
      .sortByYearDesc()
      .source(["url","winner","year","category_name","category_type","name","person_nominations","person_wins","film_nominations","film_wins"]);
  }

  sortByYearAsc(){
    return GoldenGlobesQuery(this._requestBody.sort(esb.sort('year', 'asc'));
  }

  sortByYearDesc(){
      return GoldenGlobesQuery(this._requestBody.sort(esb.sort('year', 'desc')));
  }

  setSource(source) {
    return GoldenGlobesQuery(this._requestBody.source(source));
  }

  categoryName(name){
    return GoldenGlobesQuery(this._requestBody.must(esb.termQuery('category_name', name)));
  }

  year(year){
    return GoldenGlobesQuery(this._requestBody.must(esb.termQuery('year', year));
  }
  categoryType(type){
    return GoldenGlobesQuery(this._requestBody.must(esb.termQuery('category_type', year));
  }
  nameOrTitle(nameOrTitle){
    return GoldenGlobesQuery(this._requestBody
      .must(esb.boolQuery().should([
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
      ]));
  }
}
