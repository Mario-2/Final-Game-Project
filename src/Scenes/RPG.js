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

        for(let i = 0; i < this.transitionLayer.objects.length; i++) {
            my.sprite.transition = [];
            my.sprite.transition[i] = this.physics.add.sprite(this.transitionLayer.objects[i].x * this.SCALE, this.transitionLayer.objects[i].y * this.SCALE, "player").setScale(this.SCALE);
            this.physics.add.collider(my.sprite.player, my.sprite.transition[i], _ => this.sceneTransition(this.transitionLayer.objects[i].properties.scene));
        }

        this.cameras.main.startFollow(my.sprite.player);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels * this.SCALE, this.map.heightInPixels * this.SCALE);

    }

    update() {
        my.sprite.player.update();
    }

    sceneTransition(scene) {
        this.scene.start(scene);
    }
}