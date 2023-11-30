let btn = false;
let v = 1;
let scene = 1;
let button1, button2;

let img;
let clr;
let pg1;

let points = [];
let music, music2, music3;
let fft;

let offset = 0;
let lineColor;
let bgImg;

let points2 = [];
let bgImg3;


function preload() {
  img = loadImage("assets/scene1.jpg");
  music = loadSound("assets/overwhelm.m4a");
  music2 = loadSound("assets/calm.m4a");
  music3 = loadSound("assets/dreamcore2.m4a");
  bgImg = loadImage("assets/bg1.jpg", () => {
    bgImg.resize(600, 600);
  });
}

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent("p5-container");
  background(255);
  scene1Setup();
  scene2Setup();
  scene3Setup();
}

function scene1Setup() {
  img.resize(width, height);
  clr = color(255);
  pg1 = createGraphics(width, height);
  pg1.background(255);
}
function scene2Setup() {
  fft = new p5.FFT(0.3);
  music.setVolume(0.1);
  music2.setVolume(0.1);
  lineColor = color(255);
}

function scene3Setup() {
  bgImg3 = loadImage('assets/scene3.jpg', () => {
    bgImg3.resize(600, 600);
  })
}

function draw() {
  if (scene == 1) {
    push();
    translate(width / 2, height / 2);
    scale(v);
    drawScene1();
    pop();
    push();
    textSize(20);
    textAlign(CENTER);
    fill(255);
    stroke(240);
    strokeWeight(4);
    text("When we all fall asleep,where do we go?", width / 2, 350);
    pop();

  } else if (scene == 2) {
    background(255);
    image(bgImg, 0, 0);
    push();
    translate(width / 2, height / 2);
    scale(v);
    drawScene2();
    pop();
  } else if (scene == 3) {
    drawScene3();
  }
  //zoom in
  if (btn) {
    if (scene == 1 || scene == 2) {
      if (v >= 10) {
        scene++;
        v = 1;

        if (scene == 2) {
          initScene();
        } else if (scene == 3) {
          music.stop();
          music2.stop();
          music3.loop();
          button1.hide();
          button2.hide();
        }

        btn = false;
      } else {
        v += 0.1;
      }
    }

    // console.log(v);
  }
}

function initScene() {
  button1 = createButton("calm");
  button1.parent('p5-container')
  button1.position(16, 76);
  button1.mousePressed(() => {
    music2.loop();
    music.stop();
    offset = 1;
    lineColor = color(25, 25, 255);
  });
  button2 = createButton("overwhelm");
  button2.parent('p5-container')
  button2.position(66, 76);
  button2.mousePressed(() => {
    music.loop();
    music2.stop();
    offset = 4;
    lineColor = color(255, 25, 0);
  });
}

function drawScene3() {

  background(220);
  image(bgImg3, 0, 0)

  stroke(0);
  strokeWeight(3);
  noFill();
  beginShape();
  for (let i = 0; i < points2.length; i++) {
    let p = points2[i];
    p.move();
    vertex(p.x, p.y);
  }
  endShape();
}

function drawScene2() {
  push();
  translate(-width / 2, -height / 2);
  if (music.isPlaying() || music2.isPlaying()) {
    fft.analyze();
    let amp1 = fft.getEnergy(20, 200);
    // 100 ~ 200
    let sw = map(amp1, 100, 180, 8, 15);
    strokeWeight(sw);
  }

  noFill();
  stroke(lineColor);
  beginShape();
  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    vertex(p.getX(), p.getY());
    // rect(p.x, p.y, 10, 10);
  }
  endShape();

  ellipse(mouseX, mouseY, 10, 10);
  pop();
}

function drawScene1() {
  push();
  translate(-width / 2, -height / 2);
  for (let i = 0; i < 50; i++) {
    let x = floor(random(width));
    let y = floor(random(height));
    let dia = random(3, 10);
    // extract a pixel value
    clr = img.get(x, y);

    pg1.noStroke();
    pg1.fill(clr);
    pg1.circle(x, y, dia);
  }
  image(pg1, 0, 0);
  pop();
}

function keyPressed() {
  if (key == " ") {
    btn = true;
    music.stop();
    if (scene == 3) {
      window.location.reload()
    }
  }
}

function mouseDragged() {
  if (scene == 2) {
    points.push(new KPoint(mouseX, mouseY));
  } else if (scene == 3) {
    let p = new KPoint2(mouseX, mouseY);
    points2.push(p);
  }
}

class KPoint {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
  }

  getX() {
    return this.x + random(-offset, offset);
  }

  getY() {
    return this.y + random(-offset, offset);
  }
}

class KPoint2 {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.xSpeed = random(-0.5, 0.5);;
    this.ySpeed = random(-0.5, 0.5);
  }
  // actions
  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
}