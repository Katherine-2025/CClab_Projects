let particles = []; // empty array
function setup() {
    let canvas = createCanvas(400, 400);
    canvas.parent("myContainer");
}

function draw() {
    background(200, 100, 100);
    drawCastle(100, 200, 200, 150);
}

function drawCastle(x, y, width, height) {
    // Draw main base
    fill("#f9c20d"); // Yellow color
    rect(x, y, width, height);

    // Draw top towers
    fill("#d01622"); // Red color
    rect(x, y - height / 2, width / 3, height / 2);
    rect(x + width - width / 3, y - height / 2, width / 3, height / 2);

    // Draw the roof
    fill("#783b17"); // Brown color
    triangle(100, 125, 300, 125, 200, 50)

    // Draw windows
    fill("#12a4d9"); // Blue color
    rect(x + width / 6, y + height / 6, width / 6, height / 4);
    rect(x + width - width / 6 - width / 6, y + height / 6, width / 6, height / 4);
    //draw the chimney
    fill(220);
    quad(300, 125, 275, 106.25, 275, 50, 300, 50);
    // generate
    particles.push(new Particle(width * 3 / 2, height / 3, random(10, 30)));


    // update and display
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.move();
        p.checkEdges();
        p.display();
    }

    // limit the number of the particles
    while (particles.length > 100) {
        particles.splice(0, 1); // (firstIndex, oneItem);
    }

    noStroke();
    fill(0, 0, 255);
    text(particles.length, 10, 20);
}

class Particle {
    // very special constructor function!
    constructor(startX, startY, startDia) {
        // properties (variables)
        this.x = startX;
        this.y = startY;
        this.xSpeed = random(-3, 3);
        this.ySpeed = random(-3, 3);
        this.dia = startDia;
        this.isDone = false;
    }
    // methods (functions)
    move() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }
    checkEdges() {
        if (this.x < 0 || this.x > width) {
            this.isDone = true;
        }
        if (this.y < 0 || this.y > height) {
            this.isDone = true;
        }
    }
    display() {

        push();
        noStroke();
        fill(random(255), random(255), random(255));
        if (this.isDone) {
            fill(255);
        }
        circle(this.x, this.y, this.dia);
        pop();
    }
}
