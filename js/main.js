var game = new Phaser.Game(768, 192, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
    game.load.atlas('spookyAtlas', 'assets/Sprites/spookyAtlas.png', 'assets/Sprites/spookyAtlas.json');
    game.load.image('bg', 'assets/Sprites/background.bmp');
    game.load.audio('win', 'assets/Audio/Chest.wav');
    game.load.audio('turn_wheel', 'assets/Audio/Large_Door_Slam.mp3');
    game.load.audio('music', 'assets/Audio/Knickerbocker_Quartet_-_Good-Night.mp3');
}

var player;
var grounds;
var walls;

var wall1;
var wall2;
var wall3;
var wall4;
var wall1Down;
var wall2Down;
var wall3Down;
var wall4Down;

var ground;
var chest;
var spooky;
var wheel1;
var wheel2;
var wheel3;
var wheel4;
var reset;
var bg;

var music;
var turnWheel;
var win;

var activateButton;
var restartButton;
var activated;
var gameOver;
var text;
var facing;

function create() {
    bg = game.add.sprite(0,0, 'bg'); //background
    
    turnWheel = game.add.audio('turn_wheel');//audio
    win = game.add.audio('win');
    music = game.add.audio('music');
    music.loop = true;
    music.play();
    
    gameOver = false; //initialize variables to start the game
    activated = false;
    facing = 'right';
    wall1Down = 1; //set WallDown vars to 1 so that later, they will descend
    wall2Down = 1;
    wall3Down = 1;
    wall4Down = 1;
    
    text = game.add.text(32, 32, '-> and <- keys to move, SPACE to activate', { font: "20px Arial", fill: "#ffffff", align: "center" }); //instructions

    spooky = game.add.sprite(64, 96, 'spookyAtlas', 'spooky_right_1'); //start him facing to the right
    spooky.animations.add('right', Phaser.Animation.generateFrameNames('spooky_right_', 1, 2, '', 1), 2, true); //aniamtion of him facing right
    spooky.animations.add('left', Phaser.Animation.generateFrameNames('spooky_left_', 1, 2, '', 1), 2, true); //and left
    spooky.animations.play('right'); //start him facing right
    game.physics.arcade.enable(spooky);
    spooky.body.enable = true;
    //680
    chest = game.add.sprite(120, 107, 'spookyAtlas', 'chest_1');
    chest.animations.add('open', Phaser.Animation.generateFrameNames('chest_', 1, 2, '', 1), 2, false);

    walls = game.add.group();
    walls.enableBody = true;
    walls.physicsBodyType = Phaser.Physics.ARCADE;
    
    grounds = game.add.group(); 
    grounds.enableBody = true;
    grounds.physicsBodyType = Phaser.Physics.ARCADE;
    
    wheels = game.add.group();
    wheels.enableBody = false;
    
    for (var x = 0; x < 24; x++){
        for (var y = 0; y < 6; y++){
            if (x ==0 || x == 23 || y == 0 || y == 5){
                ground = grounds.create(x * 32, y * 32, 'spookyAtlas', 'ground'); //surround the area wil walls
                ground.scale.setTo(0.5, 0.5); //make them smaller so we have more room to move
                ground.body.immovable = true; //so we don't push them away
            }
        }
    }
    wall1 = walls.create(512, 80, 'spookyAtlas', 'wall');   
    wall2 = walls.create(544, 80, 'spookyAtlas', 'wall');
    wall3 = walls.create(576, 80, 'spookyAtlas', 'wall');
    wall4 = walls.create(608, 80, 'spookyAtlas', 'wall');
    walls.setAll('body.immovable', true);

    wheel1 = wheels.create(160, 109, 'spookyAtlas', 'wheel_1');
    wheel2 = wheels.create(256, 109, 'spookyAtlas', 'wheel_1');
    wheel3 = wheels.create(352, 109, 'spookyAtlas', 'wheel_1');
    wheel4 = wheels.create(448, 109, 'spookyAtlas', 'wheel_1');
    wheels.callAll('animations.add', 'animations', 'turn', Phaser.Animation.generateFrameNames('wheel_', 1, 3, '', 1), 3, false);


    reset = game.add.sprite(64, 109, 'spookyAtlas', 'reset_1');
    reset.animations.add('turn', Phaser.Animation.generateFrameNames('reset_', 1, 3, '', 1), 3, false);

    //create two new buttons for gameplay
    activateButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    restartButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
}


function update() {
    if(!gameOver){ //if the game isn't over yet
        game.physics.arcade.collide(spooky, walls); //check for collsions between player, walls and the ground
        game.physics.arcade.collide(spooky, grounds);
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            spooky.body.velocity.x = -100; //move left
            if (facing != 'left'){
            spooky.animations.play('left');
            facing = 'left';
            }
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
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
    else //add false
        restartButton.onDown.add(function () { resetGame(false); }); //restarts the game after winning
}

var wallTween;
function Activate(){ //use overlap to see whcih object he's overlapping  
    if(checkOverlap(spooky, wheel1) && !activated){ //1st wheel activates walls 2 and 4       
        moveWalls(false, true, false, true);
        wheel1.animations.play('turn');
    }
    
    if(checkOverlap(spooky, wheel2) && !activated){ //2nd wheel activates walls 2, 3, and 4
        moveWalls(false, true, true, true);
        wheel2.animations.play('turn');
    }
    
    if(checkOverlap(spooky, wheel3) && !activated){ //3rd wheel activates walls 3 and 4
        moveWalls(false, false, true, true);
        wheel3.animations.play('turn');
    }
    
    if(checkOverlap(spooky, wheel4) && !activated){//{ //4th wheel activates walls 1 and 2
        moveWalls(true, true, false, false);
        wheel4.animations.play('turn');
    }
    
    if(checkOverlap(spooky, reset) && !activated)//{ //reset wheel takes any walls still down and raises them back up
        resetGame(true);
    
    if(checkOverlap(spooky, chest)){ //if the chest is activated, player wins
        chest.animations.play('open');
        gameOver = true; //freezes controls
        win.play();
        text.text = 'Ghosts have won the day! ENTER to restart!'; //win text
    }
}

function moveWalls(moveWall1, moveWall2, moveWall3, moveWall4){
    if(moveWall1){
        wallTween = game.add.tween(wall1).to( { x: wall1.world.x, y: wall1.world.y + (96 * wall1Down) }, 1000, "Linear", true); //multiply 96 by wallDown to decide which direction it goes
        wall1Down *= -1; //invert wall1Down so that if this wall is triggered again, it'll go the other way
    }
   if(moveWall2){
        wallTween = game.add.tween(wall2).to( { x: wall2.world.x, y: wall2.world.y + (96 * wall2Down) }, 1000, "Linear", true);
        wall2Down *= -1;
    }
    if(moveWall3){
        wallTween = game.add.tween(wall3).to( { x: wall3.world.x, y: wall3.world.y + (96 * wall3Down) }, 1000, "Linear", true);
        wall3Down *= -1;
    }
    if(moveWall4){
        wallTween = game.add.tween(wall4).to( { x: wall4.world.x, y: wall4.world.y + (96 * wall4Down) }, 1000, "Linear", true);
        wall4Down *= -1;
    }
    else
        wallTween = game.add.tween(wall4).to( { x: wall4.world.x, y: wall4.world.y }, 1000, "Linear", true); //does nothing
    activated = true; //set to be true so that player can't hit more than one switch until the walls are done moving
    turnWheel.play(); //plays the sound
    wallTween.onComplete.add(Reactivate); //sets activated to false once the tween is done
}
function Reactivate(){
    activated = false; //resets activated
}

function resetGame(resetWheelTurned){
    if(wall1Down == -1){
            wallTween = game.add.tween(wall1).to( { x: wall1.world.x, y: wall1.world.y + (96 * wall1Down) }, 1000, "Linear", true); //resets walls
            wall1Down = 1;
        }
        if(wall2Down == -1){
            wallTween = game.add.tween(wall2).to( { x: wall2.world.x, y: wall2.world.y + (96 * wall2Down) }, 1000, "Linear", true);
            wall2Down = 1;
        }
        if(wall3Down == -1){
            wallTween = game.add.tween(wall3).to( { x: wall3.world.x, y: wall3.world.y + (96 * wall3Down) }, 1000, "Linear", true);
            wall3Down = 1;
        }
        if(wall4Down == -1){
            wallTween = game.add.tween(wall4).to( { x: wall4.world.x, y: wall4.world.y + (96 * wall4Down) }, 1000, "Linear", true);
            wall4Down = 1;
        }
        else
            wallTween = game.add.tween(wall4).to( { x: wall4.world.x, y: wall4.world.y }, 1000, "Linear", true);

        if(resetWheelTurned){
            reset.animations.play('turn');
            turnWheel.play();
        }
        else{
            spooky.x = 64; //resets ghost's postion
            chest.frameName = 'chest_1'; //reset chest
            gameOver = false;
            text.text = '-> and <- keys to move, SPACE to activate'; //reset instructions
        }
        activated = true;
        wallTween.onComplete.add(Reactivate); 
}
function checkOverlap(spriteA, spriteB) { //check for overlaps between player and objects
        
    var boundsA = spriteA.getBounds(); //get the bounds of their collider
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB); //see if they intersect

}