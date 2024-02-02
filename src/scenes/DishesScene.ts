import { BaseScrubScene } from "@/scenes/BaseScrubScene";
import { Player } from "@/components/Player";
import { UI } from "@/components/UI";

export class DishesScene extends BaseScrubScene {
	private background: Phaser.GameObjects.Image;
	private plate: Phaser.GameObjects.Image;
	private sparkles: Phaser.GameObjects.Image;
	private sponge: Phaser.GameObjects.Image;

	private text: Phaser.GameObjects.Text;

	constructor() {
		super({ key: "DishesScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x777777);

		/* Objects */

		this.background = this.add.image(this.CX, this.CY, "dishes_background");

		this.plate = this.add.image(this.CX, this.CY, "dishes_plate");

		this.initDynamicTexture({
			textureKey: "dishes_dirt",
			centerX: this.CX,
			centerY: this.CY,
			asCircle: true,
			debug: false,
		});

		this.sparkles = this.add.image(this.CX, this.CY, "dishes_sparkles");
		this.sparkles.setVisible(false);

		this.sponge = this.add.image(300, 800, "dishes_sponge");

		this.text = this.addText({
			x: this.CX,
			y: 0,
			size: 60,
			text: "Do the dishes!",
			color: "black",
		});
		this.text.setOrigin(0.5, 0.0);
	}

	update(time: number, delta: number) {
		// this.dirt.setAlpha(0.5 + 0.5 * Math.sin((4 * time) / 1000));

		this.sparkles.setScale(1.0 + 0.05 * Math.sin((8 * time) / 1000));
	}

	onRub(pointer: Phaser.Input.Pointer): void {
		super.onRub(pointer);

		this.sponge.setPosition(pointer.x, pointer.y);
	}

	onComplete(): void {
		this.sparkles.setVisible(true);

		this.tweens.add({
			targets: this.sponge,
			duration: 1000,
			ease: "Cubic",
			x: { from: this.sponge.x, to: 300 },
			y: { from: this.sponge.y, to: 800 },
		});
	}
}
