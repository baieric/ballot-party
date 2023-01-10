import './NomineeSelectScreen.css';
import {getWinnerValue} from '../util/NomineeUtil';
import {getTMDBImage} from '../util/TmdbUtil';
import {CheckCircleOutlined} from '@ant-design/icons';
import ClickContainer from './ClickContainer';
import Nominee from './Nominee';

function NomineeSelectScreen(props) {
  const {category, nominees, selected, updateSelection, images} = props;
  return (
    <>
      {nominees.map(n =>
        <ClickContainer
          key={getWinnerValue(n)}
          onClick={() => {updateSelection(category, getWinnerValue(n))}}
        >
          <div className="selectable-nominee-container">
            <Nominee className="selectable-nominee" data={n} getImage={key => getTMDBImage(images[key], "sm")} />
            <div className="selected-container">
              {selected === getWinnerValue(n) && <CheckCircleOutlined style={{fontSize: 24, color: "#edcc6d"}} />}
            </div>
          </div>
        </ClickContainer>
      )}
    </>
  );
}

export default NomineeSelectScreen;
