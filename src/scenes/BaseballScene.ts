import { BaseScene } from "./BaseScene";
import { NextButton } from "@/components/NextButton";
import { QTEButton } from "@/components/elements/QTEButton";

export class BaseballScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private nextButton: NextButton;
	private chainCounter: number; // how many clicks to get a chain;
	private chainLevel: number;
	private maxChain: number = 2;
	private chainMultipliers: number[] = [2,4];
	private battingDisplay: Phaser.GameObjects.Sprite; // displays the bar thingy that you use to bat
	private effectHandler: Phaser.GameObjects.Graphics; // handles the zoomy lines and such

	private runningMeters: Phaser.GameObjects.Graphics; //dials and things like that for how much you ran
	private runningDisplay: Phaser.GameObjects.Graphics;

	private skellies: Phaser.GameObjects.Container;
	private pitcher: Phaser.GameObjects.Sprite;
	private batter: Phaser.GameObjects.Sprite;
	private QTEBar: Phaser.GameObjects.Sprite;

	private phase: number; // where are we in the game cycle
	private timer: number = 0;
	private tBounceTimer: number = 0;
	private bounceOvershoot: number = 0.1;
	private tBounceTimerMax: number = 500;
	private reverseTimer: number = 0;
	private reverseTimerMax: number = 0;
	private defaultScale: number = 1;

	constructor() {
		super({ key: "BaseballScene" });
		this.runningMeters = this.add.graphics();
		this.runningDisplay = this.add.graphics();
		this.QTEBar = this.add.sprite(0,0,"trackway");
		this.QTEBar.setVisible(false);
		
		this.timer = 0;
		this.phase = 0;

	}
	
	spawnQTEBounce(t: number, r: number, s: number)
	{
		this.QTEBar.setScale(0.0001);
		this.tBounceTimerMax = t;
		this.tBounceTimer = this.tBounceTimerMax;
		this.reverseTimerMax = r;
		this.defaultScale = s;
	}

	initiateScene() //play intro speech and time QTE
	{
		this.sound.play("announcer_q");
		this.timer = 6000;

	}
	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x67e8f9);

		this.background = this.add.image(this.CX, this.CY, "baseball_background");
		this.battingDisplay = this.add.sprite(this.W/2,this.H*0.75,"trackway");
		this.battingDisplay.setVisible(false);

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

	processPhase(ph: number, d: number){
		switch(ph) {
			case 0:{
				this.initiateScene();
				this.phase = 1;
				break;
			}
			case 1: {
				if(this.timer > 0)
				{
					this.timer -= d;
					if (this.timer <= 0) {
						this.timer = 0;
						this.spawnQTEBounce(550,50,1.0);
					}
				}
			}
		}
	}

	updatePhaseTimer(d: number){
		if(this.timer > 0) {
			this.timer -= d;
		}
	}

	processBounce(d: number)
	{
		if(this.tBounceTimer > 0)
		{
			this.tBounceTimer -= d;
			if (this.tBounceTimer <= 0)
			{
				this.tBounceTimer = 0;
				this.reverseTimer = this.reverseTimerMax;
			}
			this.QTEBar.setScale((this.defaultScale+this.bounceOvershoot)*(1-(this.tBounceTimer/this.tBounceTimerMax)));
		} else if (this.reverseTimer > 0)
		{
			if(this.reverseTimer <= 0)
			{
				this.reverseTimer = 0;
				this.QTEBar.setScale(this.defaultScale);
			} else {
				this.QTEBar.setScale(this.defaultScale+(this.bounceOvershoot*(this.reverseTimer/this.reverseTimerMax)));
			}
		}
	}

	update(time: number, delta: number) {
		this.nextButton.update(time, delta);
		this.processBounce(delta);
	}
}
