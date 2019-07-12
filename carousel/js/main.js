const INTERVAL = 2000;
const carousel = document.getElementById("slider-con");
const con = document.getElementById("wrapper");
const items = document.getElementsByTagName("img");
const total = items.length;
con.style.width = 640 * total + "px";
con.style.marginLeft = 0;
let i = 0;

let leftArrow = document.createElement("div");
let rightArrow = document.createElement("div");

function arrowDivSetter(division, leftPos) {
  carousel.appendChild(division);
  division.style.position = "absolute";
  division.style.backgroundColor = "grey";
  division.style.top = 200 + "px";
  division.style.left = leftPos + "px";
  division.zIndex = "5";
}

arrowDivSetter(leftArrow, 8);
arrowDivSetter(rightArrow, 623);

let leftClick = document.createElement("img");
let rightClick = document.createElement("img");

function loadArrow(click, division, src) {
  click.setAttribute("src", src);
  click.setAttribute("height", "35");
  click.setAttribute("width", "25");
  click.setAttribute("alt", "arrow");
  division.appendChild(click);
}

const src1 = "./images/left-arrow.png";
const src2 = "./images/right-arrow.png";

loadArrow(leftClick, leftArrow, src1);
loadArrow(rightClick, rightArrow, src2);

let bulletDiv = document.createElement("div");
carousel.appendChild(bulletDiv);
bulletDiv.style.position = "absolute";
bulletDiv.style.zIndex = "5";
bulletDiv.style.top = 400 + "px";
bulletDiv.style.left = 300 + "px";

let bulletArray = [];

function bulletPoints() {
  let bullet = document.createElement("button");
  bullet.style.height = 10 + "px";
  bullet.style.width = 10 + "px";
  bullet.style.marginRight = 3 + "px";
  bullet.style.borderRadius = "50%";
  bulletDiv.appendChild(bullet);
  bulletArray.push(bullet);
  return bullet;
}

bullet1 = bulletPoints();
bullet2 = bulletPoints();
bullet3 = bulletPoints();
bullet4 = bulletPoints();

let imageChanger;

leftClick.onclick = () => {
  if (i != 0) {
    clearInterval(imageChanger);
    bulletArray[i].style.backgroundColor = "lightgrey";
    bulletArray[i - 1].style.backgroundColor = "black";
    animate(i, i - 1);
    i = i - 1;
  }
};

rightClick.onclick = () => {
  if (i != 3) {
    clearInterval(imageChanger);
    bulletArray[i].style.backgroundColor = "lightgrey";
    bulletArray[i + 1].style.backgroundColor = "black";
    animate(i, i + 1);
    i = i + 1;
  }
};

function init() {
  bulletArray[0].style.backgroundColor = "black";
  slide();
}

function slide() {
  imageChanger = setInterval(() => {
    index = i % 4;
    nextIndex = (i + 1) % 4;
    clearInterval(imageChanger);
    animate(index, nextIndex);
    i = nextIndex;
  }, INTERVAL);
}

function animate(index, nextIndex) {
  bulletArray[index].style.backgroundColor = "lightgrey";
  bulletArray[nextIndex].style.backgroundColor = "black";
  let animation = setInterval(() => {
    con.style.marginLeft =
      parseInt(con.style.marginLeft) - ((nextIndex - index) * 640) / 200 + "px";
    if (index < nextIndex) {
      if (parseInt(con.style.marginLeft) <= -(nextIndex * 640)) {
        clearInterval(animation);
        slide();
      }
    } else if (index > nextIndex) {
      if (parseInt(con.style.marginLeft) >= -(nextIndex * 640)) {
        clearInterval(animation);
        slide();
      }
    }
  }, 1);
}

init();
