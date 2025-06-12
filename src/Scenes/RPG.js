class RPG extends Phaser.Scene {
    constructor() {
        super("rpgScene");
    }

    init() {
        this.SCALE = 4.0;
    }

    create() {
        this.map = this.add.tilemap("overworld", 16, 16, 30, 20);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("overworld_tiles", "overworld_tiles");

        // Create a layer
        this.groundLayer = this.map.createLayer("Ground", this.tileset, 0, 0);
        this.groundLayer.setScale(this.SCALE);

        // Create a layer
        this.wallLayer = this.map.createLayer("Walls", this.tileset, 0, 0);
        this.wallLayer.setScale(this.SCALE);

        this.wallLayer.setCollisionByProperty({
            collides: true
        });

        // Get the player object layer
        this.playerLayer = this.map.getObjectLayer("Player");
        this.spawnpoint = this.registry.get('spawnpoint');

        this.attack = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.cursors = this.input.keyboard.createCursorKeys();

        my.sprite.player = new Player(this, this.playerLayer.objects[this.spawnpoint].x * this.SCALE, this.playerLayer.objects[this.spawnpoint].y * this.SCALE, "player", null, this.cursors, this.attack, this.SCALE, 500);
        this.physics.add.collider(my.sprite.player, this.wallLayer);

        // add scene transitions
        this.transitionLayer = this.map.getObjectLayer("SceneTransitions");

        my.sprite.transition = [];
        for(let i = 0; i < this.transitionLayer.objects.length; i++) {
            my.sprite.transition[i] = this.physics.add.sprite(this.transitionLayer.objects[i].x * this.SCALE, this.transitionLayer.objects[i].y * this.SCALE, "player").setScale(this.SCALE);
            my.sprite.transition[i].setVisible(false);
            this.physics.add.collider(my.sprite.player, my.sprite.transition[i], _ => this.sceneTransition(this.transitionLayer.objects[i].properties[0].value, this.transitionLayer.objects[i].properties[1].value));
        }

        this.signLayer = this.map.getObjectLayer("NPCs");

        my.sprite.sign = [];
        for(let i = 0; i < this.signLayer.objects.length; i++) {
            my.sprite.sign[i] = this.add.sprite(this.signLayer.objects[i].x * this.SCALE, this.signLayer.objects[i].y * this.SCALE, "sign").setScale(this.SCALE);
            my.sprite.sign[i].text = null;
            my.sprite.sign[i] = this.physics.add.existing(my.sprite.sign[i], true); // set collider to static
            this.physics.add.collider(my.sprite.player, my.sprite.sign[i]);
            this.physics.add.overlap(my.sprite.player.sword, my.sprite.sign[i], _ => this.signInteract(my.sprite.sign[i], this.signLayer.objects[i].properties[0].value));
        }

        this.cameras.main.startFollow(my.sprite.player);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels * this.SCALE, this.map.heightInPixels * this.SCALE);

    }

    update() {
        my.sprite.player.update();
    }

    sceneTransition(scene, spawn) {
        this.registry.set('spawnpoint', spawn);
        this.scene.start(scene);
    }

    signInteract(sprite, text) {
        if(sprite.text == null) 
            this.sound.play("pickup", {
            volume: 0.5 
            });{
            sprite.text = this.add.bitmapText(sprite.x - 86 * 2, sprite.y - 86, "rocketSquare", text, 32, 1);
        }
    }
}