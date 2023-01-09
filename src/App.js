import React from "react";
import "./App.css";
import {Routes, Route, Outlet, Link} from "react-router-dom";
import Home from "./Home";
import GoldenGlobesPage from "./GoldenGlobesPage";

function Layout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

function App() {
	return (
    <div className="App">
      <Link to="/"><h1>Ballot Party</h1></Link>
  		<Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="golden_globes/2023" element={<GoldenGlobesPage />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
  		</Routes>
    </div>
	);
}
export default App;
