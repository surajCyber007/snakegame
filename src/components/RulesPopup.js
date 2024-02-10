import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { VscSnake } from "react-icons/vsc";

const RulesPopup = ({ toggleRules }) => {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return ReactDOM.createPortal(
    <div>
      <div className="bg-slate-200 opacity-90 fixed inset-0"></div>
      <div className="fixed inset-x-2 inset-y-40 font-mono bg-[#cce705] flex flex-col justify-center items-center space-y-3 rounded-xl text-center">
        <h1 className="text-2xl flex items-center space-x-6 font-bold border-b-2 border-black">
          <VscSnake /><span>Snake - Mania</span><VscSnake />
        </h1>
        <p className="text-xl">Use keyboard arrows on desktop and control provided on mobile.</p>
        <p className="text-xl">Eat as much as food you can!</p>
        <p className="text-xl">Stay away from the boundary!</p>
        <button
          className="text-[#cce705] rounded-md bg-[#2e3d06] px-8 py-2"
          onClick={()=>toggleRules(true)}
        >
          Let's Play
        </button>
      </div>
    </div>,
    document.querySelector(".modal-container")
  );
};

export default RulesPopup;
