import { BaseScene } from "./BaseScene";
import { NextButton } from "@/components/NextButton";

export class BoxingScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private nextButton: NextButton;

	constructor() {
		super({ key: "BoxingScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x67e8f9);

		this.background = this.add.image(this.CX, this.CY, "boxing_background");

		this.nextButton = new NextButton(this);
		this.nextButton.on("click", () => {
			this.startScene("ComputerScene");
		});
	}

	update(time: number, delta: number) {
		this.nextButton.update(time, delta);
	}
}
