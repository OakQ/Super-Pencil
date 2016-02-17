var game = new Phaser.Game(768, 768, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
    game.load.atlas('dungeonAtlas', 'assets/Sprites/dungeonAtlas.png', 'assets/Sprites/dungeonAtlas.json');
}

var spaces;
var walls;
var spookies;
var booties;

var space;
var wall;
var player;
var spook;
var booty;

var place;

function create() {
    spaces = game.add.group();
    walls = game.add.group();
    for (var x = 0; x < 12; x++){
        for (var y = 0; y < 12; y++){
            if (x ==0 || x == 11 || y == 0 || y == 11)
                wall = walls.create(x * 64, y * 64, 'dungeonAtlas', 'wall');
            else
                space = spaces.create(x * 64, y * 64, 'dungeonAtlas', 'ground');
        }
    }
    //64+24, 64-24
    player = game.add.sprite(88, 40, 'dungeonAtlas', 'paddle_01');
    player.animations.add('slide', Phaser.Animation.generateFrameNames('paddle_', 0, 10, '', 2), 10, true);
    player.animations.play('slide');
    
    spookies = game.add.group();
    booties = game.add.group();
    for (var x = 1; x < 11; x++){
        for (var y = 1; y < 11; y++){
            place = Math.floor(Math.random() * 25);
            if(place < 2 && x != 1 && y != 1){
                spook = spookies.create(x * 64, y * 64, 'dungeonAtlas', 'ghost_1');
                spook.animations.add('rattle', Phaser.Animation.generateFrameNames('ghost_', 0, 2, '', 1), 2, true);
                spook.animations.play('rattle');
            }
            else if(place >= 2 && place < 3 && x != 1 && y != 1){
                booty = booties.create(x * 64, y * 64, 'dungeonAtlas', 'chest_1');
                booty.animations.add('open', Phaser.Animation.generateFrameNames('chest_', 0, 3, '', 1), 1, false);
            }
        }
    }
    
}

function update () {

}