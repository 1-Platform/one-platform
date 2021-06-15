import React from 'react';
import ReactDOM from 'react-dom';
import '@patternfly/react-core/dist/styles/base.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

if ( !window.OpAuthHelper ) {
  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter basename={ process.env.PUBLIC_URL }>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
  );
} else {
  window.OpAuthHelper.onLogin( () => {
    ReactDOM.render(
      <React.StrictMode>
        <BrowserRouter basename={ process.env.PUBLIC_URL }>
          <App />
        </BrowserRouter>
      </React.StrictMode>,
      document.getElementById( 'root' )
    );
  } );
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.debug);
