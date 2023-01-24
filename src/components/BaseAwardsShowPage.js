import "./BaseAwardsShowPage.css";
import {getTMDBImage} from '../util/TmdbUtil';
import NomineeSelectScreen from './NomineeSelectScreen';
import {useState} from "react";
import {ArrowLeftOutlined, ArrowRightOutlined, CloseOutlined} from '@ant-design/icons';
import {Modal, Button, Space } from 'antd';
import ClickContainer from './ClickContainer';
import Nominee from './Nominee';

function getKey(n) {
  return `${n["nominee"]}-${n["secondary"]}`;
}

function Category(props) {
  const {title, nominees, selected, onClick, winner, images} = props;

  const selectedNominee = nominees.find(n => getKey(n) === selected);

  return (
    <ClickContainer onClick={onClick}>
      <p className="main-text">{title}</p>
      {selectedNominee != null && winner == null && <>
        <p className="tertiary-text">Your selection</p>
        <Nominee category={title} data={selectedNominee} getImage={key => getTMDBImage(images[key], "sm")} />
      </>}
      {selectedNominee != null && winner != null && getKey(selectedNominee) === getKey(winner) && <>
        <p className="tertiary-text">Your selection & Winner</p>
        <Nominee category={title} data={winner} getImage={key => getTMDBImage(images[key], "sm")} />
      </>}
      {selectedNominee != null && winner != null && getKey(selectedNominee) !== getKey(winner) && <>
        <p className="tertiary-text">Your selection</p>
        <Nominee category={title} data={selectedNominee} getImage={key => getTMDBImage(images[key], "sm")} />
        <p className="tertiary-text">Winner</p>
        <Nominee category={title} data={winner} getImage={key => getTMDBImage(images[key], "sm")} />
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
  const {title, categories, images, storageKey, date} = props;
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

  const updateSelection = (category, nominee) => {
    const newSelection = {};
    newSelection[category] = nominee;
    setMySelections(old => ({...old, ...newSelection}));
    localStorage.setItem(`${storageKey} ${category}`, nominee);
    if (formPage !== categoryKeys.length + 1) {
      setTimeout(() => setFormPage(old => old + 1), 600);
    }
  }

  const today = new Date();
  const isInPast = date < today;

  const dateOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  return (
    <div className="awards-page">
      <p className="logo-text main-text">{title}</p>
      <p className="secondary-text-serif ceremony-date">
        {date.toLocaleDateString("en-US", dateOptions)}
      </p>
      <div className="categories">
        {categoryKeys.map((category, index) =>
          <Category
            key={category}
            title={category}
            nominees={categories[category]["nominees"]}
            winner={categories[category]["winner"]}
            selected={mySelections[category]}
            onClick={() => setFormPage(index + 1)}
            images={images}
          />
        )}
      </div>
      <Modal
        open={formPage != null}
        title={formPage === 0 || formPage === categoryKeys.length + 1 ? title : categoryKeys[formPage - 1]}
        footer={formPage === 0 ? null : <FormFooter
          formPage={formPage}
          numPages={categoryKeys.length + 2}
          onPrevious={() => setFormPage(old => old - 1)}
          onNext={() => setFormPage(old => old + 1)}
        />}
        onCancel={() => setFormPage(null)}
        closeIcon={<CloseOutlined style={{color: "#fff"}} />}
      >
        {formPage != null && formPage === 0 && (
          <div className="form-start">
            <p className="secondary-text-serif">Choose your nominees.</p>
            {isInPast && <p className="secondary-text-serif">Once you're done, you can compare them to the actual winners.</p>}
            {!isInPast && <p className="secondary-text-serif">After the ceremony, come back and compare your choices to the actual winners.</p>}
            <div className="start-button"><Button onClick={() => setFormPage(1)}>Start</Button></div>
          </div>
        )}
        {formPage != null && formPage > 0 && formPage <= categoryKeys.length && (
          <NomineeSelectScreen
            category={categoryKeys[formPage-1]}
            nominees={categories[categoryKeys[formPage-1]]["nominees"]}
            selected={mySelections[categoryKeys[formPage-1]]}
            updateSelection={updateSelection}
            images={images}
          />
        )}
        {formPage != null && formPage === categoryKeys.length + 1 && (
          <div className="form-start">
            <p className="secondary-text-serif">You're done!</p>
            {!isInPast && <p className="secondary-text-serif">After the ceremony, come back and compare your choices to the actual winners.</p>}
            <div className="start-button"><Button onClick={() => setFormPage(null)}>Done</Button></div>
          </div>
        )}
      </Modal>
    </div>
  );
}
export default BaseAwardsShowPage;
