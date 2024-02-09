import React from 'react';

const BigFood = ({ bigFoodDot }) => {
  const style = {
    left: `${bigFoodDot[0]}%`,
    top: `${bigFoodDot[1]}%`,
  };

  return (
    <div className="big-food" style={style}></div>
  );
};

export default BigFood;
