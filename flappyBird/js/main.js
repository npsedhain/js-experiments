//game constants
const canvas = document.getElementById("myCanvas");
canvas.width = 320;
canvas.height = 480;
const ctx = canvas.getContext("2d");
const DEGREE = Math.PI / 180;

//Load sprite image
const sprite = new Image();
sprite.src = "images/sprite.png";

//game state
const state = {
  current: 0,
  getReady: 0,
  game: 1,
  gameOver: 2
};

//game control
canvas.addEventListener("click", e => {
  switch (state.current) {
    case state.getReady:
      state.current = state.game;
      break;
    case state.game:
      bird.flap();
      break;
    case state.gameOver:
      let rect = canvas.getBoundingClientRect();
      let clickX = e.clientX - rect.left;
      let clickY = e.clientY - rect.top;
      if (
        clickX >= startBtn.x &&
        clickX <= startBtn.x + startBtn.w &&
        clickY >= startBtn.y &&
        clickY <= startBtn.y + startBtn.h
      ) {
        bird.reset();
        pipes.reset();
        score.reset();
        state.current = state.getReady;
      }

      break;
  }
});

const startBtn = {
  x: 120,
  y: 263,
  w: 83,
  h: 29
};

//background object
const bg = {
  sX: 0,
  sy: 0,
  w: 275,
  h: 226,
  dX: 0,
  dY: canvas.height - 226,

  draw: function() {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sy,
      this.w,
      this.h,
      this.dX,
      this.dY,
      this.w,
      this.h
    );
    ctx.drawImage(
      sprite,
      this.sX,
      this.sy,
      this.w,
      this.h,
      this.dX + this.w,
      this.dY,
      this.w,
      this.h
    );
  }
};

//foreground object
const fg = {
  sX: 276,
  sy: 0,
  w: 224,
  h: 112,
  dX: 0,
  dY: canvas.height - 112,
  dx: 2,

  draw: function() {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sy,
      this.w,
      this.h,
      this.dX,
      this.dY,
      this.w,
      this.h
    );
    ctx.drawImage(
      sprite,
      this.sX,
      this.sy,
      this.w,
      this.h,
      this.dX + this.w,
      this.dY,
      this.w,
      this.h
    );
  },

  update: function() {
    if (state.current == state.game) {
      this.dX = (this.dX - this.dx) % (this.w / 2);
    }
  }
};

//bird object
const bird = {
  animation: [
    { sX: 276, sY: 112 },
    { sX: 276, sY: 139 },
    { sX: 276, sY: 164 },
    { sX: 276, sY: 139 }
  ],
  w: 34,
  h: 26,
  dX: 50,
  dY: 150,
  radius: 12,

  frame: 0,
  speed: 0,
  gravity: 0.25,
  jump: 4.5,
  rotation: 0,
  draw: function() {
    let bird = this.animation[this.frame];
    ctx.save();
    ctx.translate(this.dX, this.dY);
    ctx.rotate(this.rotation);
    ctx.drawImage(
      sprite,
      bird.sX,
      bird.sY,
      this.w,
      this.h,
      -this.w / 2,
      -this.h / 2,
      this.w,
      this.h
    );
    ctx.restore();
  },

  reset: function() {
    this.speed = 0;
    this.rotation = 0;
  },

  flap: function() {
    this.speed = -this.jump;
  },

  update: function() {
    this.period = state.current == state.getReady ? 10 : 5;
    this.frame += frames % this.period == 0 ? 1 : 0;
    this.frame = this.frame % this.animation.length;

    if (state.current == state.getReady) {
      this.dY = 150;
    } else {
      this.speed += this.gravity;
      this.dY += this.speed;
      if (this.dY + this.h / 2 >= canvas.height - fg.h) {
        this.dY = canvas.height - fg.h - this.h / 2;
        this.rotation = 90 * DEGREE;
        this.frame = 1;
        if (state.current == state.game) {
          this.speed = 0;
          state.current = state.gameOver;
        }
      }
      //if speed is greater than jump the bird is falling
      if (this.speed >= this.jump) {
        this.rotation = 90 * DEGREE;
        this.frame = 1;
      } else {
        this.rotation = -25 * DEGREE;
      }
    }
  }
};

//pipes object
const pipes = {
  position: [],
  top: {
    sX: 553,
    sY: 0
  },
  bottom: {
    sX: 502,
    sY: 0
  },
  w: 53,
  h: 400,
  maxYPos: -150,
  gap: 95,
  dx: 2,

  reset: function() {
    this.position = [];
  },

  draw: function() {
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      let topYPos = p.dY;
      let bottomYPos = p.dY + this.h + this.gap;
      //top pipe
      ctx.drawImage(
        sprite,
        this.top.sX,
        this.top.sY,
        this.w,
        this.h,
        p.dX,
        topYPos,
        this.w,
        this.h
      );

      //bottom pipe
      ctx.drawImage(
        sprite,
        this.bottom.sX,
        this.bottom.sY,
        this.w,
        this.h,
        p.dX,
        bottomYPos,
        this.w,
        this.h
      );
    }
  },

  update: function() {
    if (state.current !== state.game) return;

    if (frames % 100 == 0) {
      this.position.push({
        dX: canvas.width,
        dY: this.maxYPos * (Math.random() + 1)
      });
    }
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      p.dX -= this.dx;

      let bottomPipeYPos = p.dY + this.h + this.gap;

      //collision detection
      //top pipe
      if (
        bird.dX + bird.radius > p.dX &&
        bird.dX - bird.radius < p.dX + this.w &&
        bird.dY + bird.radius > p.dY &&
        bird.dY - bird.radius < p.dY + this.h
      ) {
        state.current = state.gameOver;
      }

      //bottom pipe
      if (
        bird.dX + bird.radius > p.dX &&
        bird.dX - bird.radius < p.dX + this.w &&
        bird.dY + bird.radius > bottomPipeYPos &&
        bird.dY - bird.radius < bottomPipeYPos + this.h
      ) {
        state.current = state.gameOver;
      }

      if (p.dX + this.w <= 0) {
        this.position.shift();
        score.value += 1;

        score.best = Math.max(score.value, score.best);
        localStorage.setItem("best", score.best);
      }
    }
  }
};

//get ready object
const getReady = {
  sX: 0,
  sy: 228,
  w: 173,
  h: 152,
  dX: canvas.width / 2 - 173 / 2,
  dY: 80,

  draw: function() {
    if (state.current == state.getReady) {
      ctx.drawImage(
        sprite,
        this.sX,
        this.sy,
        this.w,
        this.h,
        this.dX,
        this.dY,
        this.w,
        this.h
      );
    }
  }
};

//game over object
const gameOver = {
  sX: 175,
  sy: 228,
  w: 225,
  h: 202,
  dX: canvas.width / 2 - 225 / 2,
  dY: 90,

  draw: function() {
    if (state.current == state.gameOver) {
      ctx.drawImage(
        sprite,
        this.sX,
        this.sy,
        this.w,
        this.h,
        this.dX,
        this.dY,
        this.w,
        this.h
      );
    }
  }
};

const score = {
  best: parseInt(localStorage.getItem("best")) || 0,
  value: 0,

  reset: function() {
    this.value = 0;
  },
  draw: function() {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";

    if (state.current == state.game) {
      ctx.lineWidth = 3;
      ctx.font = "35px Teko";
      ctx.fillText(this.value, canvas.width / 2, 50);
      ctx.strokeText(this.value, canvas.width / 2, 50);
    } else if (state.current == state.gameOver) {
      ctx.font = "25px Teko";
      ctx.fillText(this.value, 225, 186);
      ctx.strokeText(this.value, 225, 186);
      ctx.fillText(this.best, 225, 228);
      ctx.strokeText(this.best, 225, 228);
    }
  }
};

//game variables
let frames = 0;

//DRAW
function draw() {
  ctx.fillStyle = "skyblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  bg.draw();
  pipes.draw();
  fg.draw();
  bird.draw();
  getReady.draw();
  gameOver.draw();
  score.draw();
}

//UPDATE
function update() {
  bird.update();
  fg.update();
  pipes.update();
}

//LOOP
function loop() {
  update();
  draw();
  frames++;

  requestAnimationFrame(loop);
}

loop();
