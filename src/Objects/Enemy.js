class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, scale, player) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(scale);

        this.player = player;
        this.scene = scene;
        this.defeated = false;

        this.shootCdMax = 120;
        this.shootCd = 0;

        this.speed = 300;

        this.dagger = new Dagger(scene, 0, 0, "dagger", null).setScale(scale);
        scene.physics.add.collider(this.dagger, scene.wallLayer, _ => this.setDaggerActive(false));
        scene.physics.add.overlap(this.dagger, this.player, _ => this.onDaggerHit());

        return this;
    }

    update() {
        if(this.shootCd <= 0) {
            if(this.dagger.active == false) {
                this.dagger.x = this.x;
                this.dagger.y = this.y;
                this.setDaggerActive(true);
                let angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
                this.dagger.angle = Phaser.Math.RadToDeg(angle) + 90;
                this.scene.physics.moveTo(this.dagger, this.player.x, this.player.y, this.speed)
                this.shootCd = this.shootCdMax
            }
        }

        this.dagger.update();

        this.shootCd--;
    }

    setDaggerActive(boolean) {
        this.dagger.setVisible(boolean);
        this.dagger.setActive(boolean);
        if(boolean == false) {
            this.dagger.x = -1000;
        }
    }

    onDaggerHit() {
        this.player.onHit();
        this.setDaggerActive(false);
    }

}

class Dagger extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setVisible(false);
        this.setActive(false);

        return this;
    }

    update() {
    }
}