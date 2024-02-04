import { BaseScene } from "./BaseScene";
import { NextButton } from "@/components/NextButton";

export class CutsceneScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private nextButton: NextButton;

	constructor() {
		super({ key: "CutsceneScene" });
	}

	create({
		textureKey,
		nextScene,
	}: {
		textureKey: string;
		nextScene: string;
	}): void {
		console.log(textureKey, nextScene);
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x222222);

		this.background = this.add.image(this.CX, this.CY, textureKey);

		if (!this.textures.exists(textureKey)) {
			let text = this.addText({
				x: this.CX,
				y: this.CY,
				size: 40,
				text: "Missing cutscene!\nGo to previous scene and add:\nstartScene({ textureKey: ..., nextScene: ... })",
				color: "white",
			});
			text.setOrigin(0.5);
			text.setWordWrapWidth(0.75 * this.W);
		}

		this.nextButton = new NextButton(this);
		this.nextButton.on("click", () => {
			console.log("OnClick");
			this.startScene(nextScene);
		});
	}

	update(time: number, delta: number) {
		this.nextButton.update(time, delta);
	}
}
