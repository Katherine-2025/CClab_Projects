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

let cols, rows;
let scl = 20;
let zoff = 0;
let particles = [];
let flowfield;
let pg;

function preload() {
  img = loadImage("assets/scene1.jpg");
  music = loadSound("assets/overwhelm.m4a");
  music2 = loadSound("assets/calm.m4a");
  music3 = loadSound("assets/calm.m4a");
  bgImg = loadImage("assets/bg1.jpg", () => {
    bgImg.resize(400, 400);
  });
}

function setup() {
  createCanvas(400, 400);

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
  cols = floor(width / scl);
  rows = floor(height / scl);

  flowfield = new Array(cols * rows);

  for (let i = 0; i < 1000; i++) {
    particles[i] = new Particle();
  }

  pg = createGraphics(width, height);
  pg.background(255, 0);
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
    text("When we all fall asleep,where do we go?", width / 2, 270);
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
  button1.position(16, 16);
  button1.mousePressed(() => {
    music2.loop();
    music.stop();
    offset = 1;
    lineColor = color(25, 25, 255);
  });
  button2 = createButton("overwhelm");
  button2.position(66, 16);
  button2.mousePressed(() => {
    music.loop();
    music2.stop();
    offset = 4;
    lineColor = color(255, 25, 0);
  });
}

function drawScene3() {
  background(0, 0, 255);

  if (frameCount % 10 == 0) {
    let yoff = 0;
    for (let y = 0; y < rows; y++) {
      let xoff = 0;
      for (let x = 0; x < cols; x++) {
        let index = x + y * cols;
        let angle = noise(xoff, yoff, zoff) * TWO_PI * 2;
        let v = p5.Vector.fromAngle(angle);
        v.setMag(1);
        flowfield[index] = v;
        xoff += 0.1;
      }
      yoff += 0.1;
    }
    zoff += 0.01;
  }

  for (let i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
  }

  image(pg, 0, 0);
}

function drawScene2() {
  push();
  translate(-width / 2, -height / 2);
  if (music.isPlaying() || music2.isPlaying()) {
    fft.analyze();
    let amp1 = fft.getEnergy(20, 200);
    // 100 ~ 200
    let sw = map(amp1, 100, 180, 5, 10);
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

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector();
    this.acc = createVector();
    this.maxspeed = 0.1;

    this.color = color(135, 206, 250);
  }

  follow(flowfield) {
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);
    let index = x + y * cols;
    let force = flowfield[index];
    this.applyForce(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  edges() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  show() {
    let d = dist(this.pos.x, this.pos.y, mouseX, mouseY);
    if (d < 50) {
      this.color = color(173, 216, 230, 5);
    } else {
      this.color = color(255, 255, 255, 5);
    }
    pg.strokeWeight(2);

    if (random(1) < 0.01) {
      pg.stroke(255, 255, 255, 200);
      pg.strokeWeight(1);
    } else {
      pg.stroke(this.color);
    }
    pg.ellipse(this.pos.x, this.pos.y, 2, 2);
  }
}
