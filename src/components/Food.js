// Food.js
import React from 'react';

const Food = ({ foodDot }) => {
  const style = {
    left: `${foodDot[0]}%`,
    top: `${foodDot[1]}%`
  };

  return (
    <div className="food bg-[#2e3d06]" style={style}></div>
  );
};

export default Food;
