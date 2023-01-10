import "./BaseAwardsShowPage.css";
import {searchPerson, searchMovie, searchTV, getTMDBImage} from '../util/TmdbUtil';
import NomineeSelectScreen from './NomineeSelectScreen';
import {useState, useEffect} from "react";
import {getWinnerValue} from '../util/NomineeUtil';
import {ArrowLeftOutlined, ArrowRightOutlined, CloseOutlined} from '@ant-design/icons';
import {Modal, Button, Space } from 'antd';
import ClickContainer from './ClickContainer';
import Nominee from './Nominee';


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

  return (
    <ClickContainer onClick={onClick}>
      <p className="main-text">{title}</p>
      {selectedNominee != null && <>
        <p className="tertiary-text">Your selection</p>
        <Nominee data={selectedNominee} getImage={key => getTMDBImage(images[key], "sm")} />
      </>}
    </ClickContainer>
  );
}

function FormFooter(props){
  const {formPage, numPages, onPrevious, onNext} = props;
  return (
    <div>
    <Space wrap>
      <Button onClick={onPrevious} disabled={formPage === 0} icon={<ArrowLeftOutlined/>} />
      <Button onClick={onNext} disabled={formPage === numPages - 1} icon={<ArrowRightOutlined/>} />
    </Space>
    </div>
  )
}

function BaseAwardsShowPage(props) {
  const {title, categories, storageKey, date} = props;
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
    if (formPage !== categoryKeys.length - 1) {
      setTimeout(() => setFormPage(old => old + 1), 300);
    }
  }

  const dateOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    hour12: true,
    timeZoneName: "short",
  };

  return (
    <>
      <p className="logo-text main-text">{title}</p>
      <p className="secondary-text-serif ceremony-date">
        {date.toLocaleString("en-US", dateOptions)}
      </p>
      <div className="categories">
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
      </div>
      <Modal
        open={formPage != null}
        title={categoryKeys[formPage]}
        footer={<FormFooter
          formPage={formPage}
          numPages={categoryKeys.length}
          onPrevious={() => setFormPage(old => old - 1)}
          onNext={() => setFormPage(old => old + 1)}
        />}
        onCancel={() => setFormPage(null)}
        closeIcon={<CloseOutlined style={{color: "#fff"}} />}
      >
        <NomineeSelectScreen
          category={categoryKeys[formPage]}
          nominees={categories[categoryKeys[formPage]]}
          selected={mySelections[categoryKeys[formPage]]}
          updateSelection={updateSelection}
          images={images}
        />
      </Modal>
    </>
  );
}
export default BaseAwardsShowPage;
