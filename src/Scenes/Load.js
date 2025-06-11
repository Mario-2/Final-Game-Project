class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.audio("jump", "jump.wav");
        this.load.audio("lose", "lose.wav");
        this.load.audio("dash", "dash.wav");
        this.load.audio("win", "win.wav");

        // Load tilemap information
        this.load.image("dungeon_tiles", "dungeon_tiles.png");                         // Packed tilemap
        this.load.tilemapTiledJSON("dungeon", "dungeon.tmj");   // Tilemap in JSON


        this.load.image("player", "tile_0096.png");

        this.load.multiatlas("kenny-particles", "kenny-particles.json");
    }

    create() {
         // ...and pass to the next Scene
         this.scene.start("rpgScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}