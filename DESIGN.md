# Design Document
This is meant to be a short reflection on the coding decisions that went into implementing this game.

## Technical Decisions

We decided to leverage an already-existing GitHub [**repository**] (https://github.com/lynn/hello-wordl) to form the framework of the site. We took this site and removed a lot of the extraneous features that we felt added a level of complexity that we didn't want to Blurtle to contain. We then modified many of the interface features (the favicon, the background gradient, the about page) as well as several internal features (added a stopwatch, added a linear gauge of stars, reduced the number of visible rows, and interfaced the stopwatch time with the gauge as well as the sharing feature.) One of the most difficult items was configuring the stopwatch such that its functions could be used within the Game file. We were able to solve this issue after consulting with a friend (shout out to Marco!) and implementing a reference handler. 

The linear gauge proved challenging as well. We debated on whether to increment the stars to decrease steadily as time went on or to decrease in set intervals but ultimately opted to non-continuously remove stars so that the timer value didn't need to be read unnecessarily frequently. 

While JavaScript was new for the both of us, we enjoyed reading up on the documentation and decoding what first appeared cryptic to us.

## Ethical Decisions

To begin, this game stemmed from a frustration with the amount of time that we found ourselves spending on Wordle. We felt that Wordle, while incredibly fun and novel, relied too heavily on luck, so we wanted to create a Wordle clone that was perhaps more skill-based and quick. 

### Who are the intended users of the project? 
The intended audience of this game is anyone who, like us, identifies as Worlde enthusiasts. There, perhaps, is a slight focus on engaging with Wordle users who might prefer a quicker game.


### How does your project's impact on users change as the project scales up? 

Visually impaired users, as well anyone sensitive to strobing lights, could be inequitably affected by this website. As the project expands, we hope to make this game more accessible for those populations. 

If this project were widely adopted, we would want to be cautious about how (and whether) we track users to provide scoreboards. We would want to preserve users' privacy as much as possible. 
