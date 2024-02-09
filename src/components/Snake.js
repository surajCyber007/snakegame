// Snake.js
import React from "react";

const Snake = ({ snakeDots }) => {
  return (
    <div>
      {snakeDots.map((dot, i) => {
        const style = {
        //   left: `${dot[0]}%`,
        //   top: `${dot[1]}%`,
          left: `${dot[0]}%`,
          top: `${dot[1]}%`,
        };

        // Determine the icon for the snake dot
        

        return (
          <div key={i} className="snake-dot" style={style}>
          </div>
        );
      })}
    </div>
  );
};

export default Snake;
