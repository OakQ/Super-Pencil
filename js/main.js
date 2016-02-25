var game = new Phaser.Game(768, 192, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
    game.load.atlas('spookyAtlas', 'assets/Sprites/spookyAtlas.png', 'assets/Sprites/spookyAtlas.json');
    game.load.image('bg', 'assets/Sprites/background.bmp');
    game.load.audio('win', 'assets/Audio/Chest.wav');
    game.load.audio('turn_wheel', 'assets/Audio/Large_Door_Slam.mp3');
    game.load.audio('music', 'assets/Audio/Knickerbocker_Quartet_-_Good-Night.mp3');
}

//Groups
var grounds;
var walls;
//Wall variables
var wall1;
var wall2;
var wall3;
var wall4;
var wall1Down;
var wall2Down;
var wall3Down;
var wall4Down;
//Sprites
var ground;
var chest;
var spooky;
var wheel1;
var wheel2;
var wheel3;
var wheel4;
var reset;
var bg;
//Sounds
var music;
var turnWheel;
var win;
//Buttons
var activateButton;
var restartButton;
//Checks
var activated;
var gameOver;
var facing;
//Text
var text;

function create() {
    bg = game.add.sprite(0,0, 'bg'); //background
    
    turnWheel = game.add.audio('turn_wheel');//audio
    win = game.add.audio('win');
    music = game.add.audio('music');
    music.loop = true;
    music.play();
    
    gameOver = false; //initialize variables to start the game
    activated = false; //refers to activation of a wheel
    facing = 'right'; //the direction our spooky is facing
    wall1Down = 1; //set WallDown vars to 1 so that later, they will descend
    wall2Down = 1;
    wall3Down = 1;
    wall4Down = 1;
    
    text = game.add.text(32, 32, '-> and <- keys to move, SPACE to activate', { font: "20px Arial", fill: "#ffffff", align: "center" }); //instructions

    spooky = game.add.sprite(64, 96, 'spookyAtlas', 'spooky_right_1'); //start him facing to the right
    spooky.animations.add('right', Phaser.Animation.generateFrameNames('spooky_right_', 1, 2, '', 1), 2, true); //aniamtion of him facing right
    spooky.animations.add('left', Phaser.Animation.generateFrameNames('spooky_left_', 1, 2, '', 1), 2, true); //and left
    spooky.animations.play('right'); //start him facing right
    game.physics.arcade.enable(spooky); // turn on physics
    spooky.body.enable = true; //turn on collisions
    
    chest = game.add.sprite(680, 107, 'spookyAtlas', 'chest_1'); //add in a chest
    chest.animations.add('open', Phaser.Animation.generateFrameNames('chest_', 1, 2, '', 1), 2, false); //animation only plays once

    walls = game.add.group(); //for walls and grounds, we want to enable collisions
    walls.enableBody = true;
    walls.physicsBodyType = Phaser.Physics.ARCADE;
    
    grounds = game.add.group(); 
    grounds.enableBody = true;
    grounds.physicsBodyType = Phaser.Physics.ARCADE;
    
    wheels = game.add.group();
    wheels.enableBody = false; //no collisions for the wheels
    
    for (var x = 0; x < 24; x++){
        for (var y = 0; y < 6; y++){
            if (x ==0 || x == 23 || y == 0 || y == 5){ // ground block around the area
                ground = grounds.create(x * 32, y * 32, 'spookyAtlas', 'ground'); //surround the area wil walls
                ground.scale.setTo(0.5, 0.5); //make them smaller so we have more room to move
                ground.body.immovable = true; //so we don't push them away
            }
        }
    }
    wall1 = walls.create(512, 32, 'spookyAtlas', 'wall'); //create walls where we need them, on the right
    wall2 = walls.create(544, 32, 'spookyAtlas', 'wall');
    wall3 = walls.create(576, 32, 'spookyAtlas', 'wall');
    wall4 = walls.create(608, 32, 'spookyAtlas', 'wall');
    walls.setAll('body.immovable', true); //set so that they can't move

    wheel1 = wheels.create(160, 109, 'spookyAtlas', 'wheel_1'); //put wheels evenly spaced such that the spooky can't trigger two at a time
    wheel2 = wheels.create(256, 109, 'spookyAtlas', 'wheel_1');
    wheel3 = wheels.create(352, 109, 'spookyAtlas', 'wheel_1');
    wheel4 = wheels.create(448, 109, 'spookyAtlas', 'wheel_1');
    wheels.callAll('animations.add', 'animations', 'turn', Phaser.Animation.generateFrameNames('wheel_', 1, 3, '', 1), 3, false); //add same animation to all wheels

    reset = game.add.sprite(64, 109, 'spookyAtlas', 'reset_1'); //add in the reset wheel
    reset.animations.add('turn', Phaser.Animation.generateFrameNames('reset_', 1, 3, '', 1), 3, false); 

    //create two new buttons for gameplay
    activateButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); //SPACE activates a wheel or the chest
    restartButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER); //enter restarts only after winning
}


function update() {
    if(!gameOver){ //if the game isn't over yet
        game.physics.arcade.collide(spooky, walls); //check for collsions between player, walls and the ground
        game.physics.arcade.collide(spooky, grounds);
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            spooky.body.velocity.x = -100; //move left
            if (facing != 'left'){ //if we weren't already facing left
            spooky.animations.play('left'); //start the left animation
            facing = 'left'; //now we're facing left
            }
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){ //same for right
            spooky.body.velocity.x = 100;
            if (facing != 'right'){
            spooky.animations.play('right');
            facing = 'right';
            }
        }
        else{
            spooky.body.velocity.x = 0; //idle
            spooky.body.velocity.y = 0;
        }
        activateButton.onDown.add(Activate); //activates the wheel or the chest he's on
    }
    else
        restartButton.onDown.add(function () { resetGame(false); }); //restarts the game after winning
}

var wallTween;
function Activate(){ //use overlap to see whcih object he's overlapping  
    if(checkOverlap(spooky, wheel1) && !activated){ //1st wheel activates walls 2 and 4       
        moveWalls(false, true, false, true); //(1st wall, 2nd wall, 3rd wall, 4th wall)
        wheel1.animations.play('turn');
    }
    
    if(checkOverlap(spooky, wheel2) && !activated){ //2nd wheel activates walls 2, 3, and 4
        moveWalls(false, true, true, true);
        wheel2.animations.play('turn');
    }
    
    if(checkOverlap(spooky, wheel3) && !activated){ //3rd wheel activates walls 2 and 3
        moveWalls(false, true, true, false);
        wheel3.animations.play('turn');
    }
    
    if(checkOverlap(spooky, wheel4) && !activated){//{ //4th wheel activates walls 1 and 2
        moveWalls(true, true, false, false);
        wheel4.animations.play('turn');
    }
    
    if(checkOverlap(spooky, reset) && !activated)//{ //reset wheel takes any walls still down and raises them back up
        resetGame(true); //resets the walls
    
    if(checkOverlap(spooky, chest)){ //if the chest is activated, player wins
        chest.animations.play('open'); //open the chest for the loot
        gameOver = true; //freezes controls
        win.play(); //plays chest sound
        text.text = 'Ghosts have won the day! ENTER to restart!'; //win text
    }
}

function moveWalls(moveWall1, moveWall2, moveWall3, moveWall4){ //called from Activate to move walls. The walls that have to be moved are determined by params
    wallTween = game.add.tween(ground).to( { x: ground.world.x, y: ground.world.y }, 1000, "Linear", true); //does nothing, ensures that onComplete works properly
    if(moveWall1){ //1st wall
        wallTween = game.add.tween(wall1).to( { x: wall1.world.x, y: wall1.world.y + (128 * wall1Down) }, 1000, "Linear", true); //multiply 128 by wallDown to decide which direction it goes
        wall1Down *= -1; //invert wall1Down so that if this wall is triggered again, it'll go the other way
    }
   if(moveWall2){ //2nd wall
        wallTween = game.add.tween(wall2).to( { x: wall2.world.x, y: wall2.world.y + (128 * wall2Down) }, 1000, "Linear", true);
        wall2Down *= -1;
    }
    if(moveWall3){ //3rd wall
        wallTween = game.add.tween(wall3).to( { x: wall3.world.x, y: wall3.world.y + (128 * wall3Down) }, 1000, "Linear", true);
        wall3Down *= -1;
    }
    if(moveWall4){ //4th wall
        wallTween = game.add.tween(wall4).to( { x: wall4.world.x, y: wall4.world.y + (128 * wall4Down) }, 1000, "Linear", true);
        wall4Down *= -1;
    }
  
    activated = true; //set to be true so that player can't hit more than one switch until the walls are done moving
    turnWheel.play(); //plays the sound
    wallTween.onComplete.add(Reactivate); //sets activated to false once the tween is done
}
function Reactivate(){
    activated = false; //resets activated
}

function resetGame(resetWheelTurned){ //will either reset the walls or reset the entire game based on whther it was activated by the chest or the reset wheel
    wallTween = game.add.tween(ground).to( { x: ground.world.x, y: ground.world.y }, 1000, "Linear", true); //does nothing if all walls were already up
    if(wall1Down == -1){ // if a wall is down
        wallTween = game.add.tween(wall1).to( { x: wall1.world.x, y: wall1.world.y + (128 * wall1Down) }, 1000, "Linear", true); //brings wall back up
        wall1Down = 1; //wall is up
    }
    if(wall2Down == -1){
        wallTween = game.add.tween(wall2).to( { x: wall2.world.x, y: wall2.world.y + (128 * wall2Down) }, 1000, "Linear", true);
        wall2Down = 1;
    }
    if(wall3Down == -1){
        wallTween = game.add.tween(wall3).to( { x: wall3.world.x, y: wall3.world.y + (128 * wall3Down) }, 1000, "Linear", true);
        wall3Down = 1;
    }
    if(wall4Down == -1){
        wallTween = game.add.tween(wall4).to( { x: wall4.world.x, y: wall4.world.y + (128 * wall4Down) }, 1000, "Linear", true);
        wall4Down = 1;
    }

    if(resetWheelTurned){ //if the reset wheel was turned
        reset.animations.play('turn'); //play the animation
        turnWheel.play(); //play the sound
    }
    else{ //if the chest was triggered and the player hit ENTER
        spooky.x = 64; //resets ghost's postion
        chest.frameName = 'chest_1'; //reset chest
        gameOver = false; //reset game
        text.text = '-> and <- keys to move, SPACE to activate'; //reset instructions
    }
    activated = true; //wheel was activated
    wallTween.onComplete.add(Reactivate); //sets activated to false once tween is complete 
}

function checkOverlap(spriteA, spriteB) { //check for overlaps between player and objects
        
    var boundsA = spriteA.getBounds(); //get the bounds of their collider
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB); //see if they intersect

}