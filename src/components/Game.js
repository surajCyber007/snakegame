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
import foodPop from "../sounds/food-pop.wav";
import bigFoodPop from "../sounds/big-food-pop.wav";
import gameOver from "../sounds/game-over.wav";
import bigFoodDisappear from "../sounds/big-food-disappear.wav";
import GameOverPopup from "./GameOverPopup";
import { CgNotes } from "react-icons/cg";
import { SlSpeedometer } from "react-icons/sl";
import RulesPopup from "./RulesPopup";

const Game = () => {
  const foodGenerationSound = new Audio(foodPop);
  const bigFoodGeneration = new Audio(bigFoodPop);
  const gameOverSound = new Audio(gameOver);
  const bigFoodDisap = new Audio(bigFoodDisappear);

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
  const [showModal, setShowModal] = useState(false);
  const [sendScore, setSendScore] = useState(0);
  const [timerId, setTimerId] = useState(null);
  const [showSpeed, setShowSpeed] = useState(false);
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    document.onkeydown = onKeyDown;
    checkIfOutOfBorders();
    checkIfCollapsed();
    checkIfEat();
    const gameInterval = setInterval(moveSnake, speed);
    return () => clearInterval(gameInterval);
  }, [snakeDots, paused]);

  //   useEffect(() => {
  //     if (foodEatenCount === 5) {
  //       setBigFoodDot(getRandomCoordinates());
  //       setFoodEatenCount(0); // Reset the count
  //       bigFoodGeneration.play();
  //     }
  //   }, [score]);

  useEffect(() => {
    if (foodEatenCount === 2) {
      bigFoodGeneration.play();
      setBigFoodDot(getRandomCoordinates());
      setFoodEatenCount(0); // Reset the count

      // Set a timer for ten seconds
      const timer = setTimeout(() => {
        // If the big food is not eaten within ten seconds, remove it
        setBigFoodDot(null);
        bigFoodDisap.play();
      }, 4000);

      // Save the timer ID
      setTimerId(timer);
    }

    // Clean up the timer when the component unmounts or when a new big food is generated
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [foodEatenCount]);

  const onKeyDown = (e) => {
    e = e || window.event;
    switch (e.keyCode || e) {
      case 38:
        if (direction !== "DOWN") {
          setDirection("UP");
        } else {
          setDirection("DOWN");
        }
        break;
      case 40:
        if (direction !== "UP") {
          setDirection("DOWN");
        } else {
          setDirection("UP");
        }
        break;
      case 37:
        if (direction !== "RIGHT") {
          setDirection("LEFT");
        } else {
          setDirection("RIGHT");
        }
        break;
      case 39:
        if (direction !== "LEFT") {
          setDirection("RIGHT");
        } else {
          setDirection("LEFT");
        }
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
      enlargeSnake(2);
      increaseSpeed();
      setScore(score + 5);
      setFoodEatenCount(foodEatenCount + 1);
      foodGenerationSound.play();
    }

    if (bigFoodDot && head[0] === bigFoodDot[0] && head[1] === bigFoodDot[1]) {
      setBigFoodDot(null); // Remove the big food item
      setScore(score + 25); // Add 5 points to the score
      enlargeSnake(5);
      foodGenerationSound.play();
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
    setPaused(true);
    setShowModal(true);
    gameOverSound.play();
    setSendScore(score);
    setScore(0);
    setSnakeDots([
      [0, 0],
      [2, 0],
    ]);
    setDirection("RIGHT");
    setSpeed(100);
    setFoodEatenCount(0);
    setBigFoodDot(null);
  };

  const togglePause = () => {
    setPaused(!paused);
  };

  const toggleSpeedIcon = () => {
    setShowSpeed(!showSpeed);
    setPaused(true);
  };

  const toggleRules = (val) => {
    setShowRules(!showRules);
    setPaused(val);
  };

  const handleSpeedChange = (speed) => {
    setSpeed(speed);
    setShowSpeed(false);
    setPaused(false);
  };

  const handleReplayGame = () => {
    setShowModal(false);
    setPaused(false);
  };

  const gameBoardStyle = {
    height: "400px",
    width: "94vw",
    maxWidth: "400px",
    border: "1px solid #2e3d06",
  };

  return (
    <div className="relative">
      <div className="h-[60vh] w-[100%] px-2 flex flex-col items-center">
        <div className="score-area flex justify-around items-center border-b-2 border-[#101503]">
          <div className="text-2xl font-mono">
            <div className="text-[#2e3d06]">Score: {score}</div>
            <div className="text-[#2e3d06]">High Score: {highScore}</div>
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
      <div className="bg-[#cce705] flex justify-center flex-col items-center fixed bottom-0 left-0 w-[100vw]">
        <div>
          <button onClick={() => onKeyDown(38)}>
            <FaCircleChevronUp fill="#69760c" size={44} />
          </button>
        </div>
        <div className="flex space-x-12 -mt-1">
          <button onClick={() => onKeyDown(37)}>
            <FaCircleChevronLeft fill="#69760c" size={44} />
          </button>
          <button onClick={() => onKeyDown(39)}>
            <FaCircleChevronRight fill="#69760c" size={44} />
          </button>
        </div>
        <div>
          <button onClick={() => onKeyDown(40)}>
            <FaCircleChevronDown fill="#69760c" size={44} />
          </button>
        </div>

        <button onClick={toggleRules} className="absolute top-4 left-8">
          <CgNotes fill="#69760c" size={40} />
        </button>

        {showRules && <RulesPopup toggleRules={() => toggleRules(false)} />}

        <button className="absolute right-8 top-4" onClick={toggleSpeedIcon}>
          <SlSpeedometer fill="#69760c" size={40} />
        </button>
        {showSpeed && (
          <div className="absolute right-1 -top-44 flex flex-col space-y-1 font-mono">
            <button
              onClick={() => handleSpeedChange(80)}
              className="px-4 py-1 border border-black bg-[#aabb30] rounded-md"
            >
              Very Fast
            </button>
            <button
              onClick={() => handleSpeedChange(100)}
              className="px-4 py-1 border border-black bg-[#aabb30] rounded-md"
            >
              Fast
            </button>
            <button
              onClick={() => handleSpeedChange(125)}
              className="px-4 py-1 border border-black bg-[#aabb30] rounded-md"
            >
              Medium
            </button>
            <button
              onClick={() => handleSpeedChange(150)}
              className="px-4 py-1 border border-black bg-[#aabb30] rounded-md"
            >
              Slow
            </button>
            <button
              onClick={() => handleSpeedChange(175)}
              className="px-4 py-1 border border-black bg-[#aabb30] rounded-md"
            >
              Very Slow
            </button>
          </div>
        )}
      </div>
      {showModal && (
        <div>
          <GameOverPopup
            sendScore={sendScore}
            handleClosePopup={handleReplayGame}
          />
        </div>
      )}
    </div>
  );
};

export default Game;
