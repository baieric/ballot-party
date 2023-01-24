import {GOLDEN_GLOBES_2023} from './constants/GoldenGlobesConstants';
import BaseAwardsShowPage from './components/BaseAwardsShowPage';
import AwardsDbApi from './awardsdb/AwardsDbApi';
import GoldenGlobesQuery from './awardsdb/GoldenGlobesQuery';
import {useState, useEffect} from 'react';


function formatNom(nom) {
  const category_type = nom["category_type"][0];
  const ret =  {
    category_type: category_type,
    title: nom["title"][0].split(", the")[0],
    winner: nom["winner"][0],
  };
  if ("name" in nom) {
    ret["name"] = nom["name"];
  }
  return ret;
}

function arrToMap(arr) {
  const ret = {};
  for (const nom of arr) {
    // ignore special awards
    if (!("title" in nom)) {
      continue;
    }
    const formattedNom = formatNom(nom);
    const catName = nom["category_name"][0];
    if (catName in ret) {
      ret[catName]["nominees"].push(formattedNom);
    } else {
      ret[catName] = {nominees: [formattedNom]};
    }
    if (nom["winner"][0]) {
      ret[catName]["winner"] = formattedNom;
    }
  }
  return ret;
}

function GoldenGlobesPage(props) {
  const eventDate = new Date(GOLDEN_GLOBES_2023['date']);
  const [nominees, setNominees] = useState(null);

  // load API
  useEffect(() => {
    const api = new AwardsDbApi().goldenGlobes();
    const ggQuery = new GoldenGlobesQuery().year(2023).setSource(["name", "category_name", "category_type", "title", "winner"])
    api.search(ggQuery, 200)
      .then(response => {
        const hits = api.parseSearchResponse(response);
        setNominees(arrToMap(hits));
        console.log(arrToMap(hits));
      })
      .catch(error => {});
  }, []);



  // const api = new AwardsDbApi().oscars();
  // api.search(94, (date, noms) => {
  //   console.log(date);
  //   console.log(noms);
  // });
  // api.liveWinners(94, winners => {
  //   console.log(winners);
  // })

  return <BaseAwardsShowPage
    title={GOLDEN_GLOBES_2023['title']}
    date={eventDate}
    categories={GOLDEN_GLOBES_2023['categories']}
    storageKey="gg23"
  />;
}
export default GoldenGlobesPage;
