import { BaseScrubScene } from "@/scenes/BaseScrubScene";
import { UIScene } from "./UIScene";
import { Instructions } from "@/components/Instructions";

export class DishesScene extends BaseScrubScene {
	private background: Phaser.GameObjects.Image;
	private foreground: Phaser.GameObjects.Image;
	private plate: Phaser.GameObjects.Image;
	private sparkles: Phaser.GameObjects.Image[];
	private sponge: Phaser.GameObjects.Image;
	private text: Phaser.GameObjects.Text;
	private instructions: Instructions;

	private numberPolished: number;

	constructor() {
		super({ key: "DishesScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x67e8f9);

		this.numberPolished = 0;

		/* Objects */

		this.background = this.add.image(this.CX, this.CY, "dishes_background");

		this.foreground = this.add.image(this.CX, this.CY, "dishes_foreground");
		this.foreground.setDepth(5);

		this.plate = this.add.image(this.CX, this.CY, "dishes_plate");

		this.initDynamicTexture({
			textureKey: "dishes_dirt",
			brushKey: "soft_brush",
			centerX: this.CX,
			centerY: this.CY,
			// debug: true,
		});

		this.sparkles = [];
		this.sparkles.push(this.add.image(500, 900, "polish_sparkles"));
		this.sparkles.push(this.add.image(1400, 400, "polish_sparkles"));
		this.sparkles.forEach((sparkle) => sparkle.setAlpha(0));

		this.sponge = this.add.image(300, 800, "dishes_sponge");
		this.sponge.setOrigin(0.5);
		this.sponge.setDepth(100);

		this.instructions = new Instructions(this, "Do the dishes");

		/* Animation */

		this.plate.y += 900;
		this.texture.y += 900;
		this.tweens.add({
			targets: [this.plate, this.texture],
			duration: 1000,
			ease: "Cubic.Out",
			y: "-=900",
		});
	}

	update(time: number, delta: number) {
		const pointer = this.input.activePointer;
		if (pointer.isDown && !this.isComplete) {
			this.sponge.x += (pointer.x - this.sponge.x) / 2;
			this.sponge.y += (pointer.y - this.sponge.y) / 2;
		} else {
			this.sponge.x += (300 - this.sponge.x) / 5;
			this.sponge.y += (800 - this.sponge.y) / 5;
		}

		this.sparkles.forEach((sparkle, index) =>
			sparkle.setScale(
				0.4 + 0.05 * Math.sin((8 * time) / 1000 + (Math.PI / 2) * index)
			)
		);
	}

	onComplete(): void {
		super.onComplete();
		this.numberPolished += 1;

		this.tweens.add({
			targets: this.sparkles,
			duration: 3000,
			ease: "Cubic.In",
			alpha: { from: 1, to: 0 },
		});

		if (this.numberPolished >= 3) {
			(this.scene.get("UIScene") as UIScene).playMusic("tense");
			this.instructions.destroy();

			this.addEvent(2000, () => {
				this.startScene("CutsceneScene", {
					textureKey: "10_bomb",
					nextScene: "BombScene",
				});
			});
			return;
		}

		this.tweens.add({
			targets: [this.plate, this.texture],
			delay: 500,
			duration: 600,
			ease: "Cubic.In",
			y: "+=900",
			onComplete: () => {
				this.initDynamicTexture({
					textureKey: "dishes_dirt",
					brushKey: "soft_brush",
					centerX: this.CX,
					centerY: this.CY,
					// debug: true,
				});

				if (this.numberPolished == 2) {
					// Add bomb
					this.plate.setTexture("dishes_bomb");
					let { width, height } = this.textures.getFrame("dishes_plate");
					this.texture.draw(
						"dishes_plate",
						this.CX - width / 2,
						this.CY - height / 2
					);
					let dims = this.textures.getFrame("dishes_dirt");
					this.texture.draw(
						"dishes_dirt",
						this.CX - dims.width / 2,
						this.CY - dims.height / 2
					);
				}

				this.texture.y += 900;

				this.tweens.add({
					targets: [this.plate, this.texture],
					delay: 500,
					duration: 600,
					ease: "Cubic.Out",
					y: "-=900",
				});
			},
		});
	}
}
