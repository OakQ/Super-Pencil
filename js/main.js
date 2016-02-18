var game = new Phaser.Game(768, 768, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
    game.load.atlas('dungeonAtlas', 'assets/Sprites/dungeonAtlas.png', 'assets/Sprites/dungeonAtlas.json');
    game.load.audio('hit_1', 'assets/Audio/Hit_1.wav');
    game.load.audio('hit_2', 'assets/Audio/Hit_2.wav');
    game.load.audio('hit_3', 'assets/Audio/Hit_3.wav');
    game.load.audio('hit_4', 'assets/Audio/Hit_4.wav');
    game.load.audio('hit_5', 'assets/Audio/Hit_5.wav');
    game.load.audio('coins', 'assets/Audio/key_pickup.mp3');
    game.load.audio('scream', 'assets/Audio/scream_horror1.mp3');
    game.load.audio('music', 'assets/Audio/William_Hellfire_-_21_-_Poses_-_William_Hellfire.mp3');
}

var spaces;
var walls;
var spookies;
var booties;
var space;
var wall;
var player;
var spooky;
var booty;
var place;
var down;
var up;
var left;
var right;
var yourTurn;
var text;
var scoreText;
var score;
var gameOver;
var wallLocs;
function create() {
    
    music = game.add.audio('music');
    music.loop = true;
    music.play();
    
    gameOver = false; //the game can't end before it starts
    yourTurn = true; //start with the player's turn
    spaces = game.add.group();
    walls = game.add.group(); //doesn't work as intended
    wallLocs = [];
    for (var x = 0; x < 12; x++){
        for (var y = 0; y < 12; y++){
            if (x ==0 || x == 11 || y == 0 || y == 11){
                wall = walls.create(x * 64, y * 64, 'dungeonAtlas', 'wall'); //places walls on the 4 sides
                wallLocs.push()
            }
            else
                space = spaces.create(x * 64, y * 64, 'dungeonAtlas', 'ground'); //spaces in every other space
        }
    }
    player = game.add.sprite(88, 76, 'dungeonAtlas', 'paddle_01');//64 + 24, 64 + 12
    player.animations.add('slide', Phaser.Animation.generateFrameNames('paddle_', 1, 10, '', 2), 10, true); //create the animation of player
    player.animations.play('slide');
    
    spookies = game.add.group();    
    booties = game.add.group();

    for (var x = 1; x < 11; x++){
        for (var y = 1; y < 11; y++){
            place = Math.floor(Math.random() * 25);
            if(place < 2 && x != 1 && y != 1){ //2/25 chance of placing down a ghost
                spooky = spookies.create(x * 64, y * 64, 'dungeonAtlas', 'ghost_1');
                spooky.animations.add('rattle', Phaser.Animation.generateFrameNames('ghost_', 1, 2, '', 1), 2, true);
                spooky.animations.play('rattle');
            }
            else if(place >= 2 && place < 3 && x != 1 && y != 1){ // 1/25 chance of putting down a chest
                booty = booties.create(x * 64, y * 64, 'dungeonAtlas', 'chest_1');
                booty.animations.add('open', Phaser.Animation.generateFrameNames('chest_', 1, 3, '', 1), 1, false);
                booty.animations.killOnComplete = true; //deletes chest when aniamtion finishes. Doesn't work as intended
            }
        }
    }
    down = game.input.keyboard.addKey(Phaser.Keyboard.S); //use WASD instead of arrow keys because we are not casuals
    up = game.input.keyboard.addKey(Phaser.Keyboard.W);
    left = game.input.keyboard.addKey(Phaser.Keyboard.A);
    right = game.input.keyboard.addKey(Phaser.Keyboard.D);
    score = 0;
    scoreText = game.add.text(32, 32, 'Score: 0', { font: "20px Arial", fill: "#000000", align: "center" }); //set score to 0 and set text
}


function update () {
    //call on the different move functions when we hit a button. onDown makes it so it only works once per press
    down.onDown.add(moveDown);
    up.onDown.add(moveUp);
    left.onDown.add(moveLeft);
    right.onDown.add(moveRight);

    hit(); //checks for collsions
}

var playerTween;
var block;
function moveDown(){
    block = false;
    for (var w = 0; w < walls.length; w ++){
        console.log(walls.getChildAt(w).world.y - (player.world.y + 64));
        console.log(walls.getChildAt(w).world.x - player.world.x);
        if (walls.getChildAt(w).world.x - player.world.x >= 24 && walls.getChildAt(w).world.y - (player.world.y + 64) <= -12){
            block = true;
            break;
        }
    }    
    if(yourTurn && !gameOver && !block){ //only works if it is the player's turn and the game isn't over
        playerTween = game.add.tween(player).to( { x: player.world.x, y: player.world.y + 64 }, 1000, "Linear", true); //move the player relative to its location slowly
        score -= 50;
        scoreText.text = 'Score: ' + score;
        playerTween.onComplete.add(enemyTurn);
    }
}

function moveUp(){
    block = false;
    for (var w = 0; w < walls.length; w ++){
        console.log(walls.getChildAt(w).world.y - (player.world.y - 64));
        console.log(walls.getChildAt(w).world.x - player.world.x);
        if (walls.getChildAt(w).world.x - player.world.x <= 24 && walls.getChildAt(w).world.y - (player.world.y - 64) <= 12){
            block = true;
        }
    } 
    if(yourTurn && !gameOver && !block){
        playerTween = game.add.tween(player).to( { x: player.world.x, y: player.world.y - 64 }, 1000, "Linear", true);
        yourTurn = false;
        score -= 50;
        scoreText.text = 'Score: ' + score;
        playerTween.onComplete.add(enemyTurn);
    }
}

function moveLeft(){
    block = false;
    for (var w = 0; w < walls.length; w ++){
        console.log(walls.getChildAt(w).world.y - player.world.y);
        console.log(walls.getChildAt(w).world.x - (player.world.x - 64));
        if (walls.getChildAt(w).world.y - player.world.y >= 12 && walls.getChildAt(w).world.x - (player.world.x - 64) <= 24){
            block = true;
        }
    } 
    if(yourTurn && !gameOver && !block){
        playerTween = game.add.tween(player).to( { x: player.world.x - 64, y: player.world.y }, 1000, "Linear", true);
        yourTurn = false;
        score -= 50;
        scoreText.text = 'Score: ' + score;
        playerTween.onComplete.add(enemyTurn);
    }
}

function moveRight(){
    block = false;
    for (var w = 0; w < walls.length; w ++){
        console.log(walls.getChildAt(w).world.y - player.world.y);
        console.log(walls.getChildAt(w).world.x - (player.world.x + 64));
        if (walls.getChildAt(w).world.y - player.world.y >= 12 && walls.getChildAt(w).world.x - (player.world.x + 64) <= -24){
            block = true;
        }
    } 
    if(yourTurn && !gameOver && !block){
        playerTween = game.add.tween(player).to( { x: player.world.x + 64, y: player.world.y }, 1000, "Linear", true);
        yourTurn = false;
        score -= 50;
        scoreText.text = 'Score: ' + score;
        playerTween.onComplete.add(enemyTurn);
    }    
}

var move;
var enemyTween;
function enemyTurn(){ //the enemy moves randomly for its turn
    for (var i = 0; i < spookies.countLiving(); i++){ //go through and move each ghost
        spooky = spookies.getChildAt(i); //using each ghost
        move = Math.floor(Math.random() * 4);
        if (move == 0) //move ghosts according to rng
            enemyTween = game.add.tween(spooky).to( { x: spooky.world.x, y: spooky.world.y + 64 }, 1000, "Linear", true);
        if (move == 1)
            enemyTween = game.add.tween(spooky).to( { x: spooky.world.x, y: spooky.world.y - 64 }, 1000, "Linear", true);
        if (move == 2)
            enemyTween = game.add.tween(spooky).to( { x: spooky.world.x + 64, y: spooky.world.y }, 1000, "Linear", true);
        if (move == 3)
            enemyTween = game.add.tween(spooky).to( { x: spooky.world.x - 64, y: spooky.world.y }, 1000, "Linear", true);
    }
    enemyTween.onComplete.add(playersTurn); //player can't move until ghosts are done
}

function playersTurn(){
    yourTurn = true; //player's turn
}

var col;
var scream;
var rand; 
function hit(){ //checks for overlapping collisions
    for(var i = 0; i < booties.length; i++){ //for each treasure
        if(checkOverlap(player, booties.getChildAt(i)) && booties.getChildAt(i).alive){ //if we overlap a live one
            score += 1000;
            scoreText.text = 'Score: ' + score; //update score
            booties.getChildAt(i).animations.play('open'); //play animation. Technically doesn't work due to kill command
            booties.getChildAt(i).kill(); //kill chest
            col = game.add.audio('coins');
            col.play();
            checkGameOver(); //when we open a chest, we check to see if there any left
        }
    }  
    for(var i = 0; i < spookies.length; i++){
        if(checkOverlap(player, spookies.getChildAt(i)) && spookies.getChildAt(i).alive){
            score -= 200; //lose point for getting spooked
            scoreText.text = 'Score: ' + score;
            spookies.getChildAt(i).kill(); //kill the spooky
            rand = Math.floor(Math.random() * 5) + 1;//number from 1 to 5
            col = game.add.audio('hit_' + rand); //choose repsective hit sound
            col.play(); //play sound
            scream = game.add.audio('scream');
            scream.allowMultiple = true; //extra spooky
            scream.play(); //i m so spooped rite nao
        }
    }
}

function checkOverlap(spriteA, spriteB) { //check for overlaps between player and objects
        
    var boundsA = spriteA.getBounds(); //get the bounds of their collider
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB); //see if they intersect

}

function checkGameOver(){
    if(booties.countLiving() == 0){ //if no chests remain
        scoreText.text = "THE PADDLE CLAN IS VICTORIOUS! Score: " + score; //display win text
        gameOver = true; //end the game
    }
}