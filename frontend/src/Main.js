import React, { Component } from 'react';
import Matrices from './pages/Matrices';
import Sequence from './pages/Sequence';

class Main extends Component {
  state = {
    page: 'matrices',
    sequence: '',
    sequenceError: '',
    matrices: [],
  };

  changeSequence = (e) => {
    e.preventDefault();
    const { sequence } = this.state;
    const current = sequence;
    this.setState({ sequence: e.target.value });
  }

  changeMatrices = (matrices) => {
    this.setState({ matrices });
  }


  changePage = page => () => {
    this.setState({ page });
  }

  pages = () => {
    switch (this.state.page) {
      case 'matrices':
        return <Matrices matrices={this.state.matrices} change={this.changeMatrices} />;
      case 'sequence':
        return <Sequence />;
      default:
        return <Sequence />;
    }
  };

  render() {
    return this.pages();
  }
}

export default Main;
