var game;

var gameOptions = {
  tileSize: 200,
  tileSpacing: 20,
  boardSize: {
    rows: 4,
    cols: 4
  },
  tweenspeed: 2000
}

window.onload = function () {
  var gameConfig = {
    width: this.gameOptions.boardSize.cols * (this.gameOptions.tileSize + this.gameOptions.tileSpacing) + this.gameOptions.tileSpacing,
    height: this.gameOptions.boardSize.rows * (this.gameOptions.tileSize + this.gameOptions.tileSpacing),
    backgroundColor: 0xecf0f1,
    scene: [bootGame, playGame]
  }
  game = new Phaser.Game(gameConfig);

  // bring the current window in the foreground
  window.focus();

  // resize the game size if the window size changes
  resizeGame();
  window.addEventListener("resize", resizeGame);
}

/*
* Matches the screen size of the device
*/
function resizeGame() {
  var canvas = document.querySelector("canvas");
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var windowRatio = windowWidth / windowHeight;
  var gameRatio = game.config.width / game.config.height;

  // cover the full window size 
  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + "px";
    canvas.style.height = (windowWidth / gameRatio) + "px";
  }
  else {
    canvas.style.width = (windowHeight * gameRatio) + "px";
    canvas.style.height = windowHeight + "px";
  }
}

class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }
  create() {
    // the player cant start until all tweens are fully done
    this.canMove = false;
    this.boardArray = [];
    for (var i = 0; i < gameOptions.boardSize.rows; i++) {
      this.boardArray[i] = [];
      for (var j = 0; j < gameOptions.boardSize.cols; j++) {
        var tilePosition = this.getTilePosition(i, j);
        this.add.image(tilePosition.x, tilePosition.y, "emptytile");
        // use the preloaded sprite starting at the first tile
        var tile = this.add.sprite(tilePosition.x, tilePosition.y, "tiles", 0);
        tile.visible = false;

        // tileValue: 0 = empty tile
        this.boardArray[i][j] = {
          tileValue: 0,
          tileSprite: tile
        }
      }
    }
    this.addTile();
    this.addTile();

    this.input.keyboard.on("keydown", this.handleKey, this);
    this.input.on("pointerup", this.handleSwipe, this);
  }

  // (n + 1) * spacing + (n + 0.5) * tilesize
  getTilePosition(row, col) {
    var posX = gameOptions.tileSpacing * (col + 1) + gameOptions.tileSize *
      (col + 0.5);
    var posY = gameOptions.tileSpacing * (row + 1) + gameOptions.tileSize *
      (row + 0.5);
    return new Phaser.Geom.Point(posX, posY);
  }

  addTile() {
    var emptyTiles = [];
    for (var i = 0; i < gameOptions.boardSize.rows; i++) {
      for (var j = 0; j < gameOptions.boardSize.cols; j++) {
        if (this.boardArray[i][j].tileValue == 0) {
          emptyTiles.push({
            row: i,
            col: j
          })
        }
      }
    }

    if (emptyTiles.length > 0) {
      var chosenTile = Phaser.Utils.Array.GetRandom(emptyTiles);
      // 1 = 2^1 = 2
      this.boardArray[chosenTile.row][chosenTile.col].tileValue = 1;
      this.boardArray[chosenTile.row][chosenTile.col].tileSprite.visible = true;
      // displays the first frame of the sprite
      this.boardArray[chosenTile.row][chosenTile.col].tileSprite.setFrame(0);
      // animates the alpha value from 0 to 1 in duration time
      this.boardArray[chosenTile.row][chosenTile.col].tileSprite.alpha = 0;
      this.tweens.add({
        targets: [this.boardArray[chosenTile.row][chosenTile.col].tileSprite], alpha: 1, duration: gameOptions.tweenspeed, callbackScope: this, onComplete: function () {
          console.log("Tween/Animation competed. Setting canMove to true!"),
            this.canMove = true;
        }
      });
    }
  }

  handleKey(e) {
    var keyPressed = e.code
    console.log("You pressed key #" + keyPressed);
  }

  handleSwipe() {
    console.log("Swipe detected!");
  }
}

class bootGame extends Phaser.Scene {
  constructor() {
    super("BootGame");
  }

  /* 
  * Preload the images and sprites to use it everytime we need it.
  * images for static, sprites for animated content
  */
  preload() {
    this.load.image("emptytile", "assets/sprites/emptytile.png");
    this.load.spritesheet("tiles", "assets/sprites/tiles.png", {
      frameWidth: gameOptions.tileSize,
      frameHeight: gameOptions.tileSize
    });
  }

  create() {
    console.log("game is booting...");
    this.scene.start("PlayGame");
  }
}
