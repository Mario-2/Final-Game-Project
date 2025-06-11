class RPG extends Phaser.Scene {
    constructor() {
        super("rpgScene");
    }

    init() {
        this.SCALE = 4.0;
    }

    create() {
        this.map = this.add.tilemap("dungeon", 16, 16, 30, 20);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("dungeon_tiles", "dungeon_tiles");

        // Create a layer
        this.backgroundLayer = this.map.createLayer("Background", this.tileset, 0, 0);
        this.backgroundLayer.setScale(this.SCALE);

        this.backgroundLayer.setCollisionByProperty({
            collides: true
        });

        this.attack = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.cursors = this.input.keyboard.createCursorKeys();

        my.sprite.player = new Player(this, 50, 50, "player", null, this.cursors, this.attack, this.SCALE, 500);
        this.physics.add.collider(my.sprite.player, this.backgroundLayer);

        this.cameras.main.startFollow(my.sprite.player);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels * this.SCALE, this.map.heightInPixels * this.SCALE);

    }

    update() {
        my.sprite.player.update();
    }
}