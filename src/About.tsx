import { Clue } from "./clue";
import { Row, RowState } from "./Row";
import { gameName, maxGuesses } from "./util";
  
/* This is the about function. It is what produces the about screen that populates once you press the question mark on the screen. */

export function About() {
  return (
    <div className="App-about">
      <p>
        <i>{gameName}</i> is a remake of the word game{" "}
        <a href="https://www.powerlanguage.co.uk/wordle/">
          <i>Wordle</i>
        </a>{" "}
        by <a href="https://twitter.com/powerlanguish">powerlanguage</a>
      .</p>
      <p>
        This game is also heavily indebted to the game {" "}
        <a href="https://hellowordl.net/">
          <i>hello wordl</i>
        </a>{" "}
        and the code it has made publicly accessible on <a href="https://github.com/lynn/hello-wordl">GitHub</a>
      .</p>
      <p>
      </p>
      <hr />
      <p>Basically, the goal of this game to guess a secret word as <i>quickly</i> as possible. In other words, you need to <i>blurt</i> out words until you arrive at the correct answer. You have unlimited guesses, but you will be timed.</p>
      <hr />
      <p></p>
      <p>You will start the stopwatch by guessing a five-letter word. The game will then color the tiles to indicate how near you are to the actual word. For example, if you were to guess the word <i>blurt</i>:</p>
      <Row
        rowState={RowState.LockedIn}
        wordLength={5}
        cluedLetters={[
          { clue: Clue.Absent, letter: "b" },
          { clue: Clue.Absent, letter: "l" },
          { clue: Clue.Absent, letter: "u" },
          { clue: Clue.Elsewhere, letter: "r" },
          { clue: Clue.Correct, letter: "t" },
        ]}
      />
      <p>
        <b>B</b>, <b>L</b>, and <b>U</b> aren't in the target word at all.
      </p>
      <p>
        <b className={"yellow-bg"}>R</b> occurs <i>elsewhere</i> in the target word.
        <br />
        <strong>(Maybe more than once??)</strong>
        <br />
      </p>
      <p>
        <b className={"green-bg"}>T</b> is in the correct spot.
        <br />
        <strong>(There may still be a second R in the word)</strong>
      </p>
      <hr />
      <p>
        Let's try another word. One rule in this game is that you <i>HAVE</i> to use <i>ALL</i> available information.
      </p>
      <Row
        rowState={RowState.LockedIn}
        wordLength={5}
        cluedLetters={[
          { clue: Clue.Correct, letter: "G" },
          { clue: Clue.Correct, letter: "R" },
          { clue: Clue.Absent, letter: "E" },
          { clue: Clue.Elsewhere, letter: "A" },
          { clue: Clue.Correct, letter: "T" },
        ]}
        annotation={"So close!"}
      />
      <Row
        rowState={RowState.LockedIn}
        wordLength={5}
        cluedLetters={[
          { clue: Clue.Correct, letter: "G" },
          { clue: Clue.Correct, letter: "R" },
          { clue: Clue.Correct, letter: "A" },
          { clue: Clue.Correct, letter: "N" },
          { clue: Clue.Correct, letter: "T" },
        ]}
        annotation={"Congrats!"}
      />
      <p>
      <hr />
      <p>
        If you guess the word in under 30 seconds, you get five stars.
      </p>
      <strong>⭐⭐⭐⭐⭐</strong>
      <p>
        Every additional thirty seconds means you lose 1 more star, so BLURT quickly if you want to outscore your friends!
      </p>
        Best of luck! Enjoy your gameplay.
      </p>
    </div>
  );
}
