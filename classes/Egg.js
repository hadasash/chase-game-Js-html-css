const EGG_IMAGE = new Image();
EGG_IMAGE.src = "./images/chicken.png";

class Egg {

    constructor(x, y, size, iCollected) {  
        this.x = x;
        this.y = y;
        this.size = size;
        this.iCollected = iCollected;
    }
    draw(ctx) {
        ctx.drawImage(EGG_IMAGE, this.x, this.y, this.size, this.size);
    }
}
