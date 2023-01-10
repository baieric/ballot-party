import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, useLocation, useNavigate, Outlet } from "react-router-dom";
import './index.css';
import './App.css';
import GoldenGlobesPage from './GoldenGlobesPage';
import reportWebVitals from './reportWebVitals';
import {Button} from 'antd';
import ClickContainer from './components/ClickContainer';
import Home from './Home';

const PAGES = {
	Home: "home",
	GoldenGlobes2023: "GoldenGlobes2023",
}

function Logo(props) {
  return (
    <Button className="logo-text main-text" type="text" onClick={props.onClick}>
      Ballot Party
    </Button>
  )
}

function Index() {
  const [page, setPage] = useState(PAGES.Home);
  const {pathname, search} = useLocation();
  const navigate = useNavigate();

  const logo = <Logo onClick={() => setPageAndLocation(PAGES.Home)} />;

  const setPageAndLocation = (toPage) => {
    const params = new URLSearchParams(search);
		const ceremony = params.get("ceremony");
    setPage(toPage);
    if (toPage == PAGES.Home) {
      params.delete("ceremony");
      navigate({pathname, search: params.toString()}, {replace: true});
    } else {
      params.set("ceremony", toPage);
      navigate({pathname, search: params.toString()}, {replace: true});
    }
  }

  // keep page state in sync with ceremony param
  useEffect(() => {
		const params = new URLSearchParams(search);
		const ceremony = params.get("ceremony");
		if (ceremony != null && page !== ceremony) {
      setPage(ceremony);
		} else if (ceremony == null && page !== PAGES.Home) {
      setPage(PAGES.Home);
    }
	}, [search]);

  return (
    <>
      {logo}
      {page === PAGES.Home && <Home onGoToGG23={() => setPageAndLocation(PAGES.GoldenGlobes2023)} />}
      {page === PAGES.GoldenGlobes2023 && <GoldenGlobesPage />}
    </>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/ballot-party" element={<Outlet />}>
      <Route index element={<Index />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="App">
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
