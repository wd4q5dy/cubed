class AABB {
    constructor(x, y, w, h, color = 'white') {
        this.x = x,
        this.y = y,
        this.w = w,
        this.h = h;

        this.color = color;
    }

    collide(other) {
        return (
            this.x + this.w > other.x &&
            this.x < other.x + other.w &&
            this.y + this.h > other.y &&
            this.y < other.y + other.h
        )
    }

    draw(color = this.color) {
        push();

        translate(width/2, height/2);
        scale(1, -1);

        fill(color);
        rect(this.x, this.y, this.w, this.h)

        pop();
    }
}

class Player {
    constructor(x, y, size, color = 'yellow') {
        this.x = x;
        this.y = y;
        this.xv = 0;
        this.yv = 0;
        this.size = size;
        this.color = color;
    }

    getAABB() {
        return new AABB(
            this.x - this.size/2,
            this.y - this.size/2,
            this.size,
            this.size,
            this.color
        )
    }

    collide(aabb) {
        return this.getAABB().collide(aabb);
    }

    touching(map) {
        const this_AABB = this.getAABB();

        for (let i = 0; i < map.length; i++) {
            let aabb = map[i];

            if (this_AABB.collide(aabb)) return true;
        }

        return false;
    }

    draw(color = this.color) {
        this.getAABB().draw(color);
    }

    debug(map) {
        const this_AABB = this.getAABB();

        for (let i = 0; i < map.length; i++) {
            let aabb = map[i];

            if (this_AABB.collide(aabb)) {
                aabb.draw(color(255, 0, 0));
            }
        }
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.xv = 0;
        this.yv = -5;
    }
}