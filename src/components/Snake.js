import React from "react";
import { VscSnake } from "react-icons/vsc";

const Snake = ({ snakeDots }) => {
  return (
    <div>
      {snakeDots.map((dot, i) => {
        const style = {
          left: `${dot[0]}%`,
          top: `${dot[1]}%`,
        };

        // Determine the icon for the snake dot based on its position
        let iconClass = "snake-dot";

        if (i === 0) {
          // Head of the snake
          iconClass += " snake-head";
        } else if (i === snakeDots.length - 1) {
          // Tail of the snake
          iconClass += " snake-tail";
        } else {
          // Body of the snake
          iconClass += " snake-body";
        }

        return (
          <div key={i} className={`${iconClass}`} style={style}>
            {/* You can render different icons based on the iconClass */}
          </div>
        );
      })}
    </div>
  );
};

export default Snake;
