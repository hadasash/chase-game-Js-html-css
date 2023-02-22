const ENEMY_IMAGE = new Image();
ENEMY_IMAGE.src = "./images/scarecrow.png";
class Enemy {

    constructor(x, y, size, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
    }
    draw(ctx) {
        ctx.drawImage(ENEMY_IMAGE, this.x, this.y, this.size, this.size);
    }

    update(player) {
        if (this.x < player.x) {
            this.x += this.speed;
        } else if (this.x > player.x) {
            this.x -= this.speed;
        }

        if (this.y < player.y) {
            this.y += this.speed;
        } else if (this.y > player.y) {
            this.y -= this.speed;
        }
    }
}