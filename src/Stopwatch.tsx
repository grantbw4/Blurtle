import { useEffect, useReducer } from "react";

/* Adapted from https://codesandbox.io/s/react-stopwatch-uwyjf?file=/src/index.tsx:63-145*/

interface StopwatchState {
  running: boolean;
  currentTime: number;
  lastTime: number;
}
type StopwatchActions =
  | { type: "stop" }
  | { type: "start" }
  | { type: "reset" }
  | { type: "tick" };

function StopwatchReducer(
  state: StopwatchState,
  action: StopwatchActions
): StopwatchState {
  switch (action.type) {
    case "reset":
      return { running: false, currentTime: 0, lastTime: 0 };
    case "start":
      return { ...state, running: true, lastTime: Date.now() };
    case "stop":
      return { ...state, running: false };
    case "tick":
      if (!state.running) return state;
      return {
        ...state,
        currentTime: state.currentTime + (Date.now() - state.lastTime),
        lastTime: Date.now()
      };
  }
}
function parseTime(
  time: number
): { minutes: number; seconds: number; milliseconds: number } {
  const date = new Date(time);
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  return {
    minutes,
    seconds,
    milliseconds
  };
}
export function Stopwatch() {
  const [state, dispatch] = useReducer(StopwatchReducer, {
    running: false,
    currentTime: 0,
    lastTime: 0
  });
  useEffect(() => {
    let frame: number;
    function tick() {
      dispatch({ type: "tick" });
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
  const time = parseTime(state.currentTime);
  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col justify-center items-center">
      <span className="text-6xl font-bold tabular-nums">

        {time.minutes.toString().padStart(2, "0")}:
        {time.seconds.toString().padStart(2, "0")}.
        {time.milliseconds.toString().padStart(3, "0")}
      </span>
      <div className="space-x-4">
        <button
          onClick={() => dispatch({ type: "reset" })}
          className="bg-yellow-500 hover:bg-yellow-600 border-4 border-yellow-700 rounded-full w-16 h-16"
        >
          Reset
        </button>
        {!state.running ? (
          <button
            onClick={() => dispatch({ type: "start" })}
            className="bg-green-500 hover:bg-green-600 border-4 border-green-700 rounded-full w-16 h-16"
          >
            Start
          </button>
        ) : (
          <button
            onClick={() => dispatch({ type: "stop" })}
            className="bg-red-500 hover:bg-red-600 border-4 border-red-700 rounded-full w-16 h-16"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
}
