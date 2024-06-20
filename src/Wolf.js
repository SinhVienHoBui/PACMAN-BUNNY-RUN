import MovingDirection from "./MovingDirection.js";
import {pacman} from "./Game.js"
import { dijkstra } from "./dijkstra.js"; 

export default class Wolf{
  constructor(x,y,tileSize,velocity,tileMap){
    this.x =x;
    this.y = y;
    this.velocity = velocity;
    this.tileMap = tileMap;
    this.tileSize = tileSize;

    this.#loadImages();
    this.movingDirection = Math.floor(Math.random() * Object.keys(MovingDirection).length);

    this.directionTimerdefault = this.#random(10,50);
    this.directionTimer = this.directionTimerdefault;

    this.scaredAboutToExpireTimerDefault = 10;
    this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
  }
  draw(ctx,pause,pacman){
    if (!pause) {
      this.#move();
      this.FollowPacman();;
    }
    this.#setImage(ctx, pacman);
  }

  collideWith(pacman) {
    const size = this.tileSize / 2;
    if (
      this.x < pacman.x + size &&
      this.x + size > pacman.x &&
      this.y < pacman.y + size &&
      this.y + size > pacman.y
    ) {
      return true;
    } else {
      return false;
    }
  }


  FollowPacman() {
    const pacX = pacman.x; // Pacman's x position
    const pacY = pacman.y; // Pacman's y position
    const start = [Math.floor(this.x / this.tileSize), Math.floor(this.y / this.tileSize)]; // Enemy's current position
    const end = [Math.floor(pacX / this.tileSize), Math.floor(pacY / this.tileSize)]; // Pacman's position
  
    const path = dijkstra(this.tileMap.map, start, end); // Calculate the shortest path using Dijkstra algorithm
  
    if (path.length > 1) {
      // If a path is found and it has at least one step
      // Determine the next move based on the next node in the path
      const nextNode = path[1]; // Assuming path[0] is the current position
      const nextX = nextNode[0] * this.tileSize; // Calculate the x position of the next node
      const nextY = nextNode[1] * this.tileSize; // Calculate the y position of the next node
  
      // Determine the new move direction based on the next node's position
      let newMoveDirection = null;
      if (nextX > this.x) {
        newMoveDirection = MovingDirection.right;
      } else if (nextX < this.x) {
        newMoveDirection = MovingDirection.left;
      } else if (nextY > this.y) {
        newMoveDirection = MovingDirection.down;
      } else if (nextY < this.y) {
        newMoveDirection = MovingDirection.up;
      }
  
      if (newMoveDirection != null && this.movingDirection != newMoveDirection) {
        if (
          Number.isInteger(this.x / this.tileSize) &&
          Number.isInteger(this.y / this.tileSize)
        ) {
          if (!this.tileMap.didCollideWithEnvironment(this.x, this.y, newMoveDirection)) {
            this.movingDirection = newMoveDirection;
          }
        }
      }
    }
  }
  
  


  #setImage(ctx, pacman) {
    if (pacman.powerDotActive) {
      this.#setImageWhenPowerDotIsActive(pacman);
    } else {
      this.image = this.normalGhost;
    }
    ctx.drawImage(this.image, this.x, this.y, this.tileSize, this.tileSize);
  }

  #setImageWhenPowerDotIsActive(pacman) {
    if (pacman.powerDotAboutToExpire) {
      this.scaredAboutToExpireTimer--;
      if (this.scaredAboutToExpireTimer === 0) {
        this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
        if (this.image === this.scaredGhost) {
          this.image = this.scaredGhost2;
        } else {
          this.image = this.scaredGhost;
        }
      }
    } else {
      this.image = this.scaredGhost;
    }
  }

  #random(min,max){
    return Math.floor(Math.random()*(max - min + 1)) + min;
  }

  #move(){
    if(!this.tileMap.didCollideWithEnvironment(this.x, this.y,this.movingDirection)){
      switch(this.movingDirection){
        case MovingDirection.up:
          this.y -= this.velocity;
          break;
        case MovingDirection.down:
         this.y += this.velocity;
          break;
        case MovingDirection.left:
          this.x -= this.velocity;
          break;
        case MovingDirection.right:
          this.x += this.velocity;
          break;

      }
    }
  }



  #loadImages(){
    this.normalGhost = new Image();
    this.normalGhost.src = '../images/wolf.png';


    this.scaredGhost = new Image();
    this.scaredGhost.src = '../images/tiredwolf.png';


    this.scaredGhost2 = new Image();
    this.scaredGhost2.src = '../images/tiredwolf.png';


    this.image = this.normalGhost;

  }
}

