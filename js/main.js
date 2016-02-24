var game = new Phaser.Game(768, 768, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
    game.load.atlas('spookyAtlas', 'assets/Sprites/spookyAtlas.png', 'assets/Sprites/spookyAtlas.json');
    game.load.image('bg', 'assets/sprites/background.bmp');
    game.load.audio('hit_1', 'assets/Audio/Hit_1.wav');
    game.load.audio('hit_2', 'assets/Audio/Hit_2.wav');
    game.load.audio('hit_3', 'assets/Audio/Hit_3.wav');
    game.load.audio('hit_4', 'assets/Audio/Hit_4.wav');
    game.load.audio('hit_5', 'assets/Audio/Hit_5.wav');
    game.load.audio('coins', 'assets/Audio/key_pickup.mp3');
    game.load.audio('scream', 'assets/Audio/scream_horror1.mp3');
    game.load.audio('music', 'assets/Audio/William_Hellfire_-_21_-_Poses_-_William_Hellfire.mp3');
}


var grounds;
var chests;

var wall1;
var wall2;
var wall3;
var wall1Down;
var wall2Down;
var wall3Down;

var ground;
var chest;
var spooky;
var wheel1;
var wheel2;
var wheel3;

var bg;

var down;
var up;
var left;
var right;
var activate;
//var text;

function create() {
    
    bg = game.add.sprite(0,0, 'bg');
    music = game.add.audio('music');
    music.loop = true;
    //music.play();
    wall1Down = 1;
    wall2Down = 1;
    wall3Down = 1;
    walls = game.add.group();
    wheels = game.add.group();
    
    
    //bg = game.add.tileSprite(0, 0, 768, 768, 'bg');
    spooky = game.add.sprite(88, 70, 'spookyAtlas', 'spooky_1');
    spooky.animations.add('rattle', Phaser.Animation.generateFrameNames('spooky_', 1, 2, '', 1), 2, true);
    spooky.animations.play('rattle');
    
    grounds = game.add.group();
    for (var x = 0; x < 24; x++){
        for (var y = 0; y < 24; y++){
            if (x ==0 || x == 23 || y == 0)
                ground = grounds.create(x * 32, y * 32, 'spookyAtlas', 'ground'); //places walls on the 4 sides
        }
    }
    
    for (var i = 0; i < 20; i++){
        ground = grounds.create(i * 32, 160, 'spookyAtlas', 'ground');
        if (i == 17){
            wall1 = walls.create(i * 32, 64, 'spookyAtlas', 'wall');
            wall1.scale.setTo(1.5, 2);
        }
        if (i == 18){
            wall2 = walls.create(i * 32, 64, 'spookyAtlas', 'wall');
            wall2.scale.setTo(1.5, 2);
        }
        if (i == 19){
            wall3 = walls.create(i * 32, 64, 'spookyAtlas', 'wall');
            wall3.scale.setTo(1.5, 2);
        }
        if (i == 5){
            wheel1 = game.add.sprite(i * 32, 96, 'spookyAtlas', 'wheel_1');
            wheel1.scale.setTo(1.5, 1.5);
            wheel1.animations.add('turn', Phaser.Animation.generateFrameNames('wheel_', 1, 2, '', 1), 2, true);
        }
        if (i == 10){
            wheel2 = game.add.sprite(i * 32, 96, 'spookyAtlas', 'wheel_1');
            wheel2.scale.setTo(1.5, 1.5);
            wheel2.animations.add('turn', Phaser.Animation.generateFrameNames('wheel_', 1, 2, '', 1), 2, true);
        }
        if (i == 15){
            wheel3 = game.add.sprite(i * 32, 96, 'spookyAtlas', 'wheel_1');
            wheel3.scale.setTo(1.5, 1.5);
            wheel3.animations.add('turn', Phaser.Animation.generateFrameNames('wheel_', 1, 2, '', 1), 2, true);
        }
    }
    
    activate = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); //use WASD instead of arrow keys because we are not casuals
                /*booty = booties.create(x * 64, y * 64, 'dungeonAtlas', 'chest_1');
                booty.animations.add('open', Phaser.Animation.generateFrameNames('chest_', 1, 3, '', 1), 1, false);
                booty.animations.killOnComplete = true; //deletes chest when aniamtion finishes. Doesn't work as intended*/
    
    //score = 0;
    //scoreText = game.add.text(32, 32, 'Score: 0', { font: "20px Arial", fill: "#000000", align: "center" }); //set score to 0 and set text
}


function update () {
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        spooky.x -= 4;
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        spooky.x += 4;
    else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        spooky.y += 4;
    
    activate.onDown.add(Activate);
}

function Activate(){
    if(checkOverlap(spooky, wheel1)){
         game.add.tween(wall1).to( { x: wall1.world.x, y: wall1.world.y + (96 * wall1Down) }, 1000, "Linear", true);
        game.add.tween(wall3).to( { x: wall3.world.x, y: wall3.world.y + (96 * wall3Down) }, 1000, "Linear", true);
        wall1Down *= -1;
        wall3Down *= -1;
    }
    
    if(checkOverlap(spooky, wheel2)){
         game.add.tween(wall1).to( { x: wall1.world.x, y: wall1.world.y + (96 * wall1Down) }, 1000, "Linear", true);
        game.add.tween(wall2).to( { x: wall2.world.x, y: wall2.world.y + (96 * wall2Down) }, 1000, "Linear", true);
        wall1Down *= -1;
        wall2Down *= -1;
    }
    
    if(checkOverlap(spooky, wheel3)){
         game.add.tween(wall2).to( { x: wall2.world.x, y: wall2.world.y + (96 * wall2Down) }, 1000, "Linear", true);
        game.add.tween(wall3).to( { x: wall3.world.x, y: wall3.world.y + (96 * wall3Down) }, 1000, "Linear", true);
        wall2Down *= -1;
        wall3Down *= -1;
    }
}

function checkOverlap(spriteA, spriteB) { //check for overlaps between player and objects
        
    var boundsA = spriteA.getBounds(); //get the bounds of their collider
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB); //see if they intersect

}