import { BaseScrubScene } from "@/scenes/BaseScrubScene";

export class DigScene extends BaseScrubScene {
	private shovel: Phaser.GameObjects.Image;
	private shoes: Phaser.GameObjects.Image[];
	private sparkles: Phaser.GameObjects.Image[];
	private text: Phaser.GameObjects.Text;

	constructor() {
		super({ key: "DigScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x67e8f9);

		/* Objects */

		let background = this.add.image(this.CX, this.CY, "dig_background");

		this.shoes = [];
		for (let i = 0; i < 4; i++) {
			let x = 0;
			let y = 0;
			let limit = 100;
			do {
				x = this.W * (0.1 + 0.6 * Math.random());
				y = this.H * (0.5 + 0.3 * Math.random());
			} while (
				limit-- > 0 &&
				this.shoes.some(
					(shoe) => Phaser.Math.Distance.Between(shoe.x, shoe.y, x, y) < 300
				)
			);

			let shoe = this.add.image(x, y, "dig_shoe");
			shoe.setScale(0.6);
			shoe.setTint(0xaaaaaa);
			shoe.setAngle(400 * Math.random());
			this.shoes.push(shoe);
		}

		this.initDynamicTexture({
			textureKey: "dig_dirt",
			brushKey: "bite_brush",
			centerX: this.CX,
			centerY: this.CY,
			// debug: true,
			filter: this.shoes.map(
				(shoe) =>
					new Phaser.Geom.Circle(shoe.x, shoe.y, 0.55 * shoe.displayWidth)
			),
		});

		let foreground = this.add.image(this.CX, this.CY, "dig_foreground");

		this.shovel = this.add.image(300, 300, "dig_shovel");
		this.shovel.setOrigin(0.9, 0.8);
		this.shovel.setScale(0.5);

		this.sparkles = [];
		this.shoes.forEach((shoe) => {
			let sparkle = this.add.image(shoe.x, shoe.y, "polish_sparkles");
			sparkle.setVisible(false);
			sparkle.setDepth(100);
			this.sparkles.push(sparkle);
		});

		this.text = this.addText({
			x: this.CX,
			y: 0,
			size: 60,
			text: "Dig the grave!",
			color: "black",
		});
		this.text.setDepth(1000);
		this.text.setOrigin(0.5, 0.0);
	}

	update(time: number, delta: number) {
		const pointer = this.input.activePointer;
		if (pointer.isDown && !this.isComplete) {
			this.shovel.x += (pointer.x - this.shovel.x) / 2;
			this.shovel.y += (pointer.y - this.shovel.y) / 2;
		} else {
			this.shovel.x += (300 - this.shovel.x) / 5;
			this.shovel.y += (300 - this.shovel.y) / 5;
		}

		this.sparkles.forEach((sparkle, index) => {
			sparkle.setScale(
				0.4 + 0.05 * Math.sin((8 * time) / 1000 + (Math.PI / 2) * index)
			);
		});
	}

	onPointerDown(pointer: Phaser.Input.Pointer) {
		super.onPointerMove(pointer);
		if (pointer.isDown && !this.isComplete) {
			this.tweens.add({
				targets: this.shovel,
				x: pointer.x,
				y: pointer.y,
				duration: 120,
				ease: "Quart",
			});
		}
	}

	onComplete(): void {
		super.onComplete();

		this.sparkles.forEach((sparkle) => sparkle.setVisible(true));

		this.shoes.forEach((shoe, index) => {
			shoe.setDepth(100);
			this.tweens.add({
				targets: shoe,
				duration: 1500,
				delay: 250 * (index + 1),
				ease: "Sine.In",
				x: { from: shoe.x, to: this.CX },
				y: { from: shoe.y, to: -500 },
				scaleX: { from: 0.6, to: 0.9 },
				angle: { from: shoe.angle, to: shoe.angle + 360 },
			});
		});

		this.addEvent(2500, () => {
			this.nextScene();
		});
	}

	nextScene() {
		this.startScene("CutsceneScene", {
			textureKey: "3_loot",
			nextScene: "PolishScene",
		});
	}
}
