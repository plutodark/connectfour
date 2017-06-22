Problem:
Connect Four is a two-player connection game in which the players first choose a color and then take turns dropping colored discs from the top into a seven-column, six-row vertically suspended grid.

- The pieces fall straight down, occupying the next available space within the column.
- The objective of the game is to be the first to form a horizontal, vertical, or diagonal line of four of one’s own discs.


Solution:
The game logic is mainly written by javascript, with help of JQuery. The vue.js has been used for the message in the center. 

The material Design Lite has been used for the outlook of the game. And I have choosed a font from Google Fonts to match the nature of the mini-game like this.

For the AI part, Minimax algorithm has been used for the game, by the help of Breath-first search to calculate the score for each child level.

The logical board is saved in two dimensional array.

Trade-offs:
The challenge is mainly from the AI. Although the minimax algorithm is going to calculate every possible steps for the player, every turn there are 7 different choices need to be calculated. That means to completely calculate 4 same colour checkers place on the board, it takes 7^8 =  5764801 calculation to take make decision on one single step, which is high demand on time and resource.

That's why some modification has been made on the algorithm. Every level, the search tree only keep the parent steps with highest score to continue the calculation. It reduced a lot of unnecessary moves on the search. Second, If the search reaches level 5 and still not get the answer it wants, it changes a easier algorithm. It searches only one step, to find the step with highest chance to win on vertical, horizontal and diagonal.




Library has been used:
Interaction:
JQuery
Vue.js

Outlook:
Material Design Lite
https://getmdl.io/
Google Fonts

AI Algorithm:
Minmax
Breath-first search
