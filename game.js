
document.addEventListener("DOMContentLoaded", function () {
    const CANVAS = document.getElementById("canvas");
    const MESSAGE_GAME_OVER = document.getElementById("messageGameOverP");
    const CTX = CANVAS.getContext("2d");
    const BG_SOUND = new Audio("sounds/game-background.mp3");
    const HIT_SOUND = new Audio("sounds/game-over-arcade-6435.mp3");
    const WIN_SOUND = new Audio("sounds/success-fanfare-trumpets-6185.mp3");
    const EGG_SOUND = new Audio("sounds/collectcoin-6075.mp3");
    const BG_IMAGE = new Image();
    BG_IMAGE.src = "images/wallpaper2you_451329.jpg";
    BG_IMAGE.onload = function () {
        CTX.drawImage(BG_IMAGE, 0, 0, CANVAS.width, CANVAS.height);
    };

    let keys;
    let eggs;
    let pause;
    let soundOn;
    let isRunning;
    let requestID;
    let eggsCollected;
    let player;
    let enemy;
    let egg;
    let frameCount;
    init();
    function init() {
        keys = {};
        eggs = [];
        frameCount = 0;
        pause = false;
        soundOn = true;
        isRunning = false;
        requestID;
        eggsCollected = 0;
        player = new Player(20, 20, 45, 9);
        enemy = new Enemy(500, 400, 50, 3);
        egg = new Egg(150, 200, 25, false);
        eggs.push(egg);
    }
    function checkCollision() {
        if (
            player.x < enemy.x + enemy.size &&
            player.x + player.size > enemy.x &&
            player.y < enemy.y + enemy.size &&
            player.y + player.size > enemy.y
        ) {
            HIT_SOUND.play();
            gameOver();
        }
    }

    function generateEgg() {
        const numEggs = 2;
        for (let i = 0; i < numEggs; i++) {
            let newEgg = new Egg(
                Math.floor(Math.random() * (CANVAS.width - egg.size)),
                Math.floor(Math.random() * (CANVAS.height - egg.size)),
                egg.size,
                false
            );
            newEgg.draw(CTX);
            eggs.push(newEgg);
        }
    }



    function gameLoop() {
        if (pause == false) {
            CTX.drawImage(BG_IMAGE, 0, 0, CANVAS.width, CANVAS.height);

            player.draw(CTX);
            enemy.draw(CTX);
            drawEggs();
            player.update(keys);
            checkIfEggCollected();
            checkIfWin();
            enemy.update(player);
            checkCollision();

            if (frameCount % 600 == 0 && eggs.length < 20) {
                generateEgg();
            }
            if (isRunning) {
                requestID = requestAnimationFrame(gameLoop);
            }
            frameCount++;
        }
    }

    function winGame() {
        isRunning = false;
        cancelAnimationFrame(requestID);
        MESSAGE_GAME_OVER.style.display = "block";
        MESSAGE_GAME_OVER.innerHTML ="CONGRATS! <br/> YOU WON!!";
        BG_SOUND.pause();
        eggsCollected = 0;
        egg.isCollected = false;
        player = new Player(20, 20, 45, 9);
        enemy = new Enemy(500, 400, 50, 3);
    }

    function gameOver() {
        isRunning = false;
        BG_SOUND.pause();
        cancelAnimationFrame(requestID);
        MESSAGE_GAME_OVER.style.display = "block";
        MESSAGE_GAME_OVER.innerHTML =`GAME OVER! `;
        eggsCollected = 0;
        egg.isCollected = false;
        player = new Player(20, 20, 45, 9);
        enemy = new Enemy(500, 400, 50, 3);


    }
    function startGame() {
        MESSAGE_GAME_OVER.style.display = "none";
        isRunning = true;
        BG_SOUND.play();
        gameLoop();
    }

    function checkIfEggCollected() {
        eggs.forEach(egg => {
            if (
                player.x < egg.x + egg.size &&
                player.x + player.size > egg.x &&
                player.y < egg.y + egg.size &&
                player.y + player.size > egg.y &&
                !egg.isCollected
            ) {
                egg.isCollected = true;
                EGG_SOUND.play();
                eggsCollected++;
                player.size += 4;
                document.getElementById("egg-collected").textContent = eggsCollected;
            }

        });
    }
    function checkIfWin() {
        if (eggsCollected >= 3) {
            WIN_SOUND.play();
            winGame();
        }
    }
    function drawEggs() {
        eggs.forEach(egg => {
            if (!egg.isCollected) {
                egg.draw(CTX);
            }
        });
    }
    document.addEventListener("keydown", function (event) {
        keys[event.key] = true;
    });
    document.addEventListener("keyup", function (event) {
        delete keys[event.key];
    });


    document.getElementById("start-button").addEventListener("click", function () {
        if (pause == false) {
            eggsCollected = 0;
            egg.isCollected = false;
            startGame();
        }
        else {
            pause = !pause
            startGame();
        }
    });
    document.getElementById("stop-button").addEventListener("click", function () {
        pause = !pause
    });

    document.getElementById("sound-button").addEventListener("click", function () {

        if (soundOn) {
            soundOn = false;
            BG_SOUND.pause();
        } else {
            soundOn = true;
            BG_SOUND.play();
        }
    });

});
