
var ship;
var cursors;

var bullet;
var bullets;
var bulletTime = 0;

var startState = {
    preload: function() {
        game.load.image('space', 'assets/img/deep-space.jpg');
        game.load.image('bullet', 'assets/img/bullets.png');
        game.load.image('ship', 'assets/img/ship.png');
        game.load.image('sparkle', 'assets/img/sparkle.png');
        game.load.image("asteroid", "assets/img/asteroid2.png");
    },
    create: function() {

        // Set world dimension
        game.world.setBounds(0, 0, config.worldDim.width, config.worldDim.height);

        //  This will run in Canvas mode, so let's gain a little speed and display
        game.renderer.clearBeforeRender = false;
        game.renderer.roundPixels = true;

        //  We need arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //  A spacey background
        game.add.tileSprite(0, 0, game.world.width, game.world.height, 'space');

        //  Our ships bullets
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;

        //  All 40 of them
        bullets.createMultiple(40, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 0.5);

        //  Our player ship
        ship = game.add.sprite(300, 300, 'ship');
        ship.anchor.set(0.5);

        // Ship's sparkle
        sparkle = game.add.sprite(0, 0, 'sparkle');
        sparkle.angle = 180;
        sparkle.anchor.set(0.5);
        ship.addChild(sparkle);

        // Camera Gesture
        game.camera.x = ship.x;
        game.camera.y = ship.y;
        game.camera.height = game.height;
        game.camera.width = game.width;
        game.camera.follow(ship);

        //  ship's physics settings
        game.physics.enable(ship, Phaser.Physics.ARCADE);

        ship.body.drag.set(100);
        ship.body.maxVelocity.set(200);

        //  Game input
        cursors = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);


    },
    update: function() {

        if (cursors.up.isDown){
            game.physics.arcade.accelerationFromRotation(ship.rotation, 200, ship.body.acceleration);
            sparkle.visible = true;
        }else{
            ship.body.acceleration.set(0);
            sparkle.body.acceleration.set(0);
            sparkle.visible = false;
        }

        if (cursors.left.isDown){
            ship.body.angularVelocity = -300;
        }else if (cursors.right.isDown){
            ship.body.angularVelocity = 300;
        }else{
            ship.body.angularVelocity = 0;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
            fireBullet();
        }

        screenWrap(ship);

        bullets.forEachExists(screenWrap, this);

    },
    render: function(){}
 };



function fireBullet () {

    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(ship.body.x + 16, ship.body.y + 16);
            bullet.lifespan = 2000;
            bullet.rotation = ship.rotation;
            game.physics.arcade.velocityFromRotation(ship.rotation, 400, bullet.body.velocity);
            bulletTime = game.time.now + 50;
        }
    }

}

function screenWrap (ship) {

    if (ship.x < 0){
        ship.x = game.world.width;
    } else if (ship.x > game.world.width){
        ship.x = 0;
    }

    if (ship.y < 0){
        ship.y = game.world.height;
    } else if (ship.y > game.world.height){
        ship.y = 0;
    }

}
