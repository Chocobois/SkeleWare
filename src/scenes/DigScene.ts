import { NextButton } from "@/components/NextButton";
import { BaseScrubScene } from "@/scenes/BaseScrubScene";

export class DigScene extends BaseScrubScene {
	private shovel: Phaser.GameObjects.Image;
	private shoes: Phaser.GameObjects.Image[];
	private text: Phaser.GameObjects.Text;

	private nextButton: NextButton;

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
			shoe.setScale(0.5);
			shoe.setTint(0xaaaaaa);
			shoe.setAngle(360 * Math.random());
			this.shoes.push(shoe);
		}

		this.initDynamicTexture({
			textureKey: "dig_dirt",
			brushKey: "soft_brush",
			centerX: this.CX,
			centerY: this.CY,
			debug: true,
			filter: this.shoes.map(
				(shoe) => new Phaser.Geom.Circle(shoe.x, shoe.y, 0.55 * shoe.displayWidth)
			),
		});

		let foreground = this.add.image(this.CX, this.CY, "dig_foreground");

		this.shovel = this.add.image(300, 300, "dig_shovel");
		this.shovel.setOrigin(0.9, 0.8);
		this.shovel.setScale(0.5);

		this.text = this.addText({
			x: this.CX,
			y: 0,
			size: 60,
			text: "Dig away!",
			color: "black",
		});
		this.text.setOrigin(0.5, 0.0);

		this.nextButton = new NextButton(this);
		this.nextButton.on("click", () => {
			this.startScene("CutsceneScene", {
				textureKey: "3_loot",
				nextScene: "PolishScene",
			});
		});
	}

	update(time: number, delta: number) {
		this.nextButton.update(time, delta);
	}

	onPointerMove(pointer: Phaser.Input.Pointer) {
		super.onPointerMove(pointer);
		if (pointer.isDown && !this.isComplete) {
			this.shovel.setPosition(pointer.x, pointer.y);
		}
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
		this.tweens.add({
			targets: this.shovel,
			duration: 1000,
			ease: "Cubic",
			x: { from: this.shovel.x, to: 300 },
			y: { from: this.shovel.y, to: 300 },
		});
	}
}
