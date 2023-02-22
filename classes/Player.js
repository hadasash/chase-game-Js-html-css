
const PLAYER_IMAGE = new Image();
PLAYER_IMAGE.src = "./images/bird (2).png";
class Player {

    constructor(x, y, size, speed) {  // Ctr
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
    }
    draw(ctx) {
        ctx.drawImage(PLAYER_IMAGE, this.x, this.y, this.size, this.size);
    }

    update(keys) {
        if (keys.ArrowUp && this.y > 0) {
            this.y -= this.speed;
        }
        if (keys.ArrowDown && this.y < canvas.height - this.size) {
            this.y += this.speed;
        }
        if (keys.ArrowLeft && this.x > 0) {
            this.x -= this.speed;
        }
        if (keys.ArrowRight && this.x < canvas.width - this.size) {
            this.x += this.speed;
        }


    }
}