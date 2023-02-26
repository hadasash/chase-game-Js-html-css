const POWER_IMAGE = new Image();
POWER_IMAGE.src = "./images/coin.png";

class PowerCoin {

    constructor(x, y, size, isCollected) {  
        this.x = x;
        this.y = y;
        this.size = size;
        this.isCollected = isCollected;
    }
    draw(ctx) {
        ctx.drawImage(POWER_IMAGE, this.x, this.y, this.size, this.size);
    }
}
