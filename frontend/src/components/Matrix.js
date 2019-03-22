import React from 'react';

import './s.css';

const underline = {
  borderBottom: 'solid',
  width: '100%',
  maxWidth: '400px',
  flex: 1,
  alignSelf: 'center',
  cursor: 'pointer',
};

const Matrix = ({ matrix, add }) => {
  const adds = (e) => {
    e.preventDefault();
    add(matrix.matrix_id);
  };
  return (
    <div className="lol" style={underline} onClick={adds}>
      <p>
        ID:
        {' '}
        {matrix.matrix_id}
      </p>
      <p>
        Name:
        {' '}
        {matrix.name}
      </p>
    </div>
  );
};


export default Matrix;
