import wiki from 'wikipedia';
import axios from 'axios';

export default class OscarsApi {
  constructor() {
  }

  _numToNth(num) {
    if (num >= 4 && num <= 20) {
      return `${num}th`;
    }
    if (num % 10 === 1) {
      return `${num}st`;
    }
    if (num % 10 === 2) {
      return `${num}nd`;
    }
    if (num % 10 === 3) {
      return `${num}rd`;
    }
    return `${num}th`;
  }

  _stripHtml(s) {
    var d = document.createElement('div');
    d.innerHTML = s;
    return d.textContent || d.innerText;
  }

  _pageTitle(num){
    return `${this._numToNth(num)}_Academy_Awards`;
  }

  _formatNominee(n){
     const titleSplit = n.split(/-|–/).map(s => s.trim());

     const songRegex = /^"(.*)" from (.*)$/;
     const songMatch = titleSplit[0].match(songRegex);
     if (songMatch != null) {
       return {
         nominee: songMatch[1],
         secondary: songMatch[2],
         tertiary: titleSplit[1]
       }
     }

     const internationalRegex = /^(.*) \((.*)\) in (.*)$/
     const internationalMatch = titleSplit[0].match(internationalRegex);
     if (internationalMatch != null) {
       return {
         nominee: internationalMatch[1],
         secondary: internationalMatch[2],
         tertiary: titleSplit[1],
       }
     }
     const posthumousRegex = /^(.*) \(posthumous nomination\)$/
     const nameChangeRegex = /^(.*) \(nominated as (.*)\)/
     const posthumousMatch = titleSplit[0].match(posthumousRegex);
     const nameChangeMatch = titleSplit[0].match(nameChangeRegex);
     let ret = {nominee: titleSplit[0]};
     if (posthumousMatch != null) {
       ret = {nominee: posthumousMatch[1]};
     } else if (nameChangeMatch != null) {
       ret = {nominee: nameChangeMatch[1]};
     }
     const alphaRegex = /^(.*)\[upper-alpha (.*)\]$/;
     if(ret["nominee"].endsWith("*")){
       ret["nominee"] = ret["nominee"].slice(0, -1);
     }
     const firstAlphaMatch = ret["nominee"].match(alphaRegex);
     if (firstAlphaMatch != null) {
       ret["nominee"] = firstAlphaMatch[1];
     }
     const secondarySplit = titleSplit[1].split(";").map(s => s.trim());
     ret["secondary"] = secondarySplit[0];
     if(ret["secondary"].endsWith("*")){
       ret["secondary"] = ret["secondary"].slice(0, -1);
     }

     const secondAlphaMatch = ret["secondary"].match(alphaRegex);
     if (secondAlphaMatch != null) {
       ret["secondary"] = secondAlphaMatch[1];
     }
     if (secondarySplit.length > 1) {
       ret["tertiary"] = secondarySplit[1];
     }
     return ret;
   }

  _categoryArrToDict(arr, date) {
    const today = new Date();
    const winner = date.setHours(0,0,0,0) >= today.setHours(0,0,0,0) ? null : arr[1];
    return {
      category: arr[0],
      winner: winner != null ? this._formatNominee(winner) : null,
      nominees: arr.slice(1).map(n => this._formatNominee(n)),
    };
  }

  _getNomTable(tables){
    return tables.find(t => {
      return t.find(row => {
        return row.find(i => i.startsWith("Best Actor"));
      });
    });
  }

  date(num, callback) {
    const pageTitle = this._pageTitle(num);
    (async () => {
      try {
        const infobox = await wiki.infobox(pageTitle);
        callback(infobox.date);
      } catch (error) {
      	callback({error: error});
      }
    })();
  }

  search(num, callback) {
    const pageTitle = this._pageTitle(num);
    (async () => {
      try {
        const page = await wiki.page(pageTitle);
        const infobox = await page.infobox();
        let date = infobox.date;
        if (!(date instanceof Date)) {
          date = date.date;
        }

        axios.get(`https://www.wikitable2json.com/api/${pageTitle}`, {
          table: [0],
          lang: 'en',
          cleanRef: true
      	}).then(response => {
          // if page does not exist, or nominees are not published yet, return nothing
          if ('error' in response) {
            callback(date, []);
          } else {
            const nomTable = this._getNomTable(response.data);
            if (nomTable == null) {
              callback(date, []);
            } else {
              const table = nomTable
                .flat()
                .filter(s => s.length > 0)
                .map(s => s.split("\n"))
                .map(arr => this._categoryArrToDict(arr.filter(s => s.length > 0), date));
              const categoryDict = {}
              table.forEach(row => {
                categoryDict[row["category"]] = row;
              });
              callback(
                date,
                categoryDict
              );
            }
          }
        });

      } catch (error) {
      	console.log(error);
      }
    })();
	}

  liveWinners(num, callback) {
    const pageTitle = this._pageTitle(num);

    (async () => {
      try {
        const html = await wiki.html(pageTitle);
        const winnerRegex = /^.*<\/b><img alt="double-dagger".*$/gm;
        const htmlWinners = html.match(winnerRegex);
        const winners = htmlWinners.map(s => this._formatNominee(this._stripHtml(s)));
        callback(winners);
      } catch (error) {
      	console.log(error);
      }
    })();
  }
}
