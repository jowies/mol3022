import React, { Component } from 'react';
import Matrices from './pages/Matrices';
import Sequence from './pages/Sequence';
import Results from './pages/Results';

class Main extends Component {
  state = {
    page: 'matrices',
    sequence: '',
    sequenceError: '',
    matrices: [],
    search: '',
    selectedMatrice: '',
    matrix: '',
    type: 'na',
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

  seq = (s, t) => {
    this.setState({ sequence: s, page: 'result', type: t });
  }

  addMatrix = (id) => {
    this.setState({ matrix: id, page: 'sequence' });
  }

  search = (e) => {
    e.preventDefault();
    this.setState({ search: e.target.value });
  }

  matrices = () => {
    if (this.state.search === '') {
      return this.state.matrices;
    }
    return this.state.matrices.filter(m => m.matrix_id.indexOf(this.state.search) > -1 || m.name.indexOf(this.state.search) > -1);
  }

  pages = () => {
    switch (this.state.page) {
      case 'matrices':
        return <Matrices matrices={this.matrices()} searchstring={this.state.search} search={this.search} change={this.changeMatrices} add={this.addMatrix} />;
      case 'sequence':
        return <Sequence seq={this.seq} />;
      case 'result':
        return <Results matrix={this.state.matrix} sequence={this.state.sequence} type={this.state.type} />;
      default:
        return <Matrices matrices={this.matrices()} searchstring={this.state.search} search={this.search} change={this.changeMatrices} add={this.addMatrix} />;
    }
  };

  render() {
    return this.pages();
  }
}

export default Main;
