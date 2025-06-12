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
        this.load.audio("hit", "hit.wav");
        this.load.audio("die", "die.wav");
        this.load.audio("pickup", "pickup.wav");
        this.load.audio("miss", "miss.wav");

        // Load tilemap information
        this.load.image("dungeon_tiles", "dungeon_tiles.png");                         // Packed tilemap
        this.load.tilemapTiledJSON("dungeon", "dungeon.tmj");   // Tilemap in JSON

        // Load tilemap information
        this.load.image("overworld_tiles", "overworld_tiles.png");                         // Packed tilemap
        this.load.tilemapTiledJSON("overworld", "overworld.tmj");   // Tilemap in JSON


        this.load.image("player", "tile_0096.png");
        this.load.image("sword", "tile_0106.png");
        this.load.image("dagger", "tile_0103.png");
        this.load.image("ghost", "tile_0121.png");
        this.load.image("potion", "tile_0115.png");
        this.load.image("key", "tile_0130.png");
        this.load.image("sign", "sign.png");
        this.load.image("chest", "tile_0089.png");

        this.load.multiatlas("kenny-particles", "kenny-particles.json");

        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }

    create() {
         // ...and pass to the next Scene
         this.scene.start("title");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}