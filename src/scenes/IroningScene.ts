import { BaseScrubScene } from "@/scenes/BaseScrubScene";

export class IroningScene extends BaseScrubScene {
	private background: Phaser.GameObjects.Image;
	private shoe: Phaser.GameObjects.Image;
	private sparkles: Phaser.GameObjects.Image[];
	private tool: Phaser.GameObjects.Image;
	private text: Phaser.GameObjects.Text;

	private numberIroned: number;

	constructor() {
		super({ key: "IroningScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x67e8f9);

		this.numberIroned = 0;

		/* Objects */

		this.background = this.add.image(this.CX, this.CY, "ironing_background");
		this.background.setTint(0xcbd5e1);

		this.shoe = this.add.image(this.CX, this.CY, "ironing_shirt_ironed");

		this.initDynamicTexture({
			textureKey: "ironing_shirt",
			brushKey: "soft_brush",
			centerX: this.CX,
			centerY: this.CY,
			// debug: true,
		});

		this.sparkles = [];
		this.sparkles.push(this.add.image(700, 800, "polish_sparkles"));
		this.sparkles.push(this.add.image(1300, 350, "polish_sparkles"));
		this.sparkles.forEach((sparkle) => sparkle.setAlpha(0));

		this.tool = this.add.image(1500, 600, "ironing_iron");
		this.tool.setDepth(100);

		this.text = this.addText({
			x: this.CX,
			y: 0,
			size: 60,
			text: "Iron the shirts!",
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
			this.tool.x += (1500 - this.tool.x) / 5;
			this.tool.y += (600 - this.tool.y) / 5;
		}

		this.sparkles.forEach((sparkle, index) =>
			sparkle.setScale(
				0.4 + 0.05 * Math.sin((8 * time) / 1000 + (Math.PI / 2) * index)
			)
		);
	}

	onComplete(): void {
		this.numberIroned += 1;

		this.tweens.add({
			targets: this.sparkles,
			duration: 3000,
			ease: "Cubic.In",
			alpha: { from: 1, to: 0 },
		});

		if (this.numberIroned >= 3) {
			this.addEvent(2000, () => {
				this.startScene("CutsceneScene", {
					textureKey: "6_baseball",
					nextScene: "BaseballScene",
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
					textureKey: "ironing_shirt",
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
