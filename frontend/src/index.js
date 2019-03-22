import 'babel-polyfill';
import React from 'react';
import ReactDom from 'react-dom';
import Main from './Main';

import './index.css';

const App = () => {
  ReactDom.render(
    <Main />,
    document.getElementById('root'),
  );
};
App();
