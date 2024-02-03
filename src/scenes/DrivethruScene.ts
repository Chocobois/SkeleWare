import { Button } from "@/components/elements/Button";
import { BaseScene } from "./BaseScene";
import { NextButton } from "@/components/NextButton";
import { RoundRectangle } from "@/components/elements/RoundRectangle";

export class DrivethruScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private buttons: Button[];
	private nextButton: NextButton;

	constructor() {
		super({ key: "DrivethruScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x67e8f9);

		this.background = this.add.image(this.CX, this.CY, "drivethru_background");

		this.buttons = [];
		this.addMenuButton(800, 500, "borgir", () => {
			console.log("nice");
		});
		this.addMenuButton(1200, 500, "fries", () => {
			console.log("nice");
		});
		this.addMenuButton(800, 800, "nugs", () => {
			console.log("nice");
		});
		this.addMenuButton(1200, 800, "espuma", () => {
			console.log("nice");
		});

		this.nextButton = new NextButton(this);
		this.nextButton.on("click", () => {
			this.startScene("IroningScene");
		});
	}

	update(time: number, delta: number) {
		this.buttons.forEach((button) => {
			button.setScale(1.0 - 0.1 * button.holdSmooth);
		});
		this.nextButton.update(time, delta);
	}

	addMenuButton(x: number, y: number, text: string, callback: () => void) {
		let button = new Button(this, x, y);
		this.buttons.push(button);

		let background = new RoundRectangle(this, {
			width: 200,
			height: 100,
			color: 0xffff00,
		});
		button.add(background);

		let label = this.addText({
			text,
			color: "black",
		});
		label.setOrigin(0.5);
		button.add(label);

		button.bindInteractive(background);
		button.on("click", callback);
	}
}
