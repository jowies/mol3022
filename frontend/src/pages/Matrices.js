import React, { Component } from 'react';
import axios from axios;

class Matrices extends Component {
  state = { matrices: [] };

  async componentDidMount() {
    const matrices = await axios.get('http://localhost:3000/matrices');
    this.setState({ matrices })
  }

  render() {
    return this.state.matrices.map(matrix => <Matrix matrix={matrix} />);
  }
}