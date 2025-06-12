class Credits extends Phaser.Scene {
    constructor() {
        super("credits");

        this.my = {sprite: {}};
    }

    create() {
        let my = this.my;

        this.add.bitmapText(200, 125, "rocketSquare", "Code, Sounds\nZachary Rocco", 64, 1);
        this.add.bitmapText(200, 325, "rocketSquare", "Art\nKenney Assets", 64, 1);
        this.add.bitmapText(200, 500, "rocketSquare", "Return to Menu [X]", 64, 1);

        this.x = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    }

    update() {
        let my = this.my;

        if (Phaser.Input.Keyboard.JustDown(this.x)) {
            this.scene.start("title");
        }
    }
}