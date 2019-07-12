var appContainer = document.getElementById("app");
appContainer.style.width = 800 + "px";
appContainer.style.height = 550 + "px";

const GAME_FRAME_RATE = 24;

function GameAnimation(parentElement) {
  var boxes = [];
  this.parentElement = parentElement;

  this.init = function() {
    for (var i = 1; i <= 30; i++) {
      var box = new Box(
        getRandomInt(50, 350),
        getRandomInt(50, 350),
        this.parentElement
      );
      box.init();
      box.setSize();
      var collision;
      do {
        box.setPosition(getRandomInt(0, 400), getRandomInt(0, 400));
        collision = false;
        for (var j = 0; j < boxes.length; j++) {
          let boxB = boxes[j];
          let posX = box.x + box.size / 2 - (boxB.x + boxB.size / 2);
          let posY = box.y + box.size / 2 - (boxB.y + boxB.size / 2);
          let distance = Math.sqrt(Math.pow(posX, 2) + Math.pow(posY, 2));
          if (distance < (box.size + boxB.size) / 2) {
            collision = true;
            break;
          }
        }
      } while (collision);

      box.draw();

      box.setColor(
        getRandomInt(0, 254),
        getRandomInt(0, 254),
        getRandomInt(0, 254)
      );
      boxes.push(box);
    }

    setInterval(this.start.bind(this), GAME_FRAME_RATE);
  };

  this.start = function() {
    boxes.forEach(function(box, index) {
      box.move();
      box.draw();

      box.boundaryDetection();

      boxes.forEach(function(boxB, indexB) {
        if (index == indexB) {
          return;
        }
        let posX = box.x + box.size / 2 - (boxB.x + boxB.size / 2);
        let posY = box.y + box.size / 2 - (boxB.y + boxB.size / 2);
        let distance = Math.sqrt(Math.pow(posX, 2) + Math.pow(posY, 2));
        if (distance < (box.size + boxB.size) / 2) {
          let tempX, tempY;
          tempX = box.dx;
          tempY = box.dy;
          box.dx = boxB.dx;
          box.dy = boxB.dy;
          boxB.dx = tempX;
          boxB.dy = tempY;
        }
      });
    });
  };
}

function Box(x, y, parentElem) {
  this.x = x;
  this.y = y;
  this.element = null;
  this.dx = Math.random() < 0.5 ? 2 : -2;
  this.parentElement = parentElem;
  this.dy = Math.random() < 0.5 ? 2 : -2;

  this.init = function() {
    this.element = document.createElement("div");
    this.element.className = "box";
    this.element.onclick = function(event) {
      event.target.style.display = "none";
    };
    this.parentElement.appendChild(this.element);
    return;
  };

  this.move = function() {
    this.x += this.dx;
    this.y += this.dy;
    this.boundaryDetection.bind(this);
  };
  this.boundaryDetection = function() {
    if (
      parseInt(this.x) >
      parseInt(appContainer.style.width) - parseInt(this.element.style.width)
    ) {
      this.dx *= -1;
      this.x =
        parseInt(appContainer.style.width) - parseInt(this.element.style.width);
    }
    if (parseInt(this.x) <= 0) {
      this.dx *= -1;
      this.x = 0;
    }
    if (
      parseInt(this.y) >
      parseInt(appContainer.style.height) - parseInt(this.element.style.height)
    ) {
      this.dy *= -1;
      this.y =
        parseInt(appContainer.style.height) -
        parseInt(this.element.style.height);
    }
    if (parseInt(this.y) <= 0) {
      this.dy *= -1;
      this.y = 0;
    }
  };
  this.draw = function() {
    this.element.style.top = this.y + "px";
    this.element.style.left = this.x + "px";
  };
  this.setSize = function() {
    this.size = getRandomInt(30, 50);
    this.element.style.width = this.element.style.height = this.size + "px";
    this.boundaryDetection.bind(this);
  };

  this.setPosition = function(x, y) {
    this.x = x;
    this.y = y;
  };
  this.setColor = function(x, y, z) {
    this.element.style.backgroundColor = `rgb(${x},${y},${z})`;
  };
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

new GameAnimation(appContainer).init();
