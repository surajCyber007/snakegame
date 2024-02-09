// // Game.js
// import React, { useState, useEffect } from "react";
// import Snake from "./Snake";
// import Food from "./Food";
// import { FaPlay } from "react-icons/fa";
// import { IoMdPause } from "react-icons/io";

// const getRandomCoordinates = () => {
//   let min = 1;
//   let max = 98;
//   let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
//   let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
//   return [x, y];
// };

// const Game = () => {
//   const [snakeDots, setSnakeDots] = useState([
//     [0, 0],
//     [2, 0],
//   ]);
//   const [foodDot, setFoodDot] = useState(getRandomCoordinates());
//   const [direction, setDirection] = useState("RIGHT");
//   const [speed, setSpeed] = useState(100);
//   const [score, setScore] = useState(0); // Add score state
//   const [highScore, setHighScore] = useState(0);
//   const [paused, setPaused] = useState(false);

//   useEffect(() => {
//     document.onkeydown = onKeyDown;
//     checkIfOutOfBorders();
//     checkIfCollapsed();
//     checkIfEat();

//     const gameInterval = setInterval(() => {
//       moveSnake();
//       setScore(snakeDots.length - 2); // Update score based on snake length
//     }, speed);

//     return () => clearInterval(gameInterval);
//   }, [snakeDots, speed, paused]);

//   const onKeyDown = (e) => {
//     e = e || window.event;
//     switch (e.keyCode) {
//       case 38:
//         setDirection("UP");
//         break;
//       case 40:
//         setDirection("DOWN");
//         break;
//       case 37:
//         setDirection("LEFT");
//         break;
//       case 39:
//         setDirection("RIGHT");
//         break;
//       case 80: // "p" key to toggle pause/play
//         togglePause();
//         break;
//       default:
//         break;
//     }
//   };

//   const togglePause = () => {
//     setPaused(!paused);
//   };

//   const moveSnake = () => {
//     if (!paused) {
//       // Move snake only if not paused
//       let dots = [...snakeDots];
//       let head = dots[dots.length - 1];

//       switch (direction) {
//         case "RIGHT":
//           head = [head[0] + 2, head[1]];
//           break;
//         case "LEFT":
//           head = [head[0] - 2, head[1]];
//           break;
//         case "DOWN":
//           head = [head[0], head[1] + 2];
//           break;
//         case "UP":
//           head = [head[0], head[1] - 2];
//           break;
//         default:
//           break;
//       }

//       dots.push(head);
//       dots.shift();
//       setSnakeDots(dots);
//     }
//   };

//   const checkIfEat = () => {
//     let head = snakeDots[snakeDots.length - 1];
//     let food = foodDot;

//     if (head[0] === food[0] && head[1] === food[1]) {
//       setFoodDot(getRandomCoordinates());
//       enlargeSnake();
//       increaseSpeed();
//       setScore(score + 1); // Increment the score
//     }
//   };

//   const enlargeSnake = () => {
//     let newSnake = [...snakeDots];
//     newSnake.unshift([]);
//     setSnakeDots(newSnake);
//   };

//   const increaseSpeed = () => {
//     if (speed > 10) {
//       setSpeed(speed - 10);
//     }
//   };

//   console.log("speed", speed);

//   const checkIfOutOfBorders = () => {
//     let head = snakeDots[snakeDots.length - 1];
//     if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
//       handleGameOver();
//     }
//   };

//   const checkIfCollapsed = () => {
//     let snake = [...snakeDots];
//     let head = snake[snake.length - 1];
//     snake.pop();
//     snake.forEach((dot) => {
//       if (head[0] === dot[0] && head[1] === dot[1]) {
//         handleGameOver();
//       }
//     });
//   };

//   const handleGameOver = () => {
//     // Update high score if the current score is greater
//     if (score > highScore) {
//       setHighScore(score);
//     }
//     alert(`Game Over. Your final score is ${score}`);
//     setSnakeDots([
//       [0, 0],
//       [2, 0],
//     ]);
//     setDirection("RIGHT");
//     setSpeed(200);
//     setScore(0); // Reset the score
//   };

//   return (
//     <>
//       <div className="schore-area flex justify-around items-center">
//         <div className="text-3xl">
//           <div className="score">Score: {score}</div>
//           <div className="high-score">High Score: {highScore}</div>
//         </div>
//         <div className="pause-button" onClick={togglePause}>
//           {paused && <FaPlay size={40} />}
//           {!paused && <IoMdPause size={40} />}
//         </div>
//       </div>
//       <div className="game-area bg-[#cce705] border-4 border-[#101503]">
//         <Snake snakeDots={snakeDots} />
//         <Food foodDot={foodDot} />
//       </div>
//     </>
//   );
// };

// export default Game;

// Game.js
import React, { useState, useEffect } from "react";
import Snake from "./Snake";
import Food from "./Food";
import { FaPlay } from "react-icons/fa";
import { IoMdPause } from "react-icons/io";

const Game = () => {
  const getRandomCoordinates = () => {
    let min = 1;
    let max = 98;
    let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    return [x, y];
  };

  const [snakeDots, setSnakeDots] = useState([
    [0, 0],
    [2, 0],
  ]);
  const [foodDot, setFoodDot] = useState(getRandomCoordinates());
  const [direction, setDirection] = useState("RIGHT");
  const [speed, setSpeed] = useState(200);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  useEffect(() => {
    document.onkeydown = onKeyDown;
    checkIfOutOfBorders();
    checkIfCollapsed();
    checkIfEat();
    const gameInterval = setInterval(moveSnake, speed);
    return () => clearInterval(gameInterval);
  }, [snakeDots, paused]);

  const onKeyDown = (e) => {
    e = e || window.event;
    switch (e.keyCode) {
      case 38:
        setDirection("UP");
        break;
      case 40:
        setDirection("DOWN");
        break;
      case 37:
        setDirection("LEFT");
        break;
      case 39:
        setDirection("RIGHT");
        break;
      case 80:
        togglePause();
        break;
      default:
        break;
    }
  };

  const onTouchStart = (e) => {
    // Capture the initial touch position
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const onTouchMove = (e) => {
    if (!touchStart) return;

    // Determine the direction based on the movement of the finger
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal movement
      if (deltaX > 0) setDirection("RIGHT");
      else setDirection("LEFT");
    } else {
      // Vertical movement
      if (deltaY > 0) setDirection("DOWN");
      else setDirection("UP");
    }
  };

  const onTouchEnd = () => {
    // Reset touch tracking
    setTouchStart(null);
  };

  const moveSnake = () => {
    if (!paused) {
      let dots = [...snakeDots];
      let head = dots[dots.length - 1];

      switch (direction) {
        case "RIGHT":
          head = [head[0] + 2, head[1]];
          break;
        case "LEFT":
          head = [head[0] - 2, head[1]];
          break;
        case "DOWN":
          head = [head[0], head[1] + 2];
          break;
        case "UP":
          head = [head[0], head[1] - 2];
          break;
        default:
          break;
      }

      dots.push(head);
      dots.shift();
      setSnakeDots(dots);
    }
  };

  const checkIfEat = () => {
    let head = snakeDots[snakeDots.length - 1];
    let food = foodDot;

    if (head[0] === food[0] && head[1] === food[1]) {
      setFoodDot(getRandomCoordinates());
      enlargeSnake();
      increaseSpeed();
      setScore(score + 1);
    }
  };

  const enlargeSnake = () => {
    let newSnake = [...snakeDots];
    newSnake.unshift([]);
    setSnakeDots(newSnake);
  };

  const increaseSpeed = () => {
    if (speed > 10) {
      setSpeed(speed - 10);
    }
  };

  const checkIfOutOfBorders = () => {
    let head = snakeDots[snakeDots.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      handleGameOver();
    }
  };

  const checkIfCollapsed = () => {
    let snake = [...snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach((dot) => {
      if (head[0] === dot[0] && head[1] === dot[1]) {
        handleGameOver();
      }
    });
  };

  const handleGameOver = () => {
    if (score > highScore) {
      setHighScore(score);
    }
    alert(`Game Over. Your final score is ${score}`);
    setSnakeDots([
      [0, 0],
      [2, 0],
    ]);
    setDirection("RIGHT");
    setSpeed(200);
    setScore(0);
  };

  const togglePause = () => {
    setPaused(!paused);
  };

  const gameBoardStyle = {
    height: '80vh',
  };

  return (
    <div className="h-80">
      <div className="schore-area flex justify-around items-center">
        <div className="text-3xl">
          <div className="score">Score: {score}</div>
          <div className="high-score">High Score: {highScore}</div>
        </div>
        <div className="pause-button" onClick={togglePause}>
          {paused && <FaPlay size={40} />}
          {!paused && <IoMdPause size={40} />}
        </div>
      </div>
      <div
        className="game-area bg-[#cce705] border-4 border-[#101503]"
        style={gameBoardStyle}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Snake snakeDots={snakeDots} />
        <Food foodDot={foodDot} />
      </div>
    </div>
  );
};

export default Game;
