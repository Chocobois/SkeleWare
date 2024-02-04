import { NextButton } from "@/components/NextButton";
import { BaseScrubScene } from "@/scenes/BaseScrubScene";

export class PolishScene extends BaseScrubScene {
	private background: Phaser.GameObjects.Image;
	private shoe: Phaser.GameObjects.Image;
	private sparkles: Phaser.GameObjects.Image;
	private tool: Phaser.GameObjects.Image;
	private text: Phaser.GameObjects.Text;

	private nextButton: NextButton;

	constructor() {
		super({ key: "PolishScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x67e8f9);

		/* Objects */

		this.background = this.add.image(this.CX, this.CY, "polish_background");

		this.shoe = this.add.image(this.CX, this.CY, "polish_shoe");

		this.initDynamicTexture({
			textureKey: "polish_dirt",
			brushKey: "soft_brush",
			centerX: this.CX,
			centerY: this.CY,
			// debug: true,
		});

		this.sparkles = this.add.image(this.CX, this.CY, "polish_sparkles");
		this.sparkles.setVisible(false);

		this.tool = this.add.image(300, 800, "polish_brush");

		this.text = this.addText({
			x: this.CX,
			y: 0,
			size: 60,
			text: "Do the polish!",
			color: "black",
		});
		this.text.setOrigin(0.5, 0.0);

		this.nextButton = new NextButton(this);
		this.nextButton.on("click", () => {
			this.startScene("CutsceneScene", {
				textureKey: "4_shoes",
				nextScene: "ComputerScene",
			});
		});
	}

	update(time: number, delta: number) {
		// this.dirt.setAlpha(0.5 + 0.5 * Math.sin((4 * time) / 1000));

		this.sparkles.setScale(1.0 + 0.05 * Math.sin((8 * time) / 1000));

		this.nextButton.update(time, delta);
	}

	onPointerMove(pointer: Phaser.Input.Pointer) {
		super.onPointerMove(pointer);
		if (pointer.isDown && !this.isComplete) {
			this.tool.setPosition(pointer.x, pointer.y);
		}
	}

	onPointerDown(pointer: Phaser.Input.Pointer) {
		super.onPointerMove(pointer);
		if (pointer.isDown && !this.isComplete) {
			this.tweens.add({
				targets: this.tool,
				x: pointer.x,
				y: pointer.y,
				duration: 120,
				ease: "Quart",
			});
		}
	}

	onComplete(): void {
		this.sparkles.setVisible(true);

		this.tweens.add({
			targets: this.tool,
			duration: 1000,
			ease: "Cubic",
			x: { from: this.tool.x, to: 300 },
			y: { from: this.tool.y, to: 800 },
		});

		// setTimeout(() => {
		// 	this.startScene("DrivethruScene");
		// }, 800);
	}
}
