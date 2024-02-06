import { BaseScene } from "./BaseScene";
import { NextButton } from "@/components/NextButton";
import { TextButton } from "@/components/TextButton";
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
	private boneBat: Phaser.GameObjects.Sprite;
	private battingButton: TextButton;
	private tAdvance: number = 0;
	private flavorText: Phaser.GameObjects.Text;
	private textList1: string[] = ["Ready!", "Set!", "GO!"];
	private stopBat: boolean = false;
	private velocity: 400;


	private phase: number; // where are we in the game cycle
	private timer: number = 0;
	private tBounceTimer: number = 0;
	private bounceOvershoot: number = 0.2;
	private tBounceTimerMax: number = 500;
	private reverseTimer: number = 0;
	private reverseTimerMax: number = 0;
	private defaultScale: number = 1;

	constructor() {
		super({ key: "BaseballScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x67e8f9);

		this.background = this.add.image(this.CX, this.CY, "baseball_background");
		this.battingDisplay = this.add.sprite(this.W/2,this.H/2,"trackway");
		this.battingDisplay.setVisible(false);

		this.runningMeters = this.add.graphics();
		this.runningDisplay = this.add.graphics();
		this.QTEBar = this.add.sprite(this.W/2, this.H*0.75, "trackway");
		this.QTEBar.setVisible(false);
		this.boneBat = this.add.sprite(this.W*0.2, this.H*0.75, "bone_bat");
		this.boneBat.setVisible(false);

		this.flavorText = this.addText({
			x: this.W*0.5,
			y: this.H*0.1,
			size: 100,
			color: "pink",
			text: this.textList1[0],
		});
		this.flavorText.setOrigin(0.5,0.5);
		this.flavorText.setVisible(false);
		this.timer = 0;
		this.phase = 0;
		this.battingButton = new TextButton(this,this.W/2,this.H*0.4, "Swing!","batting_button");
		this.battingButton.on("click", () => {
			this.hitBall();
		});
		this.battingButton.setVisible(false);
		this.battingButton.turnOff();
		this.nextButton = new NextButton(this);
		this.nextButton.on("click", () => {
			this.startScene("CutsceneScene", {
				textureKey: "7_argument",
				nextScene: "CourtScene",
			});
		});
	}

	hitBall(){

	}

	spawnQTEBounce(t: number, r: number, s: number)
	{
		this.QTEBar.setScale(0.0001);
		this.tBounceTimerMax = t;
		this.tBounceTimer = this.tBounceTimerMax;
		this.reverseTimerMax = r;
		this.defaultScale = s;
		this.QTEBar.setVisible(true);
	}

	spawnBattingControls(t: number, s:number) {
		this.boneBat.scaleY = 0.0001;
		this.battingButton.scaleY = 0.0001
		this.tBounceTimerMax = t;
		this.tBounceTimer = this.tBounceTimerMax;
		this.defaultScale = s;
		this.boneBat.setVisible(true);
		this.battingButton.setVisible(true);
	}

	initiateScene() //play intro speech and time QTE
	{
		this.sound.play("announcer_q");
		this.timer = 6000;

	}

	processPhase(d: number){
		switch(this.phase) {
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
						this.spawnQTEBounce(360,120,1.0);
					}
				}
			}
			case 2: {
				break;
			}
			case 3: {

				break;
			}
		}
	}

	updatePhaseTimer(d: number){
		if(this.timer > 0) {
			this.timer -= d;
		}
	}

	processBounce(d: number) //THIS WILL ADVANCE PHASE WHEN IT COMPLETES!!!
	{
		switch(this.phase)
		{
			case 1: {
				if(this.tBounceTimer > 0)
				{
					this.tBounceTimer -= d;
					if (this.tBounceTimer <= 0)
					{
						this.tBounceTimer = 0;
						this.reverseTimer = this.reverseTimerMax;
						this.QTEBar.setScale(this.defaultScale+this.bounceOvershoot);
					} else {
						this.QTEBar.setScale((this.defaultScale+this.bounceOvershoot)*(1-(this.tBounceTimer/this.tBounceTimerMax)));
					}
				} else if (this.reverseTimer > 0) {
					this.reverseTimer -= d;
					if(this.reverseTimer <= 0)
					{
						this.reverseTimer = 0;
						this.QTEBar.setScale(this.defaultScale);
						this.tBounceTimer = 0;
						this.spawnBattingControls(500, 1);
						this.phase = 2;
					} else {
						this.QTEBar.setScale(this.defaultScale+(this.bounceOvershoot*(this.reverseTimer/this.reverseTimerMax)));
					}
				}
				break;
			}
			case 2: {
				if(this.tBounceTimer > 0) {
					this.tBounceTimer -= d;
					if (this.tBounceTimer <= 0) {
						this.tBounceTimer = 1000;
						this.boneBat.scaleY = this.defaultScale;
						this.battingButton.scaleY = this.defaultScale;
						this.tBounceTimerMax = 1000;
						this.flavorText.setAlpha(1);
						this.flavorText.setVisible(true);
						this.phase = 3;
					}
					 else {
						this.boneBat.scaleY = this.defaultScale*(1-(this.tBounceTimer/this.tBounceTimerMax));
						this.battingButton.scaleY = this.defaultScale*(1-(this.tBounceTimer/this.tBounceTimerMax));
					}
				}
				break;
			}
			case 3: {
				if(this.tBounceTimer > 0) {
					this.tBounceTimer -= d;
					if(this.tBounceTimer <= 0) {
						this.tBounceTimer = 0;
						if(this.tAdvance < 2) {
							this.tAdvance++;
							this.flavorText.setText(this.textList1[this.tAdvance]);
							this.flavorText.setAlpha(1);
							this.tBounceTimer = 1000;
						} else {
							this.flavorText.setVisible(false);
							this.flavorText.setAlpha(1);
							this.tAdvance = 0;
							this.tBounceTimer = 0;
							this.battingButton.turnOn();
							this.phase = 4;
						}
					} else {
						this.flavorText.setAlpha(this.tBounceTimer/this.tBounceTimerMax);
					}
				}
			}
		}

	}

	update(time: number, delta: number) {
		this.processPhase(delta);
		this.nextButton.update(time, delta);
		this.processBounce(delta);
	}
}
