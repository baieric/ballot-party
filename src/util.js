import { map } from "rxjs/operators";
import { ajax } from 'rxjs/ajax';

export function ajaxObservable(url) {
  return ajax({
  	url: url,
  	crossDomain: true
  }).pipe(
  	map(ajax => {
  		return ajax.response;
  	})
  );
}
