class TitleScreen extends Phaser.Scene {
    constructor() {
        super("title");

        this.my = {sprite: {}};
    }

    create() {
        let my = this.my;

        this.add.bitmapText(100, 125, "rocketSquare", "DUNGEON\nDELVER", 128, 0);
        this.add.bitmapText(100, 500, "rocketSquare", "Credits [X]", 64, 1);
        this.add.bitmapText(100, 400, "rocketSquare", "Start [Z]", 64, 1);

        this.z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.x = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

        this.registry.set('spawnpoint', 0);
    }

    update() {
        let my = this.my;

        if (Phaser.Input.Keyboard.JustDown(this.z)) {
            this.scene.start("rpgScene");
        }

        if (Phaser.Input.Keyboard.JustDown(this.x)) {
            this.scene.start("credits");
        }
    }
}