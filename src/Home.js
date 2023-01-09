import {Link} from "react-router-dom";

function Home(props) {
  return (
    <div>
      <h2>Upcoming</h2>
      <Link to="/golden_globes/2023">Golden Globes 2023</Link>
    </div>
  );
}
export default Home;
