import { useEffect, useRef, useState } from "react";
import { Row, RowState } from "./Row";
import dictionary from "./dictionary.json";
import { Clue, clue, describeClue, violation } from "./clue";
import { Keyboard } from "./Keyboard";
import { Stopwatch } from "./Stopwatch";
import targetList from "./targets.json";
import Star from "./Stars";
import {
  describeSeed,
  dictionarySet,
  Difficulty,
  gameName,
  pick,
  resetRng,
  seed,
  speak,
  urlParam,
} from "./util";
import { decode, encode } from "./base64";
import { userInfo } from "os";
enum GameState {
  Playing,
  Won,
  Lost,
}

interface GameProps {
  maxGuesses: number;
  hidden: boolean;
  difficulty: Difficulty;
  colorBlind: boolean;
  keyboardLayout: string;
}

const targets = targetList.slice(0, targetList.indexOf("murky") + 1); // Words no rarer than this one
const minLength = 4;
const defaultLength = 5;
const maxLength = 11;
const limitLength = (n: number) =>
  n >= minLength && n <= maxLength ? n : defaultLength;

function randomTarget(wordLength: number): string {
  const eligible = targets.filter((word) => word.length === wordLength);
  let candidate: string;
  do {
    candidate = pick(eligible);
  } while (/\*/.test(candidate));
  return candidate;
}



function getChallengeUrl(target: string): string {
  return (
    window.location.origin +
    window.location.pathname +
    "?challenge=" +
    encode(target)
  );
}

let initChallenge = "";
let challengeError = false;
try {
  initChallenge = decode(urlParam("challenge") ?? "").toLowerCase();
} catch (e) {
  console.warn(e);
  challengeError = true;
}
if (initChallenge && !dictionarySet.has(initChallenge)) {
  initChallenge = "";
  challengeError = true;
}

function parseUrlLength(): number {
  const lengthParam = urlParam("length");
  if (!lengthParam) return defaultLength;
  return limitLength(Number(lengthParam));
}

function parseUrlGameNumber(): number {
  const gameParam = urlParam("game");
  if (!gameParam) return 1;
  const gameNumber = Number(gameParam);
  return gameNumber >= 1 && gameNumber <= 1000 ? gameNumber : 1;
}

function Game(props: GameProps) {
  const [gameState, setGameState] = useState(GameState.Playing);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [challenge, setChallenge] = useState<string>(initChallenge);
  const [completionTime, setCompletionTime] = useState('');
  const [wordLength, setWordLength] = useState(
    challenge ? challenge.length : parseUrlLength()
  );
  const [finalMessage, setFinalMessage] = useState<string>("");
  const [gameNumber, setGameNumber] = useState(parseUrlGameNumber());
  const [target, setTarget] = useState(() => {
    resetRng();
    // Skip RNG ahead to the parsed initial game number:
    for (let i = 1; i < gameNumber; i++) randomTarget(wordLength);
    return challenge || randomTarget(wordLength);
  });
  const [hint, setHint] = useState<string>(
    challengeError
      ? `Invalid challenge string, playing random game.`
      : `Make your first guess!`
  );
  const currentSeedParams = () =>
    `?seed=${seed}`;
  useEffect(() => {
    if (seed) {
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname + currentSeedParams()
      );
    }
  }, [wordLength, gameNumber]);
  const tableRef = useRef<HTMLTableElement>(null);
  const stopwatchRef = useRef<any>(null);

  const startNextGame = () => {
    if (challenge) {
      // Clear the URL parameters:
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    setChallenge("");
    const newWordLength = limitLength(wordLength);
    setWordLength(newWordLength);
    setTarget(randomTarget(newWordLength));
    setHint("");
    setGuesses([]);
    setCurrentGuess("");
    setGameState(GameState.Playing);
    setGameNumber((x) => x + 1);
  };

  async function share(copiedHint: string, text?: string) {
    const url = seed
      ? window.location.origin + window.location.pathname + currentSeedParams()
      : getChallengeUrl(target);
    const body = url + (text ? "\n\n" + text : "");
    if (
      /android|iphone|ipad|ipod|webos/i.test(navigator.userAgent) &&
      !/firefox/i.test(navigator.userAgent)
    ) {
      try {
        await navigator.share({ text: body });
        return;
      } catch (e) {
        console.warn("navigator.share failed:", e);
      }
    }
    try {
      await navigator.clipboard.writeText(body);
      setHint(copiedHint);
      return;
    } catch (e) {
      console.warn("navigator.clipboard.writeText failed:", e);
    }
    setHint(url);
  }
  

  useEffect(() => {
    const timer = setInterval(() => {
      let time = stopwatchRef.current.getTime();


          if (time.seconds === 0 && time.minutes === 0) {
          }
          if (time.seconds === 20 && time.minutes === 0) {
            document.documentElement.style.setProperty("--width", "80%")
          }
          if (time.seconds === 50 && time.minutes === 0) {
            document.documentElement.style.setProperty("--width", "60%")
          }
          if (time.seconds === 30 && time.minutes === 1) {
            document.documentElement.style.setProperty("--width", "40%")
          }
          if (time.seconds === 0 && time.minutes === 2) {
            document.documentElement.style.setProperty("--width", "20%")
          }

        
      
    }, 100);
    return () => clearInterval(timer);
  }, []);

  function getstars() {
      let done = "⭐⭐⭐⭐⭐" as string;
      let time = stopwatchRef.current.getTime();

          if (time.seconds >= 20 && time.seconds < 50 &&time.minutes === 0 ) {
            done = "⭐⭐⭐⭐"
          }
          if ((time.seconds >= 50 && time.minutes === 0) || (time.seconds <= 30 && time.minutes === 1) ) {
            done = "⭐⭐⭐"
          }
          if (time.seconds >= 30 && time.minutes === 1) {
            done = "⭐⭐"
          }
          if (time.seconds >= 0 && time.minutes >= 2) {
            done = "⭐"
          }

        
      
   
    return done;
  }



  const onKey = (key: string) => {
    if (key === "Enter") {

      if (stopwatchRef.current) {
        stopwatchRef.current.start();
        
        
      }
    }
    if (gameState !== GameState.Playing) {
      if (key === "Enter") {
        if (stopwatchRef.current) {
          stopwatchRef.current.reset();
        }
      }
      return;
    }
    if (guesses.length === props.maxGuesses) return;
    if (/^[a-z]$/i.test(key)) {
      setCurrentGuess((guess) =>
        (guess + key.toLowerCase()).slice(0, wordLength)
      );
      tableRef.current?.focus();
      setHint("");
    } else if (key === "Backspace") {
      setCurrentGuess((guess) => guess.slice(0, -1));
      setHint("");
    } else if (key === "Enter") {
      if (currentGuess.length !== wordLength) {
        setHint("Too short");
        return;
      }
      if (!dictionary.includes(currentGuess)) {
        setHint("Not a valid word");
        return;
      }
      for (const g of guesses) {
        const c = clue(g, target);
        const feedback = violation(props.difficulty, c, currentGuess);
        if (feedback) {
          setHint(feedback);
          return;
        }
      }
      setGuesses((guesses) => guesses.concat([currentGuess]));
      setCurrentGuess((guess) => "");

      const gameOver = (verbed: string) =>

        `You ${verbed}! The answer was ${target.toUpperCase()}.`;

      if (currentGuess === target) {
        setHint(gameOver("won"));
        setGameState(GameState.Won);
        setFinalMessage("I won!");

        if (stopwatchRef.current) {
          stopwatchRef.current.stop();
        }
        let completionTimeObject = stopwatchRef.current.getTime();
        setCompletionTime(
          completionTimeObject.minutes.toString().padStart(2, "0") + ':' +
          completionTimeObject.seconds.toString().padStart(2, "0")  + ':' +
          completionTimeObject.milliseconds.toString().padStart(3, "0")
        );
      } else if (guesses.length + 1 === props.maxGuesses) {
        setHint(gameOver("lost"));
        setFinalMessage("I lost!");
        setGameState(GameState.Lost);
        let completionTimeObject = stopwatchRef.current.getTime();
        setCompletionTime(
          completionTimeObject.minutes.toString().padStart(2, "0") + ':' +
          completionTimeObject.seconds.toString().padStart(2, "0")  + ':' +
          completionTimeObject.milliseconds.toString().padStart(3, "0")
        );
        if (stopwatchRef.current) {
          stopwatchRef.current.stop();
        }
      } else {
        setHint("");
        speak(describeClue(clue(currentGuess, target)));
      }
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) {
        onKey(e.key);
      }
      if (e.key === "Backspace") {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [currentGuess, gameState]);

  let letterInfo = new Map<string, Clue>();
  for (let guess of guesses) {
    const cluedLetters = clue(guess, target);

    for (const { clue, letter } of cluedLetters) {
      if (clue === undefined) break;
      const old = letterInfo.get(letter);
      if (old === undefined || clue > old) {
        letterInfo.set(letter, clue);
      }
    }
  }
  const tableRows = Array(2)
    .fill(undefined)
    .map((_, i) => {
      let guess = '';

      if (guesses.length >= 1) {
        if (i === 0) {
          guess = guesses[guesses.length - 1];
        } else {
          guess = currentGuess;
        }
      } else {
        if (i === 0) {
          guess = currentGuess;
        } 
      }
      const cluedLetters = clue(guess, target);
      const lockedIn = i < guesses.length && i === 0;

      return (
        <Row
          key={i}
          wordLength={wordLength}
          rowState={
            lockedIn
              ? RowState.LockedIn
              : i === guesses.length
              ? RowState.Editing
              : RowState.Pending
          }
          cluedLetters={cluedLetters}
        />
      );
    });

  return (
    <div className="Game" style={{ display: props.hidden ? "none" : "block" }} >
      <div className="Game-options" style={{ display: "none"}}>
        <input
          type="range"
          min={minLength}
          max={maxLength}
          id="wordLength"
          disabled={
            gameState === GameState.Playing &&
            (guesses.length > 0 || currentGuess !== "" || challenge !== "")
          }
          value={wordLength}
          onChange={(e) => {
            const length = 5;
            resetRng();
            setGameNumber(1);
            setGameState(GameState.Playing);
            setGuesses([]);
            setCurrentGuess("");
            setTarget(randomTarget(length));
            setWordLength(length);
            setHint(`${length} letters`);
          }}
        ></input>
      </div>
      <div className="Page-top">
      <table
        className="Game-rows"
        tabIndex={0}
        aria-label="Table of guesses"
        ref={tableRef}
      >
        <tbody>{tableRows}</tbody>
      </table>
      <p
        role="alert"
        style={{
          userSelect: /https?:/.test(hint) ? "text" : "none",
          whiteSpace: "pre-wrap",
        }}
      >
        {hint || `\u00a0`}
      </p>
      <div className="Game-seed-info" style={{ display: "none"}}>
        {challenge
          ? "playing a challenge game"
          : seed
          ? `${describeSeed(seed)} — length ${wordLength}, game ${gameNumber}`
          : "playing a random game"}
      </div>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div className="stopwatch"> {/* !-CSS code for stopwatch adapted https://github.com/tinloof/gold-stopwatch/blob/master/script.js */}    
      <div className="time" > <Stopwatch ref={stopwatchRef} /> </div>
      </div>
      {gameState === GameState.Playing && guesses.length !== 0 && (
       <Star />)}
      <p>
      {gameState === GameState.Playing && guesses.length !== 0 && (
        <button
        className="pretty_button"
        style={{ flex: "0 0 auto" }}
        disabled={gameState !== GameState.Playing || guesses.length === 0}
        onClick={() => {
          let completionTimeObject = stopwatchRef.current.getTime();
          setCompletionTime(
            completionTimeObject.minutes.toString().padStart(2, "0") + ':' +
            completionTimeObject.seconds.toString().padStart(2, "0")  + ':' +
            completionTimeObject.milliseconds.toString().padStart(3, "0")
            );
            if (stopwatchRef.current) {
              stopwatchRef.current.stop();
            }
            setFinalMessage("I gave up!");
            setHint(
              `The answer was ${target.toUpperCase()}. (Enter to play again)`
              );
              setGameState(GameState.Lost);
              (document.activeElement as HTMLElement)?.blur();
            }}
            >
            Give up
        </button>
      )}
        {gameState !== GameState.Playing && (
          <button className="pretty_button"
            onClick={() => {
              const emoji = props.colorBlind
                ? ["⬛", "🟦", "🟧"]
                : ["⬛", "🟨", "🟩"];
              const d = new Date();
              let d_day = d.getDate();
              let d_month = d.getMonth();
              let d_year = d.getFullYear();
              share(
                "Result copied to clipboard!",
                `${gameName} ${d_month}/${d_day}/${d_year}\n` +
                `${finalMessage}\n` + 
                `${completionTime}\n` +
                `${getstars()}\n` +
                  guesses
                    .map((guess) =>
                      clue(guess, target)
                        .map((c) => emoji[c.clue ?? 0])
                        .join("")
                    )
                    .join("\n")
              );
            }}
          >
            Share emoji results
          </button>
        )}
      </p>
          <Keyboard
            layout={props.keyboardLayout}
            letterInfo={letterInfo}
            onKey={onKey}
          />
    </div>
  );
}

export default Game;
