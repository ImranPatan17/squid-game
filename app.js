let pos = { x: 650, y: 480 };
let started = false;
let pressed = false;
let paused = false;
let gover = false;
let gwin = false;
let time = 13000;
let gtime = 0;
let cbtn = false;
let explosion;
let btn, lbtn, rbtn, ubtn, dbtn;
let lprsd = false, rprsd = false, uprsd = false, dprsd = false;

function setup() {
    createCanvas(1380, 640);
    gtime = random(1000, 2000);

    btn = createButton('Start Game');
    btn.position(1000, 15);
    btn.size(100, 30);
    btn.mousePressed(startGame);

    lbtn = createButton('◄');
    lbtn.position(1002, 460);
    lbtn.size(30, 30);

    rbtn = createButton('►');
    rbtn.position(1072, 460);
    rbtn.size(30, 30);

    ubtn = createButton('▲');
    ubtn.position(1037, 425);
    ubtn.size(30, 30);

    dbtn = createButton('▼');
    dbtn.position(1037, 460);
    dbtn.size(30, 30);

    explosion = new ExplosionSystem();
}

function keyPressed(event) {
    event.preventDefault();
    if (keyCode === 32) { // Space bar key code
        restart();
    }
}

function draw() {
    background("lightblue");

    stroke(100);
    strokeWeight(1);
    line(0, 70, 4000, 70);
    line(0, 460, 4000, 460);

    fill("skyblue");
    rect(997, 422, 108, 78, 10);

    fill("#f13345");
    ellipse(650, 35, 45, 60);
    fill(200);
    stroke(0);
    strokeWeight(3);
    ellipse(660, 28, 10, 8);
    ellipse(640, 28, 10, 8);
    ellipse(650, 50, 15, 6);
    fill(0);
    stroke(100);
    strokeWeight(0);
    triangle(650, 34, 640, 41, 658, 41);

    if (paused) {
        fill("#f13345");
        ellipse(650, 35, 45, 60);
    }

    fill(0);
    textSize(20);
    strokeWeight(1);
    text((time / 1000).toFixed(2) + "s", 20, 40);

    if (started) {
        if (!gover && !gwin) {
            btnctrl();

            if ((keyIsDown(LEFT_ARROW) || lprsd) && pos.x > 20) {
                pos.x -= 2;
            }

            if ((keyIsDown(RIGHT_ARROW) || rprsd) && pos.x < 380) {
                pos.x += 2;
            }

            if ((keyIsDown(UP_ARROW) || uprsd) && pos.y > 90) {
                pos.y -= 2;
            }

            if ((keyIsDown(DOWN_ARROW) || dprsd) && pos.y < 480) {
                pos.y += 2;
            }

            if ((keyIsPressed && (
                keyCode === UP_ARROW ||
                keyCode === DOWN_ARROW ||
                keyCode === LEFT_ARROW ||
                keyCode === RIGHT_ARROW
            )) ||
                (lprsd || rprsd || uprsd || dprsd)) {
                pressed = true;
            } else {
                pressed = false;
            }

            if (gtime >= 20) {
                gtime -= 20;
            } else {
                gtime = random(1000, 1500);
                if (paused) {
                    paused = false;
                } else {
                    paused = true;
                }
            }

            if (!paused && pressed) {
                gover = true;
            }

            if (paused) {
                if (time >= 20) {
                    time -= 20;
                } else {
                    gover = true;
                }
            }

            if (pos.y <= 90) {
                gwin = true;
                startConfetti();
            }
        } else if (gover) {
            fill("red");
            textSize(18);
            text("ELIMINATED", 600, 200);
            stopConfetti();
        } else if (gwin) {
            fill("green");
            textSize(18);
            text("YOU WIN", 600, 200);
            startConfetti();
        }
        if (!cbtn) {
            cbtn = true;
            btn.html("Restart Game");
        }
    }

    if (gover) {
        explode();
    } else {
        fill("#fe9a2e");
        ellipse(pos.x, pos.y, 40, 40);
    }
}

function restart() {
    pos = { x: 650, y: 480 };
    started = true;
    pressed = false;
    paused = false;
    gover = false;
    gwin = false;
    time = 13000;
    gtime = 0;
    explosion = new ExplosionSystem();
    lprsd = false;
    rprsd = false;
    uprsd = false;
    dprsd = false;
    stopConfetti();
}

function startGame() {
    started = true;
    restart();
}

function explode() {
    explosion.addParticle(createVector(pos.x, pos.y), 40);
    explosion.run();
}

function btnctrl() {
    lbtn.touchStarted(() => {
        lprsd = true;
    });

    rbtn.touchStarted(() => {
        rprsd = true;
    });

    ubtn.touchStarted(() => {
        uprsd = true;
    });

    dbtn.touchStarted(() => {
        dprsd = true;
    });

    lbtn.touchEnded(() => {
        lprsd = false;
    });

    rbtn.touchEnded(() => {
        rprsd = false;
    });

    ubtn.touchEnded(() => {
        uprsd = false;
    });

    dbtn.touchEnded(() => {
        dprsd = false;
    });
}

let ExplosionParticle = function (position, size) {
    this.angle = random(0, 360);
    this.rsize = size;
    this.pos = position.copy();
    this.acc = random(3, 4);
    this.size = random(this.rsize / 2.5, this.rsize / 1.5);
    this.dist = random(0, 8);

    this.cx = cos(this.angle) * this.dist + this.pos.x;
    this.cy = sin(this.angle) * this.dist + this.pos.y;
    this.pos = createVector(this.cx, this.cy);
    this.pos.add(createVector(random(-(this.rsize / 10), (this.rsize / 10)), random(-(this.rsize / 10), (this.rsize / 10))));
};

ExplosionParticle.prototype.run = function () {
    this.update();
    this.display();
};

ExplosionParticle.prototype.update = function () {
    this.size -= this.acc;
};

ExplosionParticle.prototype.display = function () {
    noStroke();
    fill(random(255), random(255), random(255), random(150, 255));
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
};

ExplosionParticle.prototype.isDead = function () {
    return this.size < 0;
};

let ExplosionSystem = function () {
    this.size = 10;
    this.origin = createVector();
    this.canadd = true;
    this.particles = [];
};

ExplosionSystem.prototype.addParticle = function (origin, size) {
    this.size = size;
    this.origin = origin.copy();
    if (this.canadd == true) {
        for (var i = 0; i <= 50; i++) {
            this.particles.push(new ExplosionParticle(this.origin, this.size));
            if (i == 50) {
                this.canadd = false;
            }
        }
    }
};

ExplosionSystem.prototype.run = function () {
    for (let i = this.particles.length - 1; i >= 0; i--) {
        let p = this.particles[i];
        p.run();
        if (p.isDead()) {
            this.particles.splice(i, 1);
        }
    }
};

let confetti;

function startConfetti() {
    confetti = new ConfettiGenerator({ target: 'confetti-canvas' });
    confetti.render();
}

function stopConfetti() {
    if (confetti) {
        confetti.clear();
    }
}
