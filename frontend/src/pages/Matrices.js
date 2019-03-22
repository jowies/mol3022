import React, { Component } from 'react';
import axios from 'axios';
import Matrix from '../components/Matrix';

const styleM = {
  display: 'flex',
  justifyContent: 'center',
  textAlign: 'center',
  width: '100%',
  flexDirection: 'column',
};

const styleO = {
  width: '100%',
};

const input = {
  width: '150px',
  flex: 1,
  alignSelf: 'center',
};

class Matrices extends Component {
  async componentDidMount() {
    const matrices = await axios.get('http://localhost:3000/matrices');
    console.log(matrices);
    this.props.change(matrices.data);
  }

  render() {
    console.log(this.props.matrices);
    return (
      <div style={styleO}>
        <div style={styleM}>
          <input style={input} type="text" value={this.props.searchstring} placeholder="search" onChange={this.props.search} />
          {this.props.matrices.map(matrix => <Matrix matrix={matrix} add={this.props.add} />)}
        </div>

      </div>
    );
  }
}


export default Matrices;
