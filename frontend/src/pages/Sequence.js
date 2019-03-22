import React, { Component } from 'react';

class Sequence extends Component {
  render() {
    return <input type="textarea" value={this.props.sequence} onChange={this.props.change} />;
  }
}


export default Sequence;
