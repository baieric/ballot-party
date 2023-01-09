import "./BaseAwardsShowPage.css";
import {searchPerson, searchMovie, searchTV, getTMDBImage} from '../util/TmdbUtil';
import NomineeSelectScreen from './NomineeSelectScreen';
import {useState, useEffect} from "react";
import {getWinnerValue, getSubtitle} from '../util/NomineeUtil';
import {ArrowUpOutlined, ArrowDownOutlined} from '@ant-design/icons';
import {Modal, Button, Space } from 'antd';


function getAllImages(categories, setImages) {
  const peopleSet = new Set()
  const movieSet = new Set()
  const showSet= new Set();
  for (var c in categories){
    const nominees = categories[c];
    for (var n in nominees) {
      const nom = nominees[n];
      if (nom["type"] === "person" || nom["type"] === "crew") {
        // add person
        const people = nom["person"].split(",");
        for (var p in people) {
          peopleSet.add(people[p].trim());
        }
      } else if (nom["type"] === "movie" || nom["type"] === "song") {
        movieSet.add(nom["media"]);
      } else if (nom["type"] === "tv") {
        showSet.add(nom["media"]);
      }
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
    searchMovie(m)
      .then(response => {
        const path = response.data.results[0].poster_path;
        const newImage = {}
        newImage[m] = path;
        setImages(old => ({...old, ...newImage}));
      })
      .catch(error => {});
  }
  for (const s of showSet) {
    searchTV(s)
      .then(response => {
        const path = response.data.results[0].poster_path;
        const newImage = {}
        newImage[s] = path;
        setImages(old => ({...old, ...newImage}));
      })
      .catch(error => {});
  }
}

function Category(props) {
  const {title, nominees, selected, onClick, images} = props;

  const selectedNominee = nominees.find(n => getWinnerValue(n) === selected);
  let imageKeys = null;
  if (selectedNominee != null) {
    imageKeys = [selectedNominee["media"]];
    if (selectedNominee["type"] === "person" || selectedNominee["type"] === "crew") {
      imageKeys = selectedNominee["person"].split(", ").map(s => s.trim());
    }
  }
  console.log(selectedNominee, imageKeys);

  // TODO replace h5 with nicer UI
  return (
    <div className="category" onClick={onClick}>
      <h4>{title}</h4>
      {selectedNominee && imageKeys && <>
        <p>Your selection:</p>
        <Space wrap>
          {imageKeys.map(key =>
            <img
              key={key}
              src={getTMDBImage(images[key], "sm")}
              alt={key}
              width="75" height="112"
            />
          )}
          <div>
            <p>{getWinnerValue(selectedNominee)}</p>
            <p>{getSubtitle(selectedNominee)}</p>
          </div>
        </Space>
      </>}
    </div>
  );
}

function FormFooter(props){
  const {formPage, numPages, onUp, onDown} = props;
  return (
    <div>
    <Space wrap>
      <Button onClick={onUp} disabled={formPage === 0} icon={<ArrowUpOutlined/>} />
      <Button onClick={onDown} disabled={formPage === numPages - 1} icon={<ArrowDownOutlined/>} />
    </Space>
    </div>
  )
}

function BaseAwardsShowPage(props) {
  const {title, categories, storageKey} = props;
  const categoryKeys = Object.keys(categories);

  // check for existing selections
  const initialSelections = {};
  for (var category in categories){
    const selection = localStorage.getItem(`${storageKey} ${category}`);
    initialSelections[category] = selection;
  }

  const [mySelections, setMySelections] = useState(initialSelections);
  const [formPage, setFormPage] = useState(
    categoryKeys.every(key => mySelections[key] == null)
      ? 0
      : null
  );
  const [images, setImages] = useState({});

  // get all images on mount
  useEffect(() => getAllImages(categories, setImages), [categories]);


  const updateSelection = (category, nominee) => {
    const newSelection = {};
    newSelection[category] = nominee;
    setMySelections(old => ({...old, ...newSelection}));
    localStorage.setItem(`${storageKey} ${category}`, nominee);
  }

  return (
    <div>
      <h2>{title}</h2>
      {categoryKeys.map((category, index) =>
        <Category
          key={category}
          title={category}
          nominees={categories[category]}
          selected={mySelections[category]}
          onClick={() => setFormPage(index)}
          images={images}
        />
      )}
      <Modal
        open={formPage != null}
        footer={<FormFooter
          formPage={formPage}
          numPages={categoryKeys.length}
          onUp={() => setFormPage(old => old - 1)}
          onDown={() => setFormPage(old => old + 1)}
        />}
        onCancel={() => setFormPage(null)}
      >
        <NomineeSelectScreen
          category={categoryKeys[formPage]}
          nominees={categories[categoryKeys[formPage]]}
          selected={mySelections[categoryKeys[formPage]]}
          updateSelection={updateSelection}
          images={images}
        />
      </Modal>
    </div>
  );
}
export default BaseAwardsShowPage;
