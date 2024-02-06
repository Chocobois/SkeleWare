import { BaseScene } from "./BaseScene";
import { NextButton } from "@/components/NextButton";
import { QTEButton } from "@/components/elements/QTEButton";

export class BaseballScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private nextButton: NextButton;
	private chainCounter: number; // how many clicks to get a chain;
	private chainLevel: number;
	private maxChain: number = 2;
	private chainMultipliers: number[] = [2, 4];
	private battingDisplay: Phaser.GameObjects.Graphics; // displays the bar thingy that you use to bat
	private effectHandler: Phaser.GameObjects.Graphics; // handles the zoomy lines and such

	private runningMeters: Phaser.GameObjects.Graphics; //dials and things like that for how much you ran
	private runningDisplay: Phaser.GameObjects.Graphics;

	private skellies: Phaser.GameObjects.Container;
	private pitcher: Phaser.GameObjects.Sprite;
	private batter: Phaser.GameObjects.Sprite;
	private QTEBar: Phaser.GameObjects.Sprite;

	private phase: number; // where are we in the game cycle
	private timer: number = 0;

	constructor() {
		super({ key: "BaseballScene" });
	}

	initiateScene() {} //play intro speech and time QTE
	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x67e8f9);

		this.background = this.add.image(this.CX, this.CY, "baseball_background");

		this.runningMeters = this.add.graphics();
		this.runningDisplay = this.add.graphics();
		this.QTEBar = this.add.sprite(0, 0, "trackway");
		this.QTEBar.setVisible(false);

		this.nextButton = new NextButton(this);
		this.nextButton.on("click", () => {
			this.startScene("CutsceneScene", {
				textureKey: "7_argument",
				nextScene: "CourtScene",
			});
		});
	}

	updatePhaseTimer(d: number) {
		this.timer -= d;
	}

	update(time: number, delta: number) {
		this.nextButton.update(time, delta);
	}
}
