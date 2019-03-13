import 'babel-polyfill';
import React from 'react';
import ReactDom from 'react-dom';

const App = () => {
  ReactDom.render(
    <p>Hello world</p>,
    document.getElementById('root'),
  );
};
App();