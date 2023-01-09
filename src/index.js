import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter, Link } from "react-router-dom";
import './index.css';
import './App.css';
import Home from './Home';
import GoldenGlobesPage from './GoldenGlobesPage';
import reportWebVitals from './reportWebVitals';

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/ballot-party">Go to the home page</Link>
      </p>
    </div>
  );
}

function Index() {
  return (
    <div>
      <h2>Upcoming</h2>
      <Link to="/ballot-party/golden_globes/2023">Golden Globes 2023</Link>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/ballot-party",
    element: <Home />,
    errorElement: <NoMatch />,
    children: [
      {index: true, element: <Index />},
      {
        path:"golden_globes/2023",
        element: <GoldenGlobesPage />,
      },
    ],
  },
]);

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
