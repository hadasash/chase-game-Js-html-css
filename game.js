
document.addEventListener("DOMContentLoaded", function () {
    const CANVAS = document.getElementById("canvas");
    const MESSAGE_GAME_OVER = document.getElementById("messageGameOverP");
    const SOUND_BUTTON = document.getElementById("sound-button");

    const SOUND_IMAGE = SOUND_BUTTON.querySelector("img");
        const prevHighScore = parseInt(localStorage.getItem("highScore")) || 0;

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
    let powerCoins;
    let pause;
    let soundOn;
    let isRunning;
    let requestID;
    let eggsCollected;
    let player;
    let enemy;
    let egg;
    let powerCoin;
    let frameCount;
    let originalEnemySpeed;

    init();
    function init() {
        keys = {};
        eggs = [];
        powerCoins = [];
        frameCount = 0;
        pause = false;
        soundOn = true;
        isRunning = false;
        requestID;
        eggsCollected = 0;
        player = new Player(20, 20, 45, 9);
        enemy = new Enemy(500, 400, 50, 3);
        egg = new Egg(150, 200, 40, false);
        powerCoin = new PowerCoin(300, 600, 38, false);

        eggs.push(egg);
    }

    function gameLoop() {
        if (pause == false) {
            CTX.drawImage(BG_IMAGE, 0, 0, CANVAS.width, CANVAS.height);

            player.draw(CTX);
            enemy.draw(CTX);
            drawEggs();
            drawPowerCoins();
            drawHighscore();
            player.update(keys);
            checkIfEggCollected();
            checkIfCoinCollected();
            enemy.update(player);
            checkCollision();

            if (frameCount % 500 == 0 && eggs.length < 100) {
                generateEgg();
            }

            if (frameCount % 1000 == 0 && powerCoins.length < 100) {
                generatePowerCoin();
            }
            if (isRunning) {
                requestID = requestAnimationFrame(gameLoop);
            }
            frameCount++;
        }
    }


    function startGame() {
        MESSAGE_GAME_OVER.style.display = "none";
        isRunning = true;
        BG_SOUND.play();
        gameLoop();
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

    function generatePowerCoin() {
        
            let newCoin = new PowerCoin(
                Math.floor(Math.random() * (CANVAS.width - powerCoin.size)),
                Math.floor(Math.random() * (CANVAS.height - powerCoin.size)),
                powerCoin.size,
                false
            );
            newCoin.draw(CTX);
            powerCoins.push(newCoin);
        
    }

   
    function gameOver() {
        isRunning = false;
        BG_SOUND.pause();
        cancelAnimationFrame(requestID);
        updateLocalStorage(eggsCollected)
        eggsCollected = 0;
        egg.isCollected = false;
        player = new Player(20, 20, 45, 9);
        enemy = new Enemy(500, 400, 50, 3);
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
                player.size += 3;
                enemy.speed += 1;
                player.speed += 2;

                document.getElementById("egg-collected").textContent = eggsCollected;
            }

        });
    }

    function checkIfCoinCollected() {
       powerCoins.forEach(coin => {
            if (
                player.x < coin.x + coin.size &&
                player.x + player.size > coin.x &&
                player.y < coin.y + coin.size &&
                player.y + player.size > coin.y &&
                !coin.isCollected
            ) {
                coin.isCollected = true;
                EGG_SOUND.play();
                player.size += 2;
                originalEnemySpeed = enemy.speed;
                enemy.speed = 1;
                setTimeout(() => {
                    enemy.speed = originalEnemySpeed;
                }, 5000);
            }

        });
    }

    function drawEggs() {
        eggs.forEach(egg => {
            if (!egg.isCollected) {
                egg.draw(CTX);
            }
        });
    }

    function drawPowerCoins() {
        powerCoins.forEach(coin => {
            if (!coin.isCollected) {
                coin.draw(CTX);
            }
        });
    }

    function drawHighscore() {
        CTX.fillStyle = "white";
        CTX.font = "20px Arial";
        CTX.fillText("High score: " + prevHighScore, 10, 30);
    }
    
    function updateLocalStorage(score) {
      
        if (score > prevHighScore) {
          localStorage.setItem("highScore", score);
          WIN_SOUND.play();
          MESSAGE_GAME_OVER.style.display = "block";
          MESSAGE_GAME_OVER.innerHTML =`CONGRATS!<br/>Your new high score is ${score}!!`;
        }
    
        else {
            MESSAGE_GAME_OVER.style.display = "block";
            MESSAGE_GAME_OVER.innerHTML =`GAME OVER! `;
        }
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
            document.getElementById("egg-collected").textContent = eggsCollected;

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


SOUND_BUTTON.addEventListener("click", function () {
    if (soundOn) {
        soundOn = false;
        BG_SOUND.pause();
        SOUND_IMAGE.setAttribute("src", "images/no-sound.png"); 
    } else {
        soundOn = true;
        BG_SOUND.play();
        SOUND_IMAGE.setAttribute("src", "images/sound.png"); 
    }
});



});

