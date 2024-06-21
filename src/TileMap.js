import Rabbit from "./Rabbit.js";
import Wolf from "./Wolf.js";
import MovingDirection from "./MovingDirection.js";


export default class TileMap { //By exporting the class as default, it can be imported and used in other modules or files.
  constructor(tileSize) {
    this.tileSize = tileSize;
    this.eated = false;

    // Define image sources
    const images = {
      pipeCorner1: "images/pipeCorner1.png",
      pipeCorner2: "images/pipeCorner2.png",
      pipeCorner3: "images/pipeCorner3.png",
      pipeCorner4: "images/pipeCorner4.png",
      pipeHorizontal: "images/pipeHorizontal.png",
      pipeVertical: "images/pipeVertical.png",
      blockBottom: "images/blockBottom.png",
      blockLeft: "images/blockLeft.png",
      blockRight: "images/blockRight.png",
      blockTop: "images/blockTop.png",
      yellowDot: "images/carrot.png",
      pinkDot: "images/goldcarrot.png",
      heartRed: "images/heart.png",
      heartGreen: "images/heart_green.png"
    };

    // Load images
    for (const [key, src] of Object.entries(images)) {
      this[key] = new Image();
      this[key].src = src;
    }

    this.heart = this.heartRed;
    this.heartAnimationTimerDefault = 10;
    this.heartAnimationTimer = this.heartAnimationTimerDefault;

    this.powerDot = this.pinkDot;
    this.powerDotAnmationTimerDefault = 30;
    this.powerDotAnmationTimer = this.powerDotAnmationTimerDefault;
  }

  map = [ [ 1, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11,  2], 
          [12,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  6,  0,  0,  0,  0,  0,  0,  0, 12], 
          [12,  0,  1, 11, 11, 11, 11, 11, 11, 11, 11, 15,  0, 14, 11, 11, 11, 15,  0, 12], 
          [12,  0, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 12], 
          [12,  0, 10, 11, 15,  0, 14, 11, 11, 11, 11, 11, 11, 11, 15,  0, 14, 15,  0, 12], 
          [12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 12], 
          [12,  0,  1, 11, 11, 11, 11,  2,  0,  0,  1, 11, 11, 11, 11, 11, 11,  2,  0, 12], 
          [12,  0, 12,  0,  0,  0,  0, 10, 11, 11,  8,  0,  0,  0,  0,  0,  6, 12,  0, 12], 
          [12,  0, 12,  0,  0,  0,  0,  0,  0,  0,  3,  0,  0,  0,  0,  0, 14,  8,  0, 12], 
          [12,  0, 10, 15,  0,  1, 11, 11, 11,  2,  0,  1, 11, 11,  2,  0,  0,  0,  0, 12], 
          [12,  0,  0,  0,  0, 12,  0,  0,  5, 13,  0, 13,  0,  6, 12,  0,  1,  2,  0, 12], 
          [12,  0,  1,  2,  0, 12,  0, 16, 17,  0,  0,  0,  0,  0, 12,  0, 12, 12,  0, 12], 
          [12,  0, 10,  8,  0, 13,  0, 10, 11, 11, 11, 11, 11, 11,  8,  0, 10,  8,  0, 12], 
          [12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 12], 
          [12,  5, 16,  0, 16,  0, 14, 11, 11, 11,  2,  0, 14, 15,  0, 16,  0, 16,  0, 12], 
          [12,  0, 12,  0, 13,  0,  0,  0,  0,  0, 13,  0,  0,  0,  0, 13,  0, 12,  0, 12], 
          [12,  0, 12,  0,  0,  0,  1, 11,  2,  0,  0,  0,  0, 16,  0,  0,  5, 12,  0, 12], 
          [12,  0, 10, 11, 15,  0, 12,  0, 13,  0, 14, 11, 11,  8,  0, 14, 11,  8,  0, 12], 
          [12,  0,  0,  0,  0,  0, 12,  0,  0,  0,  0,  6,  0,  0,  0,  0,  0,  0,  0, 12], 
          [10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11,  8], 
        ];

  draw(ctx) {
    const drawFunctions = {
      0: this.#drawDot,
      1: this.#drawCorner1,
      2: this.#drawCorner2,
      6: this.#drawPowerDot,
      8: this.#drawCorner3,
      10: this.#drawCorner4,
      11: this.#drawHorizontal,
      12: this.#drawVertical,
      13: this.#drawBottom,
      14: this.#drawLeft,
      15: this.#drawRight,
      16: this.#drawTop,
      17: this.#drawHeart
    };
        
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        let tile = this.map[row][column];
        const drawFunction = drawFunctions[tile] || this.#drawBlank;
        drawFunction.call(this, ctx, column, row, this.tileSize);
      }
    }
  }
        

  #drawTile(ctx, image, column, row, size) {
    ctx.drawImage(
      image,
      column * this.tileSize,
      row * this.tileSize,
      size,
      size
    );
  }
  
  #drawDot(ctx, column, row, size) {
    this.#drawTile(ctx, this.yellowDot, column, row, size);
  }
  
  #drawCorner1(ctx, column, row, size) {
    this.#drawTile(ctx, this.pipeCorner1, column, row, size);
  }
  
  #drawCorner2(ctx, column, row, size) {
    this.#drawTile(ctx, this.pipeCorner2, column, row, size);
  }
  
  #drawCorner3(ctx, column, row, size) {
    this.#drawTile(ctx, this.pipeCorner3, column, row, size);
  }
  
  #drawCorner4(ctx, column, row, size) {
    this.#drawTile(ctx, this.pipeCorner4, column, row, size);
  }
  
  #drawHorizontal(ctx, column, row, size) {
    this.#drawTile(ctx, this.pipeHorizontal, column, row, size);
  }
  
  #drawVertical(ctx, column, row, size) {
    this.#drawTile(ctx, this.pipeVertical, column, row, size);
  }
  
  #drawBottom(ctx, column, row, size) {
    this.#drawTile(ctx, this.blockBottom, column, row, size);
  }
  
  #drawLeft(ctx, column, row, size) {
    this.#drawTile(ctx, this.blockLeft, column, row, size);
  }
  
  #drawRight(ctx, column, row, size) {
    this.#drawTile(ctx, this.blockRight, column, row, size);
  }
  
  #drawTop(ctx, column, row, size) {
    this.#drawTile(ctx, this.blockTop, column, row, size);
  }

  #drawPowerDot(ctx, column, row, size) {
    this.powerDotAnmationTimer--;
    if (this.powerDotAnmationTimer === 0) {
      this.powerDotAnmationTimer = this.powerDotAnmationTimerDefault;
      if (this.powerDot == this.pinkDot) {
        this.powerDot = this.yellowDot;
      } else {
        this.powerDot = this.pinkDot;
      }
    }
    ctx.drawImage(this.powerDot, column * size, row * size, size, size);
  }

  #drawBlank(ctx, column, row, size) {
    ctx.fillStyle = "rgb(128, 79, 25)";
    ctx.fillRect(column * this.tileSize, row * this.tileSize, size, size);
  }

  
  #drawHeart(ctx, column, row, size){
    this.heartAnimationTimer--;
    if (this.heartAnimationTimer === 0) {
      this.heartAnimationTimer = this.heartAnimationTimerDefault;
      if (this.heart == this.heartRed) {
        this.heart = this.heartGreen;
      } else {
        this.heart = this.heartRed;
      }
    }
    ctx.drawImage(this.heart, column * size, row * size, size, size);


  }

  getPacman(velocity) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        let tile = this.map[row][column];
        if (tile === 3) {
          this.map[row][column] = 0;
          return new Rabbit(
            column * this.tileSize,
            row * this.tileSize,
            this.tileSize,
            velocity,
            this
          );
        }
      }
    }
  }

  getEnemies(velocity) {
    const enemies = [];

    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        const tile = this.map[row][column];
        if (tile == 5) {
          this.map[row][column] = 0;
          enemies.push(
            new Wolf(
              column * this.tileSize,
              row * this.tileSize,
              this.tileSize,
              velocity,
              this
            )
          );
        }
      }
    }
    return enemies;
  }

  setCanvasSize(canvas) {
    canvas.width = this.map[0].length * this.tileSize;
    canvas.height = this.map.length * this.tileSize;
  }

  didCollideWithEnvironment(x, y, direction) {
    if (direction == null) {
      return;
    }
  
    if (Number.isInteger(x / this.tileSize) && Number.isInteger(y / this.tileSize)) {
      let column = x / this.tileSize;
      let row = y / this.tileSize;
  
      switch (direction) {
        case MovingDirection.right:
          column = (x + this.tileSize) / this.tileSize;
          break;
        case MovingDirection.left:
          column = (x - this.tileSize) / this.tileSize;
          break;
        case MovingDirection.up:
          row = (y - this.tileSize) / this.tileSize;
          break;
        case MovingDirection.down:
          row = (y + this.tileSize) / this.tileSize;
          break;
      }
  
      const tile = this.map[row][column];
      const collidableTiles = new Set([1, 2, 8, 10, 11, 12, 13, 14, 15, 16]);
  
      return collidableTiles.has(tile);
    }
    return false;
  }
  

  didWin() {
    return this.#dotsLeft() === 0;
  }

  #dotsLeft() {
    return this.map.flat().filter((tile) => tile === 0).length;
  }

 eatCarrot(x, y) {
    
    const row = y / this.tileSize;
    const column = x / this.tileSize; // calculate the coordinate of dot
    if (Number.isInteger(row) && Number.isInteger(column)) { // make sure is interger
      // console.log(x, y);
      if (this.map[row][column] === 0) { // on dot
        //console.log("true");
        this.map[row][column] = 4; //empty space
        // return true;
        this.eated = true;
      }
    }
    // return false;
  }

  eatGoldCarrot(x, y) {
    const row = y / this.tileSize;
    const column = x / this.tileSize;
    if (Number.isInteger(row) && Number.isInteger(column)) {
      const tile = this.map[row][column];
      if (tile === 6) {
        this.map[row][column] = 4;
        return true;
      }
    }
    return false;
  }
  
  speedUp(x,y){
    const row = y / this.tileSize;
    const column = x / this.tileSize;
    if (Number.isInteger(row) && Number.isInteger(column)) {
      const tile = this.map[row][column];
      if (tile === 17) {
        this.map[row][column] = 4;
        return true;
      }
    }
    return false;

  }

}