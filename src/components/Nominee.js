import './Nominee.css';

function Nominee(props) {
  const {data, category, getImage} = props;
  let imageKeys = [data["nominee"]];
  if (category === "Best Director") {
    imageKeys = data["nominee"].split(" and ");
  }
  if (category === "Best Original Song") {
    imageKeys = [data["secondary"]];
  }

  return (
    <div className="nominee-root">
      <div className="nominee-images">
        {imageKeys.map(key =>
          getImage(key) &&
          <img
            className="nominee-image"
            key={key}
            src={getImage(key)}
            alt={key}
            width="75" height="112"
          />
        )}
      </div>
      <div className="nominee-text">
        <p className="nominee-title secondary-text">{data["nominee"]}</p>
        <p className="nominee-subtitle secondary-text-serif">{data["secondary"]}</p>
        {data["tertiary"] && <p className="nominee-subtitle secondary-text-serif">{data["tertiary"]}</p>}
      </div>
    </div>
  );
}
export default Nominee;
