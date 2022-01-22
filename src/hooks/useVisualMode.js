import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  
  function transition(newMode, replace = false) {

    setMode(newMode);
    let newHistory = [...history, mode];

    if (replace) {
      setHistory(newHistory.slice(0,-1));
    } else {
      setHistory(newHistory);
    }
  };

  function back() {
    
    if (history.length >= 1) { 
      let newHistory = [...history];
      newHistory = newHistory.slice(0,-1);
      setHistory(newHistory);
      setMode(history[history.length-1]);
    }
  }

  return { mode, transition , back};
}