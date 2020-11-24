# MineSwept
Base repository for MineSwept games, including MineSwept: Caves and MineSwept: Classic.

<h1>How to use the app</h1>

<div>•    First in order to use the app, you have to create an account through the sign in button or if you have an account already simply login. 

•    In order to delete an account you  have to put in your name and password and click the delete button

•    Once you enter the homepage, you will see the global leader board allowing you to compare your self to the likes of others

•    In order to start a game, select your difficultly by clicking the button above play. Then when the desired difficulty is chosen, click play.

•    Once the board is rendered click anywhere on the grid in order to start the game. Traverse the mine while breaking blocks, taking gems, and avoiding lava

•    If you win the game, return home to see if you beat anyone on the global leader board, if not you can try again by starting a new game
</div>

<h1>App features
<div>
•    Login with premade accounts 

•    Create a new account

•    Delete old accounts with account information 

•    Competitive multiplayer through online leaderboard 

•    Allows you to play the MineSwept craft game. 
</div>
<h1>Backend 

<div>
We store our user and score information on a separate online mongoDB server. We connect to our server by using axios to call another function in our app.js that then sends a mongo query to our databases. We do use 2 json databases for efficiency. With these databases we can make create, post, read, update, and delete whatever information we want. For the purposes, the purposes of our project, we typically create user data, read it, or delete it when needed.
</div>

<h1>How to run locally 
  <div>
To run locally, install required dependencies listed in package.json, then run the command 'node app.js'.
</div>


<h1>Technologies used: 
<div>
•    Node.js

•    Bulma

•    JQuery

•    Axios

•    Express

•    MongoDB

•    Heroku

•    Body-parser

•    Data-store
</div>

<h1>Authors
<div>
•    Justin Bautista 

•    Felimon Holland

•    Kemani Simms
</div>
<h1>Website link
  <div>
•    https://mineswept-caves.herokuapp.com/

</div>
