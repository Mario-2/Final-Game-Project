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

        this.cursors = this.input.keyboard.createCursorKeys();

        my.sprite.player = new Player(this, 50, 50, "player", null, this.cursors, 500).setScale(this.SCALE);

    }

    update() {
        my.sprite.player.update();
    }
}