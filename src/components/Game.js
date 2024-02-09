// Game.js
import React, { useState, useEffect } from "react";
import Snake from "./Snake";
import Food from "./Food";
import { FaPlay } from "react-icons/fa";
import { IoMdPause } from "react-icons/io";
import BigFood from "./BigFood";
import {
  FaCircleChevronDown,
  FaCircleChevronLeft,
  FaCircleChevronRight,
  FaCircleChevronUp,
} from "react-icons/fa6";

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
  const [speed, setSpeed] = useState(100);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [bigFoodDot, setBigFoodDot] = useState(null);
  const [foodEatenCount, setFoodEatenCount] = useState(0);

  useEffect(() => {
    document.onkeydown = onKeyDown;
    checkIfOutOfBorders();
    checkIfCollapsed();
    checkIfEat();
    const gameInterval = setInterval(moveSnake, speed);
    return () => clearInterval(gameInterval);
  }, [snakeDots, paused]);

  useEffect(() => {
    if (foodEatenCount === 5) {
      setBigFoodDot(getRandomCoordinates());
      setFoodEatenCount(0); // Reset the count
    }
  }, [score]);

  const onKeyDown = (e) => {
    console.log(e)
    e = e || window.event;
    switch (e.keyCode || e) {
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
      case 32:
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
      enlargeSnake(1);
      increaseSpeed();
      setScore(score + 5);
      setFoodEatenCount(foodEatenCount + 1);
    }

    if (bigFoodDot && head[0] === bigFoodDot[0] && head[1] === bigFoodDot[1]) {
      setBigFoodDot(null); // Remove the big food item
      setScore(score + 25); // Add 5 points to the score
      enlargeSnake(5);
    }
  };

  //   const enlargeSnake = () => {
  //     let newSnake = [...snakeDots];
  //     newSnake.unshift([]);
  //     setSnakeDots(newSnake);
  //   };

  const enlargeSnake = (amount) => {
    // Duplicate the coordinates of the current head
    const newHead = [...snakeDots[0]];

    // Add the duplicated head to the beginning of the snake's dots array
    const newSnake = Array.from({ length: amount }, () => newHead).concat(
      snakeDots
    );

    // Update the state with the new snake
    setSnakeDots(newSnake);
  };

  const increaseSpeed = () => {
    if (speed > 10) {
      setSpeed(speed - 0.5);
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
    setSpeed(100);
    setScore(0);
    setFoodEatenCount(0);
    setBigFoodDot(null);
  };

  const togglePause = () => {
    setPaused(!paused);
  };

  const gameBoardStyle = {
    height: "400px",
    width: "94vw",
    maxWidth: "400px",
    border: "1px solid red",
  };

  return (
    <>
      <div className="h-[80vh] w-[100%] px-2 flex flex-col items-center">
        <div className="score-area flex justify-around items-center border-b-2 pt-2 border-[#101503]">
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
          className="game-area bg-[#cce705] mt-2  "
          style={gameBoardStyle}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <Snake snakeDots={snakeDots} />
          <Food foodDot={foodDot} />
          {bigFoodDot && <BigFood bigFoodDot={bigFoodDot} />}
        </div>
      </div>
      <div className="mt-5">
        <div>
          <button onClick={()=>onKeyDown(38)}>
            <FaCircleChevronUp size={40} />
          </button>
        </div>
        <div className="flex space-x-8 -ms-9 -my-1">
          <button onClick={()=>onKeyDown(37)}>
            <FaCircleChevronLeft size={40} />
          </button>
          <button onClick={()=>onKeyDown(39)}>
            <FaCircleChevronRight size={40} />
          </button>
        </div>
        <div>
          <button onClick={()=>onKeyDown(40)}>
            <FaCircleChevronDown size={40} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Game;
