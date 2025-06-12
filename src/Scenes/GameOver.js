class GameOver extends Phaser.Scene {
    constructor() {
        super("gameover");

        this.my = {sprite: {}};
    }

    create() {
        let my = this.my;

        this.add.bitmapText(200, 125, "rocketSquare", "GAME OVER", 96, 1);
        this.add.bitmapText(200, 300, "rocketSquare", "Return to Menu [X]", 64, 1);

        this.z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.x = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

        this.registry.set('spawnpoint', 0);
    }

    update() {
        let my = this.my;

        if (Phaser.Input.Keyboard.JustDown(this.x)) {
            this.scene.start("title");
        }
    }
}