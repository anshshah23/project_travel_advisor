import React from 'react';

const Marker = ({ lat, lng, children }) => {
  return (
    <div style={{ position: 'absolute', transform: 'translate(-50%, -50%)' }}>
      {children}
    </div>
  );
};

export default Marker;
