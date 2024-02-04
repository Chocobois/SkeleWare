import { BaseScene } from "./BaseScene";
import { NextButton } from "@/components/NextButton";

export class BaseballScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private nextButton: NextButton;

	constructor() {
		super({ key: "BaseballScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x67e8f9);

		this.background = this.add.image(this.CX, this.CY, "baseball_background");

		this.nextButton = new NextButton(this);
		this.nextButton.on("click", () => {
			this.startScene("BombScene");
		});
	}

	update(time: number, delta: number) {
		this.nextButton.update(time, delta);
	}
}
