import { NextButton } from "@/components/NextButton";
import { BaseScrubScene } from "@/scenes/BaseScrubScene";

export class DigScene extends BaseScrubScene {
	private shovel: Phaser.GameObjects.Image;
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

		for (let i = 0; i < 5; i++) {
			let x = this.W * (0.2 + 0.6 * Math.random());
			let y = this.H * (0.1 + 0.9 * Math.random());
			let shoe = this.add.image(x, y, "dig_shoe");
			shoe.setAngle(360 * Math.random());
		}

		this.initDynamicTexture({
			textureKey: "dig_dirt",
			brushKey: "soft_brush",
			centerX: this.CX,
			centerY: this.CY,
			// debug: true,
		});

		let foreground = this.add.image(this.CX, this.CY, "dig_foreground");

		this.shovel = this.add.image(100, 1000, "dig_shovel");
		this.shovel.setOrigin(0, 1);

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
			this.startScene("DishesScene");
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

	onComplete(): void {
		this.tweens.add({
			targets: this.shovel,
			duration: 1000,
			ease: "Cubic",
			x: { from: this.shovel.x, to: 100 },
			y: { from: this.shovel.y, to: 1000 },
		});
	}
}
