import {Link, Outlet} from "react-router-dom";

function Home(props) {
  return (
    <div>
      <Link to="/ballot_party"><h1>Ballot Party</h1></Link>
      <Outlet />
    </div>
  );
}
export default Home;
