var game;

var gameOptions = {
  tileSize: 200,
  tileSpacing: 20,
  boardSize: {
    rows: 4,
    cols: 4
  }
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
    for (var i = 0; i < gameOptions.boardSize.rows; i++) {
      for (var j = 0; j < gameOptions.boardSize.cols; j++) {
        var tilePosition = this.getTilePosition(i, j);
        this.add.image(tilePosition.x, tilePosition.y, "emptytile");
      }
    }
  }

  // (n + 1) * spacing + (n + 0.5) * tilesize
  getTilePosition(row, col) {
    var posX = gameOptions.tileSpacing * (col + 1) + gameOptions.tileSize *
      (col + 0.5);
    var posY = gameOptions.tileSpacing * (row + 1) + gameOptions.tileSize *
      (row + 0.5);
    return new Phaser.Geom.Point(posX, posY);
  }
}

class bootGame extends Phaser.Scene {
  constructor() {
    super("BootGame");
  }

  // Preload the image to use it everytime we need it
  preload() {
    this.load.image("emptytile", "assets/sprites/emptytile.png");
  }

  create() {
    console.log("game is booting...");
    this.scene.start("PlayGame");
  }
}