var canvas = document.getElementById("arena");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

var playerImage = document.getElementById('playerImage');
var botImage = document.getElementById('botImage');

var playerCastImage = document.getElementById('playerCast');
var botCastImage = document.getElementById('botCast');

var cloudImage = document.getElementById('cloudImage');
var cloudImage2 = document.getElementById('cloudImage2');

var fireball = document.getElementById('fireball');
var flame = document.getElementById('flame');
var flamebot = document.getElementById('flamebot');

var frameX = 0;
var frameBotX = 0;

var playerWidth = 200;
var playerHeight = 100;

var playerX = (canvas.width - playerWidth) / 2;
var playerY = canvas.height - playerHeight;

var hp = 100;

var botWidth = 200;
var botHeight = 100;

var botX = (canvas.width - botWidth) / 2;
var botY = 0;

var botCastX = botX + botWidth / 2 - castRadius / 2;
var botCastY = botHeight / 2;

var botHp = 100;

var flameWidth = 50;
var flameHeight = 100;

var isCastBot = false;

var cloudWidth = 400;
var cloudHeight = 200;

var cloudX = canvas.width;
var cloudY = (canvas.height - cloudHeight) / 2 + 45;

var cloud2X = -cloudWidth;
var cloud2Y = (canvas.height - cloudHeight) / 2 - 45;

var cloudDX = 5;

var cloudGoRightCloud2GoLeft = false;
var cloudGoLeftCloud2GoRight = true;

var castX = playerX + playerWidth / 2 - castRadius / 2;
var castY = playerY - castRadius / 2;

var castDY = -14;

var castRadiusDefault = 30;
var castRadiusMaximum = 60;
var castRadius = castRadiusDefault;

var casting = false;
var isCast = false;

var mouseX = canvas.width / 2;

document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("mouseup", mouseUpHandler, false);
document.addEventListener("mousedown", mouseDownHandler, false);

function mouseMoveHandler(e) {
    // x игрока == x мыши
    // var relativeX = e.clientX - canvas.offsetLeft;
    // if(relativeX > 0 && relativeX < canvas.width) {
    //     playerX = relativeX - playerWidth / 2;
    //     if(playerX < 0) playerX = 0;
    //     else if(playerX > canvas.width - playerWidth) playerX = canvas.width - playerWidth;
    // }
    
    mouseX = e.clientX - canvas.offsetLeft;
}

function following() {
    if(playerX < 0) playerX = 0;
    else if(playerX > canvas.width - playerWidth) playerX = canvas.width - playerWidth;
    if(mouseX >= 0 && mouseX < canvas.width) {
        if(playerX + playerWidth / 2 === mouseX) playerX = playerX;
        else if(playerX + playerWidth / 2 > mouseX + 12) playerX -= 12;
        else if(playerX + playerWidth / 2 < mouseX - 12) playerX += 12;
    }
}

function mouseUpHandler(e) {
    isCast = true;
}

function mouseDownHandler(e) {
    if(!isCast) casting = true;
}

function draw() {
    requestAnimationFrame(draw);
    update();
    drawPlayer();
    drawBot();
    bot();
    cast();
    collisionDetection();
    drawClouds();
    movingClouds();
    drawLives();
    isGameOver();
    following();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
    if(isCast && castY > canvas.height - 300) {
        ctx.drawImage(playerCastImage, playerX, playerY, playerWidth, playerHeight);
    } else ctx.drawImage(playerImage, playerX, playerY, playerWidth, playerHeight);
}

function drawCast() {
    ctx.drawImage(fireball, castX, castY, castRadius, castRadius);
}

function drawBot() {
    if(isCastBot && botCastY < 300) {
        ctx.drawImage(botCastImage, botX, botY, botWidth, botHeight);
    } else ctx.drawImage(botImage, botX, botY, botWidth, botHeight);
}

function drawCastBot() {
    ctx.drawImage(fireball, botCastX, botCastY, castRadius, castRadius);
}

function drawClouds() {
    ctx.drawImage(cloudImage, cloudX, cloudY, cloudWidth, cloudHeight);
    ctx.drawImage(cloudImage2, cloud2X, cloud2Y, cloudWidth, cloudHeight);
}

function drawLives() {
    ctx.font = "bold 30px Courier";
    ctx.fillStyle = "#FF6F00";
    ctx.fillText("Your health: " + hp, 10, canvas.height - 10);
    ctx.fillStyle = "#eee";
    ctx.fillText("Bot health: " + botHp, 10, 30);
}

function drawCastFlame() {
    ctx.drawImage(flame, frameX, 0, flameWidth, flameHeight, castX, castY, flameWidth, flameHeight);
    frameX += 50; // Ширина одного кадра
    if(frameX == 300) frameX = 0;
}

function drawBotCastFlame() {
    ctx.drawImage(flamebot, frameBotX, 0, flameWidth, flameHeight, botCastX, botCastY - flameHeight / 2, flameWidth, flameHeight);
    frameBotX += 50; // Ширина одного кадра
    if(frameBotX == 300) frameBotX = 0;
}

function cast() {
    if(casting) {
        castRadius += 0.2;
        if(castRadius >= castRadiusMaximum) castRadius = castRadiusMaximum;
        drawCast();
    } 
    
    if(isCast) {
        drawCast();
        drawCastFlame();
        castY += castDY;
        casting = false;
        if(castY < 0) {
            resetPlayerCastState();
        }
    } else {
        castX = playerX + playerWidth / 2 - castRadius / 2;
        castY = playerY - castRadius / 2;
    }
}

function bot() {
    if(isCast && playerX + playerWidth > botX + botWidth)
        botX -= randomInteger(4, 7);
    
    if(isCast && playerX + playerWidth < botX + botWidth)
        botX += randomInteger(4, 7);

    if(botX >= canvas.width - botWidth)
    botX = (canvas.width - botWidth) / 2 - botWidth / 2;
    else if(botX <= 0) 
    botX = (canvas.width - botWidth) / 2 + botWidth / 2;

    castBot();
}

function castBot() {
    if(castX > botX && castX < botX + botWidth) {
        isCastBot = true;
    }

    if(isCastBot) {
        drawCastBot();
        drawBotCastFlame();
        botCastY -= castDY;
        if(botCastY >= canvas.height) isCastBot = false;
    } else {
        botCastX = botX + botWidth / 2 - castRadius / 2;
        botCastY = botHeight / 2;
    }
}

function movingClouds() {
    if(cloudGoRightCloud2GoLeft) {
        cloudX += cloudDX;
        cloud2X -= cloudDX;
        if(cloudX > (canvas.width * 2) - cloudWidth) {
            cloudGoRightCloud2GoLeft = false;
            cloudGoLeftCloud2GoRight = true;
        }
    } else if(cloudGoLeftCloud2GoRight) {
        cloudX -= cloudDX;
        cloud2X += cloudDX;
        if(cloudX < -canvas.width) {
            cloudGoRightCloud2GoLeft = true;
            cloudGoLeftCloud2GoRight = false;
        }
    }
}

function collisionDetection() {
    // Каст игрока в облако
    if(castX > cloudX && castX < cloudX + cloudWidth) {
        if(castY >= cloudY + (cloudHeight / 2) && castY <= cloudY + cloudHeight) {
            resetPlayerCastState();
        }
    } else if(castX > cloud2X && castX < cloud2X + cloudWidth) {
        if(castY >= cloud2Y + (cloudHeight / 2) && castY <= cloud2Y + cloudHeight) {
            resetPlayerCastState();
        }
    }

    // Каст бота в облако
    if(botCastX > cloudX && botCastX < cloudX + cloudWidth) {
        if(botCastY >= cloudY && botCastY <= cloudY + (cloudHeight / 2)) {
            resetBotCastState();
        }
    } else if(botCastX > cloud2X && botCastX < cloud2X + cloudWidth) {
        if(botCastY >= cloud2Y && botCastY <= cloud2Y + (cloudHeight / 2)) {
            resetBotCastState();
        }
    }

    // Попадание по боту
    if(castX >= botX && castX <= botX + botWidth) {
        if(castY >= botY && castY <= botY + botHeight) {
            if(castRadius != castRadiusMaximum) botHp -= 5;
            else botHp -= 10;
            resetPlayerCastState();
        }
    }

    // Попадание бота по игроку
    if(botCastX > playerX && botCastX < playerX + playerWidth) {
        if(botCastY >= playerY && botCastY <= playerY + playerHeight) {
            if(castRadius != castRadiusMaximum) hp -= 5;
            else hp -= 10;
            resetBotCastState();
        }
    }
}

function resetBotCastState() {
    isCastBot = false;
    botCastX = botX + botWidth / 2 - castRadius / 2;
    botCastY = botHeight / 2;
}

function resetPlayerCastState() {
    isCast = false;
    castRadius = castRadiusDefault;
}

function isGameOver() {
    if(hp <= 0) {
        sendInfo(false);
        var isAgain = confirm('Вы проиграли. Попробовать заново?');
        if(isAgain) document.location.reload();
        else document.location.href = '/profile';
    } else if(botHp <= 0) {
        sendInfo(true);
        var isAgain = confirm('Вы выиграли! Попробовать заново?');
        if(isAgain) document.location.reload();
        else document.location.href = '/profile';
    }
}

function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}

function sendInfo(isWin) {
    $.ajax({
        type: "POST",
        url: '/api/users/win',
        data: JSON.stringify({
            user: (JSON.parse(window.localStorage.getItem('user'))),
            isWin: isWin
            }),
        contentType: 'application/json',
        success: function(user) {
            window.localStorage.setItem('user', JSON.stringify(user));
            console.log(user);
        },
        dataType: 'json'
    });
}

draw();
