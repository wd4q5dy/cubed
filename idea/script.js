let map = []
let pl;

let area = {};

function setup() {
    createCanvas(1200, 700);
    strokeWeight(5);
    stroke(0);

    pl = new Player(0, 0, 50);

    map.push(
        new AABB(-200, -200, 200, 10),
        new AABB(100, -200, 50, 200),
        new AABB(-200, -200, 50, 100),
    )

    area = {
        center: new AABB(-250, -250, 500, 500),
        top:    new AABB(-250,  250, 500, 500),
        bottom: new AABB(-250, -750, 500, 500),
        left:   new AABB(-750, -250, 500, 500),
        right:  new AABB( 250, -250, 500, 500),
    }
}


function draw() {
    background(220);

    const MAX_SPEED = 15;
    const MAX_FALL = 75;

    const SPEED = 5;
    const SPRINT = 15;
    const GROUND_FRICTION = 3;

    const AIR_SPEED = 4;
    const AIR_FRICTION = 1;

    const GRAVITY = -2;
    const JUMP_STRENGTH = 24;

    
    pl.yv += GRAVITY;

    pl.yv -= Math.sign(pl.yv) * Math.max(0, Math.abs(pl.yv) - MAX_FALL)

    const yv_sign = Math.sign(pl.yv);

    for (let i = 0; i < Math.abs(pl.yv); i++) {
        pl.y += yv_sign;

        if (pl.touching(map)) {
            pl.y -= yv_sign;
            pl.yv = 0;

            if ((yv_sign == -1) && keyIsDown(UP_ARROW)) pl.yv = JUMP_STRENGTH;

            break
        }
    }

    pl.y -= 1;
    let on_floor = pl.touching(map);
    pl.y += 1;

    let player_speed = SPEED;
    let friction = GROUND_FRICTION;

    if (on_floor) {
        if (keyIsDown(SHIFT)) player_speed = SPRINT;
        
    } else {
        player_speed = AIR_SPEED;
        friction = AIR_FRICTION;
    }

    if (keyIsDown(LEFT_ARROW)) pl.xv -= player_speed;
    if (keyIsDown(RIGHT_ARROW)) pl.xv += player_speed;

    let abs_xv = Math.abs(pl.xv);

    pl.xv -= Math.sign(pl.xv) * Math.min(abs_xv, friction)
    pl.xv -= Math.sign(pl.xv) * Math.max(0, abs_xv - MAX_SPEED)

    const xv_sign = Math.sign(pl.xv);

    for (let i = 0; i < Math.abs(pl.xv); i++) {
        pl.x += xv_sign;

        if (pl.touching(map)) {
            pl.x -= xv_sign;
            pl.xv = 0;
            
            // pl.yv = Math.max(pl.yv, -2)
            // if ((yv_sign == -1) && keyIsDown(UP_ARROW)) {
            //     pl.xv = xv_sign * -SPEED * 2;
            //     pl.yv = JUMP_STRENGTH * 0.7;
            // }

            break
        }
    }

    if (!pl.collide(area.center)) {
        if (pl.collide(area.bottom)) {
            pl.y += 500;

        } else if (pl.collide(area.top)) {
            pl.y -= 500;

        } else if (pl.collide(area.left)) {
            pl.x += 500;

        } else if (pl.collide(area.right)) {
            pl.x -= 500;
        }
    }

    // if (pl.y < -250 || keyIsDown(82)) {
    //     pl.reset();
    // }

    
    map.forEach((aabb) => aabb.draw())

    pl.draw('red')

    pl.x += 500;
    pl.draw()
    pl.x -= 1000;
    pl.draw()
    pl.x += 500;

    pl.y += 500;
    pl.draw()
    pl.y -= 1000;
    pl.draw()
    pl.y += 500;
}