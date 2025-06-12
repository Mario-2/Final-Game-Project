class Dungeon extends Phaser.Scene {
    constructor() {
        super("dungeon");
    }

    init() {
        this.SCALE = 4.0;
    }

    create() {
        this.map = this.add.tilemap("dungeon", 16, 16, 50, 50);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("dungeon_tiles", "dungeon_tiles");

        // Create a layer
        this.groundLayer = this.map.createLayer("Ground", this.tileset, 0, 0);
        this.groundLayer.setScale(this.SCALE);

        // Create a layer
        this.wallLayer = this.map.createLayer("Walls", this.tileset, 0, 0);
        this.wallLayer.setScale(this.SCALE);

        this.wallLayer.setCollisionByProperty({
            collides: true
        });

        // Create a layer
        this.lockLayer = this.map.createLayer("Door", this.tileset, 0, 0);
        this.lockLayer.setScale(this.SCALE);

        this.lockLayer.setCollisionByProperty({
            collides: true
        });

        // Get the player object layer
        this.playerLayer = this.map.getObjectLayer("Player");
        this.spawnpoint = this.registry.get('spawnpoint');

        this.attack = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.cursors = this.input.keyboard.createCursorKeys();

        my.sprite.player = new Player(this, this.playerLayer.objects[this.spawnpoint].x * this.SCALE, this.playerLayer.objects[this.spawnpoint].y * this.SCALE, "player", null, this.cursors, this.attack, this.SCALE, 500);
        this.physics.add.collider(my.sprite.player, this.wallLayer);
        this.doorCollider = this.physics.add.collider(my.sprite.player, this.lockLayer);

        // add scene transitions
        this.transitionLayer = this.map.getObjectLayer("SceneTransitions");

        my.sprite.transition = [];
        for(let i = 0; i < this.transitionLayer.objects.length; i++) {
            my.sprite.transition[i] = this.physics.add.sprite(this.transitionLayer.objects[i].x * this.SCALE, this.transitionLayer.objects[i].y * this.SCALE, "player").setScale(this.SCALE);
            my.sprite.transition[i].setVisible(false);
            this.physics.add.collider(my.sprite.player, my.sprite.transition[i], _ => this.sceneTransition(this.transitionLayer.objects[i].properties[0].value, this.transitionLayer.objects[i].properties[1].value));
        }

        this.enemyLayer = this.map.getObjectLayer("Enemies");

        my.sprite.enemies = [];
        for(let i = 0; i < this.enemyLayer.objects.length; i++) {
            my.sprite.enemies[i] = new Enemy(this, this.enemyLayer.objects[i].x * this.SCALE, this.enemyLayer.objects[i].y * this.SCALE, "ghost", null, this.SCALE, my.sprite.player);
        }

        this.healingLayer = this.map.getObjectLayer("Healing");

        my.sprite.healing = [];
        for(let i = 0; i < this.healingLayer.objects.length; i++) {
            my.sprite.healing[i] = this.physics.add.sprite(this.healingLayer.objects[i].x * this.SCALE, this.healingLayer.objects[i].y * this.SCALE, "potion").setScale(this.SCALE);
            this.physics.add.overlap(my.sprite.player, my.sprite.healing[i], _ => this.healingPotion(my.sprite.healing[i]))
        }

        this.keyLayer = this.map.getObjectLayer("Key");
        this.keys = 0;

        my.sprite.key = [];
        for(let i = 0; i < this.keyLayer.objects.length; i++) {
            my.sprite.key[i] = this.physics.add.sprite(this.keyLayer.objects[i].x * this.SCALE, this.keyLayer.objects[i].y * this.SCALE, "key").setScale(this.SCALE);
            this.physics.add.overlap(my.sprite.player, my.sprite.key[i], _ => this.collectKey(my.sprite.key[i]))
        }

        this.chestLayer = this.map.getObjectLayer("End");

        my.sprite.chest = this.physics.add.sprite(this.chestLayer.objects[0].x * this.SCALE, this.chestLayer.objects[0].y * this.SCALE, "chest").setScale(this.SCALE);
        this.physics.add.overlap(my.sprite.player, my.sprite.chest, _ => this.scene.start("win"));

        // add camera zones
        this.cameraLayer = this.map.getObjectLayer("Camera");
        this.currentCameraZone = -1;
        my.sprite.cameraZones = [];
        for(let i = 0; i < this.cameraLayer.objects.length; i++) {
            my.sprite.cameraZones[i] = this.add.rectangle((this.cameraLayer.objects[i].x + this.cameraLayer.objects[i].width/2) * this.SCALE, (this.cameraLayer.objects[i].y - this.cameraLayer.objects[i].height/2) * this.SCALE, this.cameraLayer.objects[i].width * this.SCALE, this.cameraLayer.objects[i].height * this.SCALE); // x, y, width, height
            my.sprite.cameraZones[i] = this.physics.add.existing(my.sprite.cameraZones[i], true); // 'true' makes it static
            my.sprite.cameraZones[i].visible = false;
            console.log("camera: " + this.cameraLayer.objects[i].x * this.SCALE, this.cameraLayer.objects[i].y * this.SCALE, this.cameraLayer.objects[i].width * this.SCALE, this.cameraLayer.objects[i].height * this.SCALE);

            this.physics.add.overlap(my.sprite.player, my.sprite.cameraZones[i], _ => this.cameraZone((this.cameraLayer.objects[i].x) * this.SCALE, (this.cameraLayer.objects[i].y - this.cameraLayer.objects[i].height) * this.SCALE, this.cameraLayer.objects[i].width * this.SCALE, this.cameraLayer.objects[i].height * this.SCALE, i));
        }

        this.cameras.main.startFollow(my.sprite.player);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels * this.SCALE, this.map.heightInPixels * this.SCALE);

    }

    update() {
        my.sprite.player.update();
        for(let i = 0; i < my.sprite.enemies.length; i++) {
            if(my.sprite.enemies[i].active) {
                my.sprite.enemies[i].update();
            }
        }
    }

    sceneTransition(scene, spawn) {
        this.registry.set('spawnpoint', spawn);
        this.scene.start(scene);
    }

    cameraZone(x, y, width, height, zone) {
        if(this.currentCameraZone != zone) {
            this.currentCameraZone = zone;

            for(let i = 0; i < my.sprite.enemies.length; i++) { // set enemies to be active if inside a camera zone, and inactive if not
                if(my.sprite.enemies[i].defeated == false) {
                    if(my.sprite.enemies[i].x > x && my.sprite.enemies[i].x < x + width && my.sprite.enemies[i].y > y && my.sprite.enemies[i].y < y + height) {
                        my.sprite.enemies[i].setActive(true);
                        my.sprite.enemies[i].setVisible(true);
                    }
                    else {
                        my.sprite.enemies[i].setActive(false);
                        my.sprite.enemies[i].setVisible(false);
                    }
                }
            }

            this.cameras.main.setBounds(x, y, width, height);
        }
    }

    healingPotion(potion) {
        potion.setVisible(false);
        potion.setActive(false);
        potion.x = -1000;
        my.sprite.player.onHeal();
    }

    collectKey(key) {
        key.setVisible(false);
        key.setActive(false);
        key.x = -1000;
        this.keys++;
        this.sound.play("pickup", {
            volume: 0.5 
         });
        if(this.keys >= 2) {
            this.physics.world.removeCollider(this.doorCollider);
            this.map.destroyLayer("Door");
        }
    }
}