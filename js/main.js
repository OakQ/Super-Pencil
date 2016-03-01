var game = new Phaser.Game(768, 192, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
    game.load.atlas('superPencilAtlas', 'assets/Sprites/superPencilAtlas.png', 'assets/Sprites/superPencilAtlas.json');
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
var pencil;
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
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    pencil = game.add.sprite(64, 96, 'superPencilAtlas', 'pencil_idle_1');
    pencil.animations.add('idle', Phaser.Animation.generateFrameNames('pencil_idle_', 1, 2, '', 1), 2, true);
    pencil.animations.add('right', Phaser.Animation.generateFrameNames('pencil_right_', 1, 2, '', 1), 2, true); //aniamtion of him facing right
    pencil.animations.add('left', Phaser.Animation.generateFrameNames('pencil_left_', 1, 2, '', 1), 2, true); //and left
    pencil.animations.play('idle'); //start him facing right
    game.physics.arcade.enable(pencil);
    pencil.body.enable = true;
}


function update() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
        pencil.body.velocity.x = -100; //move left
        if (facing != 'left'){ //if we weren't already facing left
            pencil.animations.play('left'); //start the left animation
            facing = 'left'; //now we're facing left
        }
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){ //same for right
        pencil.body.velocity.x = 100;
        if (facing != 'right'){
            pencil.animations.play('right');
            facing = 'right';
        }
    }
    else{
        pencil.body.velocity.x = 0; //idle
        pencil.body.velocity.y = 0;
         if (facing != 'idle'){
            pencil.animations.play('idle');
            facing = 'idle';
        }
    }

}