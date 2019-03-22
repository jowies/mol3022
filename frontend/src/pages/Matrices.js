import React, { Component } from 'react';
import axios from 'axios';

class Matrices extends Component {
  async componentDidMount() {
    const matrices = await axios.get('http://localhost:3000/matrices');
    console.log(matrices);
    this.props.change(matrices.data);
  }

  render() {
    console.log(this.props.matrices);
    return this.props.matrices.map(matrix => <Matrix matrix={matrix} />);
  }
}

export default Matrices;
