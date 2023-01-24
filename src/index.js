import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, useLocation, useNavigate, Outlet } from "react-router-dom";
import './index.css';
import './App.css';
import OscarsPage from './OscarsPage';
import reportWebVitals from './reportWebVitals';
import {Button} from 'antd';
import Home from './Home';

const PAGES = {
	Home: "home",
	Oscars: "oscars",
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
	const [pageNum, setPageNum] = useState(null);
  const {pathname, search} = useLocation();
  const navigate = useNavigate();

  const setPageAndLocation = (toPage, n=null) => {
    const params = new URLSearchParams(search);
    setPage(toPage);
    if (toPage === PAGES.Home) {
      params.delete("ceremony");
			params.delete("n");
      navigate({pathname, search: params.toString()}, {replace: true});
    } else {
      params.set("ceremony", toPage);
			if (n != null) {
				params.set("n", n);
			} else {
				params.delete("n");
			}
      navigate({pathname, search: params.toString()}, {replace: true});
    }
  }

  // keep page state in sync with ceremony and n params
  useEffect(() => {
		const params = new URLSearchParams(search);
		const ceremony = params.get("ceremony");
		const n = params.get("n");
		if (ceremony != null && page !== ceremony) {
      setPage(ceremony);
		} else if (ceremony == null && page !== PAGES.Home) {
      setPage(PAGES.Home);
    }
		if (n != null && pageNum !== n){
			setPageNum(n);
		} else {
			setPageNum(null);
		}
	}, [search]);

  return (
    <div className="root-page">
      <div className="root-header"><Logo onClick={() => setPageAndLocation(PAGES.Home)} /></div>
      {page === PAGES.Home && <Home onGoToOscars={(n) => setPageAndLocation(`${PAGES.Oscars}-${n}`)} />}
      {page.startsWith(PAGES.Oscars) && <OscarsPage n={page.split("-")[1]} />}
    </div>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Outlet />}>
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
