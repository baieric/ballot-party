import './Nominee.css';
import {getWinnerValue, getSubtitle} from '../util/NomineeUtil';

function Nominee(props) {
  const {data, getImage} = props;
  let imageKeys = [data["media"]];
  if (data["type"] === "person" || data["type"] === "crew") {
    imageKeys = data["person"].split(", ").map(s => s.trim());
  }
  return (
    <div className="nominee-root">
      <div className="nominee-images">
        {imageKeys.map(key =>
          <img
            className="nominee-image"
            key={key}
            src={getImage(key)}
            alt={key}
            width="75" height="112"
            onerror="this.style.display='none'"
          />
        )}
      </div>
      <div className="nominee-text">
        <p className="nominee-title secondary-text">{getWinnerValue(data)}</p>
        <p className="nominee-subtitle secondary-text-serif">{getSubtitle(data)}</p>
      </div>
    </div>
  );
}
export default Nominee;
