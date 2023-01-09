import './NomineeSelectScreen.css';
import {getWinnerValue, getSubtitle} from '../util/NomineeUtil';
import {getTMDBImage} from '../util/TmdbUtil';
import {CheckCircleOutlined} from '@ant-design/icons';

function Nominee(props) {
  const {data, isSelected, onClick, images} = props;

  const title = getWinnerValue(data);
  let imageKeys = [data["media"]];
  if (data["type"] === "person" || data["type"] === "crew") {
    imageKeys = data["person"].split(", ").map(s => s.trim());
  }

  return (
    <div className="nominee" onClick={onClick}>
      <div className="nom-img">
        {imageKeys.map(key =>
          <img
            key={key}
            src={getTMDBImage(images[key], "sm")}
            alt={key}
            width="75" height="112"
          />
        )}
      </div>
      <div className="nom-text">
        <b>{title}</b>
        <p>{getSubtitle(data)}</p>
      </div>
      {isSelected && <div><CheckCircleOutlined /></div>}
    </div>
  );
}

function NomineeSelectScreen(props) {
  const {category, nominees, selected, updateSelection, images} = props;
  return (
    <div>
      <h4>{category}</h4>
      {nominees.map(n =>
        <Nominee
          key={getWinnerValue(n)}
          data={n}
          isSelected={selected === getWinnerValue(n)}
          onClick={() => {updateSelection(category, getWinnerValue(n))}}
          images={images}
        />
      )}
    </div>
  );
}

export default NomineeSelectScreen;
