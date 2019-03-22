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

class Results extends Component {
  state = {
    loading: true,
    data: {},
  }

  async componentDidMount() {
    try {
      const response = await axios.post('http://localhost:3000/calculate', {
        type: this.props.type,
        matrices: [this.props.matrix],
        sequences: [this.props.sequence],
      });
      console.log(response.data);
      this.setState({ loading: false, data: response.data });
    } catch (error) {
      console.error(error);
    }
  }

  renderStuff(stuff) {
    const de = stuff[0].result[0].positions;
    return de.map(x => (
      <div>
        <p>
          {' '}
          {x.word}
          {' '}
          @ Index:
          {' '}
          {x.index}

        </p>
      </div>
    ));
  }


  show() {
    if (this.state.data.na && this.state.data.ac) {
      return (
        <div>
          <h1>
            Normal Approach
          </h1>
          {this.renderStuff(this.state.data.na)}
          <h1>
            {' '}
            Aho-Corasick
          </h1>
          {this.renderStuff(this.state.data.ac)}
        </div>
      );
    } if (this.state.data.na) {
      return (
        <div>
          <h1>Normal Approach</h1>
          {this.renderStuff(this.state.data.na)}
        </div>
      );
    } if (this.state.data.ac) {
      return (
        <div>
          <h1>Aho-Corasick</h1>
          {this.renderStuff(this.state.data.ac)}
        </div>
      );
    }
    return '';
  }

  render() {
    console.log(this.props);
    return (
      <div style={styleM}>
        {this.state.loading ? <p>Loading</p> : this.show()}
      </div>
    );
  }
}


export default Results;
