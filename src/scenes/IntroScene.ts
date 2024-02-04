import { BaseScene } from "./BaseScene";
import { NextButton } from "@/components/NextButton";

export class IntroScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private nextButton: NextButton;

	constructor() {
		super({ key: "IntroScene" });
	}

	create() {
		this.fade(false, 5000, 0x000000);
		this.cameras.main.setBackgroundColor(0x222222);

		this.background = this.add.image(0, 0, "1_intro");
		this.background.setOrigin(0);

		this.addEvent(2000, () => {
			this.tweens.add({
				targets: this.background,
				y: { from: 0, to: -this.H },
				ease: "Cubic.InOut",
				duration: 5000,
			});
		});

		this.nextButton = new NextButton(this);
		this.nextButton.on("click", () => {
			this.startScene("CutsceneScene", {
				textureKey: "2_dig",
				nextScene: "DigScene",
			});
		});
	}

	update(time: number, delta: number) {
		this.nextButton.update(time, delta);
	}
}
