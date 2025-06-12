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
        scene.physics.add.overlap(this, this.player.sword, _ => this.onHit());

        this.onhitvfx = scene.add.particles(0, 0, "kenny-particles", {
            frame: ['star_02.png', 'star_03.png'],
            scale: {start: 0.4, end: 0.05},
            lifespan: 350,
            alpha: {start: 1, end: 0.1}
        });

        this.onhitvfx.startFollow(this);

        this.onhitvfx.stop();

        this.ondaggerhitvfx = scene.add.particles(0, 0, "kenny-particles", {
            frame: ['star_08.png', 'star_04.png'],
            scale: {start: 0.2, end: 0.05},
            lifespan: 250,
            alpha: {start: 1, end: 0.1}
        });

        this.ondaggerhitvfx.startFollow(this.dagger);

        this.ondaggerhitvfx.stop();

        return this;
    }

    update() {
        if(this.shootCd <= 0) {
            if(this.dagger.active == false) { // if no dagger is active, shoot a new one
                this.dagger.x = this.x;
                this.dagger.y = this.y;
                this.setDaggerActive(true);
                let angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
                this.dagger.angle = Phaser.Math.RadToDeg(angle) + 90;
                this.scene.physics.moveTo(this.dagger, this.player.x, this.player.y, this.speed)
                this.shootCd = this.shootCdMax
                this.scene.sound.play("miss", {
                    volume: 0.5 
                });
            }
        }

        this.dagger.update();

        this.shootCd--;
    }

    setDaggerActive(boolean) {
        this.dagger.setVisible(boolean);
        this.dagger.setActive(boolean);
        if(boolean == false) {
            this.ondaggerhitvfx.emitParticle();
            this.dagger.x = -1000;
        }
    }

    onDaggerHit() {
        this.player.onHit();
        this.setDaggerActive(false);
    }

    onHit() {
        this.scene.sound.play("die", {
            volume: 0.5 
         });
        this.setVisible(false);
        this.setActive(false);
        this.onhitvfx.emitParticle();
        this.x = -1000;
        // play sound and do effect
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