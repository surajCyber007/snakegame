import React, { useEffect } from "react";
import ReactDOM from "react-dom";

const GameOverPopup = ({ handleClosePopup, sendScore }) => {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return ReactDOM.createPortal(
    <div>
      <div className="bg-slate-200 opacity-90 fixed inset-0"></div>
      <div className="fixed inset-x-10 inset-y-40 bg-[#cce705] flex flex-col justify-center items-center space-y-3 rounded-xl">
        <h1 className="text-4xl">GAME OVER!!!</h1>
        <p className="text-2xl">Your Score: {sendScore}</p>
        <button className="text-[#cce705] rounded-md bg-[#2e3d06] px-8 py-2"  onClick={handleClosePopup}>Replay</button>
      </div>
    </div>,
    document.querySelector(".modal-container")
  );
};

export default GameOverPopup;
