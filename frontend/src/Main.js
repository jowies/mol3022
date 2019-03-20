import React, { Component } from 'react';
import Matrices from './pages/Matrices';
import Sequence from './pages/Sequence';

const pages = (page, change) => {
  switch (page) {
    case 'matrices':
      return <Matrices />;
    case 'sequence':
      return <Sequence />;
    default:
      return <Sequence />;
  }
};

class Main extends Component {
  state = {
    page: 'matrices',
    sequence: '',
    sequenceError: '',
  };

  changeSequence = (e) => {
    e.preventDefault();
    const { sequence } = this.state;
    const current = sequence;
    this.setState({ sequence: e.target.value });
  }


  changePage = page => () => {
    this.setState({ page });
  }

  render() {
    const { page } = this.state;
    return pages(page, this.changePage);
  }
}
