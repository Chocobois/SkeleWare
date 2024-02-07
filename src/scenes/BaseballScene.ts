import { BaseScene } from "./BaseScene";
import { NextButton } from "@/components/NextButton";
import { TextButton } from "@/components/TextButton";
import { BasicEffect } from "@/components/elements/BasicEffect";
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
	private ballSprite: BasicEffect;
	private QTEBar: Phaser.GameObjects.Sprite;
	private boneBat: Phaser.GameObjects.Sprite;
	private battingButton: TextButton;
	private tAdvance: number = 0;
	private flavorText: Phaser.GameObjects.Text;
	private textList1: string[] = ["Ready!", "Set!", "GO!"];
	private stopBat: boolean = false;
	private velocity: number = 0.4;//screens per second
	private targetWidth: 0.2; //% of screen
	private boneStopped: boolean =  false;
	private hitAreaDisplay: Phaser.GameObjects.Graphics;
	private hitCenter: number = 0.5;
	private hasExploded: boolean = false;
	private hasBall: boolean = false;

	private effects: BasicEffect[] = [];

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
		this.pitcher = this.add.sprite(this.W*0.505, this.H*0.58, "pitcher");
		this.batter = this.add.sprite (this.W*0.505, this.H*0.838, "batter");
		this.ballSprite = new BasicEffect(this, "ball", this.W*0.505, this.H*0.58, 2, 100, true, 0);
		//this.effects[0] = this.ballSprite;
		this.ballSprite.sp.setVisible(false);

		this.runningMeters = this.add.graphics();
		this.runningDisplay = this.add.graphics();
		this.QTEBar = this.add.sprite(this.W/2, this.H*0.75, "trackway");
		this.QTEBar.setVisible(false);
		this.hitAreaDisplay = this.add.graphics();
		this.boneBat = this.add.sprite(this.W*0.1, this.H*0.75, "bone_bat");
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
		if(this.phase == 4) {
			this.boneStopped = true;
			this.timer = 1000;
			this.battingButton.turnOff();
			this.phase = 5;
			if((this.boneBat.x >= this.hitCenter) && (this.boneBat.x <= (this.hitCenter + (0.2*this.W)))){
				this.sound.play("ball_hit");
			} else {
				this.sound.play("ball_miss");
			}
		}
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
			} case 4: {
				break;
			} case 5: {
				if(this.timer > 0) {
					this.timer -= d;
					if(this.timer <= 0) {
						this.timer = 0;
						this.boneBat.setAlpha(0);
						this.phase = 6;
						this.timer = 500;
					} else {
						this.boneBat.setAlpha(this.timer/1000);
					}
				}
				break;
			} case 6: {
				if(this.timer > 0) {
					this.timer -= d;
					if(this.timer <= 0) {
						this.timer = 0;
						this.QTEBar.setAlpha(0);
						this.battingButton.setAlpha(0);
						this.battingButton.setVisible(false);
						this.hitAreaDisplay.clear()
						this.hitAreaDisplay.setVisible(false);
						this.timer = 20000;
						this.phase = 7;
					} else {
						this.QTEBar.setAlpha(this.timer/500);
						this.battingButton.setAlpha(this.timer/500);
						this.hitAreaDisplay.clear();
						this.hitAreaDisplay.fillStyle(0x2F99FF, 0.35*(this.timer/500));
						this.hitAreaDisplay.fillRect(this.hitCenter, this.H*0.65, this.W*0.2, this.H*0.2);
						this.hitAreaDisplay.fillStyle(0x6D2FFF, 0.35*(this.timer/500));	
						this.hitAreaDisplay.fillRect(this.hitCenter, this.H*0.65, this.W*0.05, this.H*0.2);
						this.hitAreaDisplay.fillRect(this.hitCenter+(0.15*this.W), this.H*0.65, this.W*0.05, this.H*0.2);
					}
				}
				break;
			} case 7: {
				if(this.timer > 0) {
					this.timer -= d;
				}
				if((this.timer < 15000) && (this.timer >= 14500)) {
					this.pitcher.setFrame(1);
				} else if ((this.timer < 14500) && (this.timer >= 14000)) {
					if(!this.hasBall) {
						this.ballSprite.sp.setVisible(true);
						this.ballSprite.setVelocityY(this.H*0.25);
						//this.effects.push(this.ballSprite);
						this.sound.play("ball_miss");
						this.hasBall = true;
					}
					this.pitcher.setFrame(2);
				} else if (this.timer < 14000) {
					this.pitcher.setFrame(0);
				}

				if((this.ballSprite.sp.y > (0.763*this.H)) && !this.hasExploded) {
					let mx = new BasicEffect(this, "meme_explosion", this.W*0.505, this.H*0.838, 18, 50, false, 0);
					this.effects.push(mx);
					this.ballSprite.sp.setVisible(false);
					this.batter.setFrame(3);
					this.sound.play("meme_explosion_sound");
					this.hasExploded = true;
				}

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
						let r = (0.15+(1*0.5))*this.W;
						//let r = 0.5*this.W;
						this.hitCenter = r;
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
							this.hitAreaDisplay.clear();
							this.hitAreaDisplay.fillStyle(0x2F99FF, 0.35);
							this.hitAreaDisplay.fillRect(this.hitCenter, this.H*0.65, this.W*0.2, this.H*0.2);
							this.hitAreaDisplay.fillStyle(0x6D2FFF, 0.35);	
							this.hitAreaDisplay.fillRect(this.hitCenter, this.H*0.65, this.W*0.05, this.H*0.2);
							this.hitAreaDisplay.fillRect(this.hitCenter+(0.15*this.W), this.H*0.65, this.W*0.05, this.H*0.2);
							this.phase = 4;
						}
					} else {
						this.flavorText.setAlpha(this.tBounceTimer/this.tBounceTimerMax);
						if(this.tAdvance == 2)
						{
							this.hitAreaDisplay.clear();
							this.hitAreaDisplay.fillStyle(0x2F99FF, 0.35*(1-(this.tBounceTimer/this.tBounceTimerMax)));
							this.hitAreaDisplay.fillRect(this.hitCenter, this.H*0.65, this.W*0.2, this.H*0.2);
							this.hitAreaDisplay.fillStyle(0x6D2FFF, 0.35*(1-(this.tBounceTimer/this.tBounceTimerMax)));	
							this.hitAreaDisplay.fillRect(this.hitCenter, this.H*0.65, this.W*0.05, this.H*0.2);
							this.hitAreaDisplay.fillRect(this.hitCenter+(0.15*this.W), this.H*0.65, this.W*0.05, this.H*0.2);
						}
					}
				}
				break;
			} case 4: {
				break;
			} case 5: {
				break;
			} case 6: {
				break;
			} case 7: {
				break;
			}
		}

	}

	updateEffects(d: number){
		for(let i = 0; i < this.effects.length; i++) {
			this.effects[i].update(d);
		}
		this.ballSprite.update(d);
	}

	updateBonePosition(d: number)
	{
		this.boneBat.setX(this.boneBat.x+((this.W*this.velocity)*d/1000));
		if(this.boneBat.x >= this.W*0.9) {
			this.boneBat.x = this.W*0.9;
			this.timer = 1000;
			this.phase = 5;
		}
	}

	update(time: number, delta: number) {
		this.processPhase(delta);
		this.nextButton.update(time, delta);
		this.updateEffects(delta);
		if(this.phase == 4) {
			this.updateBonePosition(delta);
		}
		this.processBounce(delta);
	}
}
