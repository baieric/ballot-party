import BaseAwardsShowPage from './components/BaseAwardsShowPage';
import AwardsDbApi from './awardsdb/AwardsDbApi';
import {numToNth} from './util/stringUtil';
import {useState, useEffect} from 'react';
import {searchPerson, searchMovie} from './util/TmdbUtil';
import Spinner from './components/Spinner';
import './OscarsPage.css';

function normalize(s){
  // TODO handle accents
  // TODO how should we handle wikipedia title being different? or title having separator?
  return s.toLowerCase().replace(/\W/g, '');
}

function getAllImages(categories, n, setImages) {
  const peopleSet = new Set()
  const movieSet = new Set()
  for (var c in categories){
    if (["Best Writing (Title Writing)", "Director", "Directing", "Actor", "Actress"].some(p => c.includes(p))){
      categories[c].nominees.map(n => n.nominee.split(" and ").map(m => peopleSet.add(m)));
    } else if (c == "Best Original Song") {
      categories[c].nominees.map(n => movieSet.add(n.secondary));
    } else {
      categories[c].nominees.filter(n => n.nominee != "No specific film").map(n => movieSet.add(n.nominee));
    }
  }
  for (const p of peopleSet){
    searchPerson(p)
      .then(response => {
        const path = response.data.results[0].profile_path;
        const newImage = {}
        newImage[p] = path;
        setImages(old => ({...old, ...newImage}));
      })
      .catch(error => {});
  }
  for (const m of movieSet) {
    searchMovie(m, parseInt(n) + 1927)
      .then(response => {
        const results = response.data.results.filter(r => normalize(r.title).startsWith(normalize(m)) && r.poster_path != null);
        const handleResult = (r) => {
          let find = r[0];
          if (r.length > 1) {
            find = r.find(r => r.title.toLowerCase() == m.toLowerCase());
          }
          if (find != null) {
            const path = find.poster_path;
            const newImage = {}
            newImage[m] = path;
            setImages(old => ({...old, ...newImage}));
          }
        }
        if (results.length == 0) {
          searchMovie(m, parseInt(n) + 1927 - 1).then(response2 => {
            const results2 = response2.data.results.filter(r => normalize(r.title).startsWith(normalize(m)) && r.poster_path != null);
            if (results2.length == 0) {
              searchMovie(m, parseInt(n) + 1927 + 1).then(response3 => {
                const results3 = response3.data.results.filter(r => normalize(r.title).startsWith(normalize(m)) && r.poster_path != null);
                if (results3.length == 0) {
                  searchMovie(m, parseInt(n) + 1927 - 2).then(response4 => {
                    const results4 = response4.data.results.filter(r => normalize(r.title).startsWith(normalize(m)) && r.poster_path != null);
                    if (results4.length > 0){
                      handleResult(results4);
                    }
                  });
                } else {
                  handleResult(results3);
                }
              });
            } else {
              handleResult(results2);
            }
          });
        } else {
          handleResult(results);
        }
      })
      .catch(error => {});
  }
}

function OscarsPage(props) {
  const {n} = props;

  const [eventDate, setEventDate] = useState(null);
  const [categories, setCategories] = useState(null);
  const [images, setImages] = useState({});

  useEffect(
    () => {
      const api = new AwardsDbApi();
      const oscars = api.oscars();
      oscars.search(n, (date, categories) => {
        setEventDate(date);
        setCategories(categories);
        getAllImages(categories, n, setImages);
      });
    },
    []
  );

  if (eventDate == null || categories == null){
    return <div className="loading-root"><Spinner /></div>;
  }
  return <BaseAwardsShowPage
    title={`${numToNth(n)} Academy Awards`}
    date={eventDate}
    categories={categories}
    images={images}
    storageKey={`aa${n}`}
  />;
}
export default OscarsPage;
