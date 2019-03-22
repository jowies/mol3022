import React, { Component } from 'react';


const styleM = {
  display: 'flex',
  justifyContent: 'center',
  textAlign: 'center',
  width: '100%',
  flexDirection: 'column',
};
const input = {
  width: '150px',
  flex: 1,
  alignSelf: 'center',
};

const textarea = {
  width: '500px',
  height: '400px',
  flex: 1,
  alignSelf: 'center',
};


class Sequence extends Component {
  state = {
    sequence: '',
    error: false,
    type: '',
  }

  change = (e) => {
    console.log('change');
    e.preventDefault();
    if (e.target.value.split('').filter(x => x.toUpperCase() === 'A' || x.toUpperCase() === 'G' || x.toUpperCase() === 'T' || x.toUpperCase() === 'C').length === e.target.value.length) {
      this.setState({ sequence: e.target.value.toUpperCase(), error: false });
    } else {
      this.setState({ error: true });
    }
  }

  radio = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    this.setState({ type: e.target.value });
  }

  submit = (e) => {
    e.preventDefault();
    this.props.seq(this.state.sequence, this.state.type);
  }

  generateRandom = (e) => {
    e.preventDefault();
    const x = ['T', 'G', 'C', 'A'];
    let s = '';
    for (let i = 0; i < 1000000; i += 1) {
      s += x[Math.floor(Math.random() * 4)];
    }
    this.setState({ sequence: s });
  }

  render() {
    return (
      <div style={styleM}>
        Input sequence
        <button style={input} onClick={this.generateRandom}>Generate random</button>
        <textarea rows="15" style={textarea} type="textarea" value={this.state.sequence} onChange={this.change} />
        {this.state.error ? 'Not a valid string' : ''}
        <form action="">
          <input type="radio" name="gender" value="na" checked={this.state.type === 'na'} onChange={this.radio} />
          {' '}
          Normal approach
          <br />
          <input type="radio" name="gender" value="ac" checked={this.state.type === 'ac'} onChange={this.radio} />
          {' '}
          Aho-Corasick
          <br />
          <input type="radio" name="gender" value="both" checked={this.state.type === 'both'} onChange={this.radio} />
          {' '}
          Both
        </form>
        <button style={input} onClick={this.submit}>Run analysis</button>

      </div>
    );
  }
}


export default Sequence;
