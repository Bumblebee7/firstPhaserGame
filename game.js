var game;

window.onload = function () {
  var gameConfig = {
    width: 900,
    height: 900,
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
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        this.add.image(120 + j * 220, 120 + i * 220, "emptytile");
      }
    }
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