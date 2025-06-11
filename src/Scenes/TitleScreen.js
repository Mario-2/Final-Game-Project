class TitleScreen extends Phaser.Scene {
    constructor() {
        super("Title");

        this.my = {sprite: {}};
    }

    create() {
        let my = this.my;

        this.add.bitmapText(100, 275, "rocketSquare", "Controls", 32, 1);
        this.add.bitmapText(520, 275, "rocketSquare", "Credits", 32, 1);
        this.add.bitmapText(335, 400, "rocketSquare", "Start", 32, 1);

        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        let my = this.my;

        if (Phaser.Input.Keyboard.JustDown(this.left)) {
            this.scene.start("Controls");
        }

        if (Phaser.Input.Keyboard.JustDown(this.right)) {
            this.scene.start("Credits");
        }

        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            this.scene.start("Wave1");
        }
    }
}