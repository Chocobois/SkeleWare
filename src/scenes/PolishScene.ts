import { BaseScrubScene } from "@/scenes/BaseScrubScene";

export class PolishScene extends BaseScrubScene {
	private background: Phaser.GameObjects.Image;
	private shoe: Phaser.GameObjects.Image;
	private sparkles: Phaser.GameObjects.Image[];
	private tool: Phaser.GameObjects.Image;
	private text: Phaser.GameObjects.Text;

	private numberPolished: number;

	constructor() {
		super({ key: "PolishScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x67e8f9);

		this.numberPolished = 0;

		/* Objects */

		this.background = this.add.image(this.CX, this.CY, "polish_background");
		this.background.setTint(0xcbd5e1);

		this.shoe = this.add.image(this.CX, this.CY, "polish_shoe");

		this.initDynamicTexture({
			textureKey: "polish_dirt",
			brushKey: "soft_brush",
			centerX: this.CX,
			centerY: this.CY,
			// debug: true,
		});

		this.sparkles = [];
		this.sparkles.push(this.add.image(700, 700, "polish_sparkles"));
		this.sparkles.push(this.add.image(1200, 400, "polish_sparkles"));
		this.sparkles.forEach((sparkle) => sparkle.setAlpha(0));

		this.tool = this.add.image(400, 900, "polish_brush");
		this.tool.setOrigin(0.8, 0.7);
		this.tool.setDepth(100);

		this.text = this.addText({
			x: this.CX,
			y: 0,
			size: 60,
			text: "Brush your loot!",
			color: "black",
		});
		this.text.setOrigin(0.5, 0.0);
		this.text.setDepth(1000);

		/* Animation */

		this.shoe.y += 1000;
		this.texture.y += 1000;
		this.tweens.add({
			targets: [this.shoe, this.texture],
			duration: 1000,
			ease: "Cubic.Out",
			y: "-=1000",
		});
	}

	update(time: number, delta: number) {
		const pointer = this.input.activePointer;
		if (pointer.isDown && !this.isComplete) {
			this.tool.x += (pointer.x - this.tool.x) / 2;
			this.tool.y += (pointer.y - this.tool.y) / 2;
		} else {
			this.tool.x += (400 - this.tool.x) / 5;
			this.tool.y += (900 - this.tool.y) / 5;
		}

		this.sparkles.forEach((sparkle, index) =>
			sparkle.setScale(
				0.4 + 0.05 * Math.sin((8 * time) / 1000 + (Math.PI / 2) * index)
			)
		);
	}

	onComplete(): void {
		this.numberPolished += 1;

		this.tweens.add({
			targets: this.sparkles,
			duration: 3000,
			ease: "Cubic.In",
			alpha: { from: 1, to: 0 },
		});

		if (this.numberPolished >= 2) {
			this.addEvent(2000, () => {
				this.startScene("CutsceneScene", {
					textureKey: "4_shoes",
					nextScene: "ComputerScene",
				});
			});
			return;
		}

		this.tweens.add({
			targets: [this.shoe, this.texture],
			delay: 500,
			duration: 1000,
			ease: "Cubic.In",
			y: "+=1000",
			onComplete: () => {
				this.initDynamicTexture({
					textureKey: "polish_dirt",
					brushKey: "soft_brush",
					centerX: this.CX,
					centerY: this.CY,
					// debug: true,
				});

				this.texture.y += 1000;

				this.tweens.add({
					targets: [this.shoe, this.texture],
					delay: 500,
					duration: 1000,
					ease: "Cubic.Out",
					y: "-=1000",
				});
			},
		});
	}
}
