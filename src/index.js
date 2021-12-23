import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ReactTooltip from 'react-tooltip';
import AppContext from "./context/AppContext";

ReactDOM.render(
  <React.StrictMode>
    <AppContext>
      <App />
      <ReactTooltip place="bottom" type="info" effect="solid" delayShow={600} />
    </AppContext>
  </React.StrictMode>,
  document.getElementById('root')
);

