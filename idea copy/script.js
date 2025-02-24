let map, map_current;
let faces, face_current;
let pl;

let area = {};

function setup() {
    createCanvas(1200, 700);
    strokeWeight(5);
    stroke(0);

    pl = new Player(0, 0, 50);

    //   4
    // 3 0 1 2
    //   5

    map = [
        [
            new AABB(-250, -250, 500, 125),
            new AABB(-200, -50, 50, 100),
            new AABB(150, -100, 50, 100)
        ],

        [
            new AABB(-200, -135, 400, 10),
            new AABB(-100, 20, 50, 10),
            new AABB(0, 120, 50, 10),
        ],

        [
            new AABB(-200, -135, 400, 10),
        ],

        [
            new AABB(-200, -135, 400, 10),
        ],

        [
            new AABB(-250, -250, 500, 250),
        ],

        [
            new AABB(-250, -250, 500, 500),
        ]
    ]

    faces = [[], [], [], [], [], []]

    map[0].forEach((aabb) => {
        faces[3].push(aabb.shifted(500, 0));
        faces[0].push(aabb.clone());
        faces[1].push(aabb.shifted(-500, 0));
    })

    map[1].forEach((aabb) => {
        faces[0].push(aabb.shifted(500, 0));
        faces[1].push(aabb.clone());
        faces[2].push(aabb.shifted(-500, 0));
    })

    map[2].forEach((aabb) => {
        faces[1].push(aabb.shifted(500, 0));
        faces[2].push(aabb.clone());
        faces[3].push(aabb.shifted(-500, 0));
    })

    map[3].forEach((aabb) => {
        faces[2].push(aabb.shifted(500, 0));
        faces[3].push(aabb.clone());
        faces[0].push(aabb.shifted(-500, 0));
    })

    map[4].forEach((aabb) => {
        faces[0].push(aabb.shifted(0, 500));
        faces[1].push(aabb.rotated(1).shifted(0, 500));
        faces[2].push(aabb.rotated(2).shifted(0, 500));
        faces[3].push(aabb.rotated(3).shifted(0, 500));

        faces[4].push(aabb.clone())
    })

    map[5].forEach((aabb) => {
        faces[0].push(aabb.shifted(0, -500));
        faces[1].push(aabb.rotated(1).shifted(0, -500));
        faces[2].push(aabb.rotated(2).shifted(0, -500));
        faces[3].push(aabb.rotated(3).shifted(0, -500));

        faces[5].push(aabb.clone());
    })

    map_current = faces[0];
    face_current = 0;

    connected = {
        0: {
            up: 4,
            down: 5,
            left: 3,
            right: 1,
        },
        1: {
            up: 4,
            down: 5,
            left: 0,
            right: 2,
        },
        2: {
            up: 4,
            down: 5,
            left: 1,
            right: 3,
        },
        3: {
            up: 4,
            down: 5,
            left: 2,
            right: 0,
        },
        4: {
            up: 2,
            down: 0,
            left: 3,
            right: 1,
        },
        5: {
            up: 0,
            down: 2,
            left: 3,
            right: 1,
        },
    }

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

    const MAX_SPEED = 10;
    const MAX_FALL = 75;

    const SPEED = 3;
    const SPRINT = 8;
    const GROUND_FRICTION = 2;

    const AIR_SPEED = 2;
    const AIR_FRICTION = 1;

    const GRAVITY = -1;
    const JUMP_STRENGTH = 18;

    
    pl.yv += GRAVITY;

    pl.yv -= Math.sign(pl.yv) * Math.max(0, Math.abs(pl.yv) - MAX_FALL)

    const yv_sign = Math.sign(pl.yv);

    for (let i = 0; i < Math.abs(pl.yv); i++) {
        pl.y += yv_sign;

        if (pl.touching(map_current)) {
            pl.y -= yv_sign;
            pl.yv = 0;

            if ((yv_sign == -1) && keyIsDown(UP_ARROW)) pl.yv = JUMP_STRENGTH;

            break
        }
    }

    pl.y -= 1;
    let on_floor = pl.touching(map_current);
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

        if (pl.touching(map_current)) {
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

            face_current = connected[face_current].top;
            map_current = faces[face_current]

        } else if (pl.collide(area.top)) {
            pl.y -= 500;

            face_current = connected[face_current].bottom;
            map_current = faces[face_current]

        } else if (pl.collide(area.left)) {
            pl.x += 500;

            face_current = connected[face_current].left;
            map_current = faces[face_current]

        } else if (pl.collide(area.right)) {
            pl.x -= 500;

            face_current = connected[face_current].right;
            map_current = faces[face_current]
        }
    }

    // if (pl.y < -500 || keyIsDown(82)) {
    //     pl.reset();
    // }

    
    map_current.forEach((aabb) => aabb.draw());

    pl.draw();
}