import { BaseScene } from "./BaseScene";
import { NextButton } from "@/components/NextButton";

export class ComputerScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private nextButton: NextButton;

	constructor() {
		super({ key: "ComputerScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x67e8f9);

		this.background = this.add.image(this.CX, this.CY, "computer_background");

		this.nextButton = new NextButton(this);
		this.nextButton.on("click", () => {
			this.startScene("CourtScene");
		});
	}

	update(time: number, delta: number) {
		this.nextButton.update(time, delta);
	}
}