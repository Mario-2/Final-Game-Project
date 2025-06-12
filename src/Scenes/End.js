class End extends Phaser.Scene {
    constructor() {
        super("win");

        this.my = {sprite: {}};
    }

    create() {
        let my = this.my;

        this.add.bitmapText(400, 125, "rocketSquare", "You Win!!!!!!", 128, 1);
        this.add.bitmapText(400, 500, "rocketSquare", "View Credits [X]", 64, 1);

        this.x = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    }

    update() {
        let my = this.my;

        if (Phaser.Input.Keyboard.JustDown(this.x)) {
            this.scene.start("credits");
        }
    }
}