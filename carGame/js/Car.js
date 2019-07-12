function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export default class Car {
  constructor(isPlayer) {
    this.y = 0;
    this.lane = 0;
    this.isPlayer = isPlayer;
    this.width = 50;
    this.height = 50;
    this.init();
  }

  init() {
    if (this.isPlayer) {
      this.lane = 1;
      this.y = 600 - this.height - 10;
    } else {
      this.lane = getRandomInt(0, 3);
      this.y = -80;
    }
    this.x = this.lane * 130 + 40;
  }

  changeLane(lane) {
    this.lane = lane;
    this.x = this.lane * 130 + 40;
  }

  checkCollision(car) {
    if (car.y + car.width >= this.y) {
      return true;
    } else {
      return false;
    }
  }
}
