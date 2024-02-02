import { BaseScene } from "@/scenes/BaseScene";
import { Player } from "@/components/Player";
import { UI } from "@/components/UI";

export class DishesScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private plate: Phaser.GameObjects.Image;
	private dirt: Phaser.GameObjects.Image;
	private sparkles: Phaser.GameObjects.Image;
	private sponge: Phaser.GameObjects.Image;

	private text: Phaser.GameObjects.Text;

	constructor() {
		super({ key: "DishesScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x777777);

		/* Sprites */

		this.background = this.add.image(this.CX, this.CY, "dishes_background");

		this.plate = this.add.image(this.CX, this.CY, "dishes_plate");

		this.dirt = this.add.image(this.CX, this.CY, "dishes_dirt");

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

		/* Interactions */

		// this.background.setInteractive({});
	}

	update(time: number, delta: number) {
		this.dirt.setAlpha(0.5 + 0.5 * Math.sin((4 * time) / 1000));

		// this.sparkles.setAlpha(0.75 + 0.25 * Math.sin((40 * time) / 1000));
	}
}
