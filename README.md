# blurtle

It's [Wordle](https://www.powerlanguage.co.uk/wordle/) but it's timed!

Play it [**here**](https://grantbw4.github.io/blurtle ).

## Introduction

You have unlimited tries to guess an unspecified 5-letter word. The time elasped will be recorded. 

Click _About_ inside the game to learn by example.

## Technical Stuff

This game is a Wordle offshoot/remix based on [**hello wordl**] (https://github.com/lynn/hello-wordl). To get started, we forked the code on GitHub and then made a lot of adjustments to the mechanics, interface, and functionality of the game.

To run the code locally, you can [**fork this repository**] (https://docs.github.com/en/get-started/quickstart/fork-a-repo), clone it into your preferred coding apparatus, and then install [**Node.js and npm**] (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-version-manager-to-install-nodejs-and-npm). Then, within the terminal, enter "run npm install" and then "npm run start". 

Blurtle will be running at http://localhost:3000/. Any changes you make to the source code will be reflected there. Have fun!

## Additional Information 

The ? button in the top-right corner of the screen is an "about" page. Here, you will be able to see the rules of the game. Basically, a timer will begin as soon as you enter your first word. You will then have unlimited tries to guess the target word. You begin the game with 5 stars, but every 30 seconds that pass, you will lose a star. 