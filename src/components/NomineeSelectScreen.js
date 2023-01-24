import './NomineeSelectScreen.css';
import {getTMDBImage} from '../util/TmdbUtil';
import {CheckCircleOutlined} from '@ant-design/icons';
import ClickContainer from './ClickContainer';
import Nominee from './Nominee';

function getSecondWord(s) {
  // gets second word from string, if only one word, returns s
  const sArr = s.split(" ");
  let word = sArr[0];
  if (sArr.length > 1) {
    word = sArr[1];
  }
  return word;
}

function getTitleForSort(s){
  if (s.startsWith("The ")){
    return s.slice(4);
  }
  if (s.startsWith("A ")){
    return s.slice(2);
  }
  return s;
}

function NomineeSelectScreen(props) {
  const {category, nominees, selected, updateSelection, images} = props;
  nominees.sort((a,b) => {
    if (["Director", "Directing", "Actor", "Actress"].some(p => category.includes(p))){
      // sort by second word in name (usually last name?)
      const aComp = getSecondWord(a.nominee);
      const bComp = getSecondWord(b.nominee);
      if (aComp < bComp) {
        return -1;
      } else if (aComp > bComp) {
        return 1;
      }
      return 0;
    }
    // sort by name, ignoring The prefix
    const aStr = getTitleForSort(a.nominee);
    const bStr = getTitleForSort(b.nominee);
    if (aStr < bStr) {
      return -1;
    } else if (aStr > bStr) {
      return 1;
    }
    return 0;

  });

  return (
    <>
      {nominees.map(n =>
        <ClickContainer
          key={`${n["nominee"]}-${n["secondary"]}`}
          onClick={() => {updateSelection(category, `${n["nominee"]}-${n["secondary"]}`)}}
        >
          <div className="selectable-nominee-container">
            <Nominee className="selectable-nominee" category={category} data={n} getImage={key => getTMDBImage(images[key], "sm")} />
            <div className="selected-container">
              {selected === `${n["nominee"]}-${n["secondary"]}` && <CheckCircleOutlined style={{fontSize: 24, color: "#edcc6d"}} />}
            </div>
          </div>
        </ClickContainer>
      )}
    </>
  );
}

export default NomineeSelectScreen;
