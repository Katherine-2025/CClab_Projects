let shiftDay = false;
function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent("myContainer");
  //background(0, 0, 50);
  setupSky();
}

function draw() {
  if (shiftDay == false) { //at night
    background(0, 0, 50, 10); // (R, G, B, A:10)
  } else {
    background(255, 255, 255);
  }

  if (shiftDay == false) { //at night
    drawSky();
  }
  let freq, amp;

  freq = frameCount * 0.02;
  amp = 100;
  let cosValueX = cos(freq) * amp;
  //
  let sinValueY = sin(freq) * amp / 2;

  let x1 = width / 2 + cosValueX; // ***
  let y1 = height / 4 + sinValueY; // ***
  let dia1 = 80;
  if (shiftDay == false) { //at night
    fill(255, 255, 150);
  } else {
    fill(255, 0, 0);
  }
  circle(x1, y1, dia1);

  for (let x = 0; x < width; x++) {
    freq = x * 0.015 + frameCount * 0.01; // pos * adj + time * adj
    amp = map(mouseY, 0, width, 100, 10);  // ***
    let sinValue = sin(freq) * amp;

    //let x2 = frameCount;
    let y2 = 300 + sinValue;  // ***

    stroke(0, random(200, 255), 255);
    line(x, y2 + random(-2, 2), x, height);
  }
}


let posX, posY, dia;
let aSpeed, sSpeed;
let r, g, b;

let rRange1 = 255;
let rRange2 = 255;
let gRange1 = 158;
let gRange2 = 191;
let bRange1 = 52;
let bRange2 = 70;

function setupSky() {
  posX = 0;
  posY = 0;
  dia = random(20, 40);
  posXSpeed = 2;
  posYSpeed = 1;

  r = 255;
  g = 255;
  b = 255;
}

function drawSky() {
  //background(220);

  // move
  posX = posX + posXSpeed;
  posY = posY + posYSpeed;

  // bounce
  if (posX < 0 || posX > width) {
    posXSpeed = posXSpeed * -1;
    dia = random(10, 30);
  }
  if (posY < 0 || posY > height / 2) {
    posYSpeed = posYSpeed * -1;
    dia = random(10, 30);
  }


  posX = random(width);
  posY = random(height / 2);

  let r = map(posX, 0, width, rRange1, rRange2);
  let g = map(posY, 0, height, gRange1, gRange2);
  let b = map(posX, 0, width, bRange1, bRange2);

  // display

  noStroke();
  fill(r + random(-5, 5), g + random(-5, 5), b + random(-5, 5));
  circle(posX, posY, dia + random(1, 5));
  circle(posX + random(-100, 100), posY + random(-100, 100), dia + random(1, 5));
}

function keyPressed() {

  if (key == "d") {
    shiftDay = true;
  }
  if (key == "b") {
    shiftDay = false;

  }
}