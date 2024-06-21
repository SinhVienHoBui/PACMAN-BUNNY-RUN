/* Name: Bui Nhu Y
   ID: ITCSIU21247
   Purpose: implement the main game logic, managing game states.
*/

import TileMap from "./TileMap.js";
import MovingDirection from "./MovingDirection.js";
import { dijkstra } from "./dijkstra.js"; 



const tileSize = 32;
const velocity = 2;
const velocityghost = 1;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl= document.getElementById("scoreEl");
console.log(scoreEl)

const tileMap = new TileMap(tileSize); //create object to describe

export const pacman = tileMap.getPacman(velocity);
const enemies = tileMap.getEnemies(velocityghost);

let gameOver = false;
let gameWin = false;
let score = 0;

let lives = 3;

// sound
const gameOverSound = new Audio("/sounds/gameOver.wav");
const gameWinSound = new Audio("/sounds/start.ogg");

function gameLoop(){ // redraw the screen certain number of times every 1 second
    tileMap.draw(ctx);
    drawGameEnd();
    pacman.draw(ctx, pause(), enemies);
    enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
    upgradeScore();
    checkGameOver();
    checkGameWin();
    drawRemainingLives();
    update();
}

function checkGameWin() {
    if (!gameWin) {
      gameWin = tileMap.didWin();
      if (gameWin) {
        gameWinSound.play();
      }
    }
  }
  
  function checkGameOver() {
    if (!gameOver) {
      gameOver = isGameOver();
      if (gameOver) {
        gameOverSound.play();
      }
    }
  }
  
  function isGameOver() {
    return enemies.some(
      // (enemy) => !pacman.powerDotActive && enemy.collideWith(pacman)
      (enemy) => lives == 0

    );
  }
  
  function pause() {
    return !pacman.madeFirstMove || gameOver || gameWin;
  }
  function  MovingAfterCollision(pacman){
    if(pacman.currentMovingDirection == MovingDirection.up){
      pacman.y += pacman.velocity * 20;
    }
    if(pacman.currentMovingDirection == MovingDirection.down){
      pacman.y -= pacman.velocity * 20;

    }if(pacman.currentMovingDirection == MovingDirection.right){
      pacman.x -= pacman.velocity * 20;

    }if(pacman.currentMovingDirection == MovingDirection.left){
      pacman.x += pacman.velocity * 20;
    }
  }
function goldCarrotActive(pacman){
   return pacman.goldCarrotActive;
}
  

  function upgradeScore() {
    if(tileMap.eated){
      score+=10;
      scoreEl.innerHTML = score;
      tileMap.eated = false;
    }
  }

  

  function drawRemainingLives() {
    ctx.font = "20px gemunu libre";
    ctx.fillStyle = "white";
    ctx.fillText("      Lives:", 5, canvas.height - 10);
    for (let i = 0; i < lives; i++) {
      ctx.fillText("❤️", 70 + i * 20, canvas.height - 10);
    }
  }
  
  function onGhostCollision() {
    if(lives > 0){
      lives--;
      console.log(lives);
      pacman.madeFirstMove = false;// to stop the game
    }
    if(lives == 0){
      gameOver = true;
    } 
  }

  function update() {
    enemies.forEach((enemy) => {
      if (enemy.collideWith(pacman)) {
        if(goldCarrotActive(pacman) == false){
       
          MovingAfterCollision(pacman);  
          onGhostCollision();
          
        }
      }
    });
  }    
  
  function drawGameEnd() {
    if (gameOver || gameWin) {
      let text = " YOU WIN!";
      if (gameOver) {
        text = "GAME OVER";
      }
  
      ctx.fillStyle = "black";
      ctx.fillRect(0, canvas.height / 3.2, canvas.width, 80);
  
      ctx.font = "60px arial";      
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop("0", "yellow");
      gradient.addColorStop("0.5", "red");
      gradient.addColorStop("1.0", "red");
  
      ctx.fillStyle = gradient;
      ctx.fillText(text, 150, 260);
    }
  }
  
tileMap.setCanvasSize(canvas);
setInterval(gameLoop, 1000 / 75); //call the funtion every x periods of times (milliseconds) (1000 millseconds = 1 seconds / 75 )
// call this method 75 times every 1 second to redraw the screen 

let start = [3, 3]; // Enemy start position
let end = [1, 4]; // Pacman position

let path = dijkstra(map, start, end);
console.log(path);
