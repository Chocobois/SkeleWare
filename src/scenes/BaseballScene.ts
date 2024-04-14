import { BaseScene } from "./BaseScene";
import { NextButton } from "@/components/NextButton";
import { TextButton } from "@/components/TextButton";
import { BasicEffect } from "@/components/elements/BasicEffect";
import { QTEButton } from "@/components/elements/QTEButton";

export class BaseballScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private nextButton: NextButton;
	private battingDisplay: Phaser.GameObjects.Sprite; // displays the bar thingy that you use to bat
	private pitcher: Phaser.GameObjects.Sprite;
	private batter: Phaser.GameObjects.Sprite;
	private ballSprite: BasicEffect;
	private QTEBar: Phaser.GameObjects.Sprite;
	private boneBat: Phaser.GameObjects.Sprite;
	private battingButton: TextButton;
	private tAdvance: number = 0;
	private flavorText: Phaser.GameObjects.Text;
	private textList1: string[] = ["Ready!", "Set!", "GO!"];
	private velocity: number = 0.4;//screens per second
	private targetWidth: 0.2; //% of screen
	private boneStopped: boolean =  false;
	private hitAreaDisplay: Phaser.GameObjects.Graphics;
	private runningControlDisplay: Phaser.GameObjects.Graphics;
	private runningText: Phaser.GameObjects.Text;
	private hitCenter: number = 0.5;
	private hasExploded: boolean = false;
	private hasBall: boolean = false;
	private missState: number = 1;
	private hasSwung: boolean = false;
	private hasHitBall: boolean = false;

	private effects: BasicEffect[] = [];

	private phase: number; // where are we in the game cycle
	private timer: number = 0;
	private tBounceTimer: number = 0;
	private bounceOvershoot: number = 0.2;
	private tBounceTimerMax: number = 500;
	private reverseTimer: number = 0;
	private reverseTimerMax: number = 0;
	private defaultScale: number = 1;
	private batterVelocity: number[] = [0,0];
	private currentBase: number = 1;
	private base_1: number[] = [0.505,0.838];
	private base_2: number[] = [0.203,0.561];
	private base_3: number[] = [0.460,0.294];
	private base_4: number[] = [0.764,0.496];
	private runLoopTimer: number[] = [150, 0];
	private clickEffectDisplay: Phaser.GameObjects.Graphics;
	private clickEffects: number[][] = [];
	private circleAngles: number[] = [0, Math.PI*0.25, Math.PI*0.5, Math.PI*0.75, Math.PI, Math.PI*1.25, Math.PI*1.5, Math.PI*1.75];
	private activeCircle: number = 0;
	private angleColors: number[] = [0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000];
	private circleUpdateTimer: number = 125;
	private glitchTimer: number = 25;
	private cAlpha: number = 1;
	private lagCircleDisplay: Phaser.GameObjects.Graphics;
	private hackyRectangle: Phaser.GameObjects.Rectangle;
	private ballFallen: boolean = false;
	private skellyLag: boolean = false;
	private barPercent: number = 0;

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

		this.QTEBar = this.add.sprite(this.W/2, this.H*0.75, "trackway");
		this.QTEBar.setVisible(false);
		this.hitAreaDisplay = this.add.graphics();
		this.runningControlDisplay = this.add.graphics();
		this.lagCircleDisplay = this.add.graphics();
		this.clickEffectDisplay = this.add.graphics();
		this.boneBat = this.add.sprite(this.W*0.1, this.H*0.75, "bone_bat");
		this.boneBat.setVisible(false);
		this.hackyRectangle = this.add.rectangle(this.CX, this.CY, this.W, this.H, 0, 0.0001);	

		this.hackyRectangle.on("pointerdown", () => {
			if (this.phase == 9) {
				this.timer += 125;
				if(this.timer > 2000)
				{
					this.timer = 2000;
				}
				this.addCircleEffectAtPointer();
			}
		});


		this.flavorText = this.addText({
			x: this.W*0.5,
			y: this.H*0.1,
			size: 100,
			color: "pink",
			text: this.textList1[0],
		});
		this.flavorText.setOrigin(0.5,0.5);
		this.flavorText.setVisible(false);
		this.runningText = this.addText({
			x: this.W*0.5,
			y: this.H*0.75,
			size: 80,
			color: "blue",
			text: "Tap rapidly to run!",
		});
		this.runningText.setOrigin(0.5, 0.5);
		this.runningText.setVisible(false);

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
		this.nextButton.setVisible(false);
		this.nextButton.disableInteractive();
	}

	hitBall(){
		if(this.phase == 4) {
			this.boneStopped = true;
			this.timer = 1000;
			this.battingButton.turnOff();
			this.phase = 5;
			if((this.boneBat.x >= this.hitCenter) && (this.boneBat.x <= (this.hitCenter + (0.2*this.W)))){
				this.sound.play("ball_hit");
				this.missState = 0;
			} else {
				if(this.boneBat.x < this.hitCenter) {
					this.missState = -1;
				} else if ((this.boneBat.x > (this.hitCenter + (0.2*this.W)))) {
					this.missState = 1;
				}
				this.sound.play("ball_miss");
			}
		}
	}

	advanceScene()
	{
		this.startScene("CutsceneScene", {
			textureKey: "7_argument",
			nextScene: "CourtScene",
		});
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

	addCircleEffectAtPointer() {
		let px = this.input.activePointer.x;
		let py = this.input.activePointer.y;

		if(px < 0) {
			px = 0;
		} else if (px > this.W) {
			px = this.W;
		}

		if(py < 0) {
			py = 0;
		} else if (py > this.H) {
			py = this.H;
		}
		
		this.clickEffects.push([250, px, py]);
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
						this.timer = 18000;
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
					if(this.timer <= 0) {
						this.timer = 0;
						this.advanceScene();
					}
				}

				if(this.missState == -1) {
					if((this.timer < 17500) && (this.timer >= 17000)) {
						this.batter.setFrame(1);
					} else if ((this.timer < 17000) && (this.timer >= 16500)) {
						this.batter.setFrame(2);
						if(!this.hasSwung) {
							this.sound.play("ball_miss");
							this.hasSwung = true;
						}
					} else if ((this.timer < 16500) && (this.timer >= 16000)) {
						this.batter.setFrame(0);
					}
				}
				if((this.timer < 15000) && (this.timer >= 14500)) {
					this.pitcher.setFrame(1);
				} else if ((this.timer < 14500) && (this.timer >= 14000)) {
					if(!this.hasBall) {
						this.ballSprite.sp.setVisible(true);
						this.ballSprite.setVelocityY(this.H*0.35);
						//this.effects.push(this.ballSprite);
						this.sound.play("ball_miss");
						this.hasBall = true;
					}
					this.pitcher.setFrame(2);
				} else if (this.timer < 14000) {
					this.pitcher.setFrame(0);
				}

				if(this.missState == 0 && ((this.timer < 15000) && (this.timer >= 14500))) {
					this.batter.setFrame(1);
				} else if (this.missState == 0 && ((this.timer < 12000) && (this.timer >= 11500))) {
					this.batter.setFrame(0);
				}

				if((this.ballSprite.sp.y > (0.763*this.H)) && (this.missState != 0)) {
					if(!this.hasExploded) {
						let mx = new BasicEffect(this, "meme_explosion", this.W*0.505, this.H*0.838, 18, 50, false, 0);
						this.effects.push(mx);
						this.ballSprite.sp.setVisible(false);
						this.batter.setFrame(3);
						this.sound.play("meme_explosion_sound");
						this.hasExploded = true;
						this.timer = 2500;
					}
				} else if ((this.ballSprite.sp.y > (0.763*this.H)) && (this.missState == 0)) {
					this.batter.setFrame(2);
					if(!this.hasHitBall) {
						this.ballSprite.sp.setScale(-1);
						this.ballSprite.setVelocityY(-1*this.H*0.45);
						this.ballSprite.setVelocityX(-1*this.W*0.1);
						this.sound.play("ball_hit");
						this.hasHitBall = true;
						this.phase = 8;
						this.timer = 3000;
					}
					//start spawning running controls
				}
				break;
			} case 8: {
				if(this.timer > 0){
					this.timer -= d;
					if(this.timer <= 0)
					{
						this.timer = 2000;
						this.runningControlDisplay.clear();
						this.runningControlDisplay.fillStyle(0x3f3f40, 1);
						this.runningControlDisplay.fillRect(this.W*0.2, this.H*0.85, this.W*0.6, this.H*0.1);
						this.runningControlDisplay.fillStyle(0xb82500, 0.8);
						this.runningControlDisplay.fillRect(this.W*0.22, this.H*0.86, this.W*0.15, this.H*0.08);
						this.runningControlDisplay.fillStyle(0x7eff33, 0.7);
						this.runningControlDisplay.fillRect(this.W*0.22, this.H*0.86, this.W*0.56, this.H*0.08);
						this.runningText.setVisible(true);
						this.runningText.setAlpha(1);
						this.batterVelocity = [((this.base_2[0]-this.base_1[0])/2), ((this.base_2[1]-this.base_1[1])/2)];
						this.ballSprite.setVelocityX(0);
						this.ballSprite.setVelocityY(0);
						this.hackyRectangle.setInteractive({ useHandCursor: true });
						this.phase = 9;
					}
				}
				//running sequence
				if(this.timer <= 2000)
				{
					this.barPercent = 1;
					if(this.timer > 1000) {
						this.barPercent = 1-((this.timer-1000)/1000);
					} else {
						this.barPercent = 1;
					}
					this.runningControlDisplay.clear();
					this.runningControlDisplay.fillStyle(0x3f3f40, this.barPercent);
					this.runningControlDisplay.fillRect(this.W*0.2, this.H*0.85, this.W*0.6, this.H*0.1);
					this.runningControlDisplay.fillStyle(0xb82500, this.barPercent*0.8);
					this.runningControlDisplay.fillRect(this.W*0.22, this.H*0.86, this.W*0.15, this.H*0.08);
					this.runningControlDisplay.fillStyle(0x7eff33, this.barPercent*0.7);
					this.runningControlDisplay.fillRect(this.W*0.22, this.H*0.86, this.W*0.56, this.H*0.08);

					if ((this.timer <= 1000) && (this.timer >= 0)) {
						this.runningText.setVisible(true);
						this.runningText.setAlpha(1-(this.timer / 1000));
					}
				}
				break;
			} case 9: {
				if(this.timer > 0)
				{
					this.timer -= d;
					this.barPercent = this.timer/2000;
					if(this.timer <= 0) {
						this.timer = 0;
						this.barPercent = 0;
						this.ballSprite.setPosition((this.batter.x+(this.W*0.025)),(this.H*-1*0.025));
						this.ballSprite.sp.setScale(1,1);
						this.batterVelocity = [0,0];
						this.hackyRectangle.disableInteractive();
						this.hackyRectangle.setVisible(false);
						this.lagCircleDisplay.clear();
						this.sound.play("fail_run")
						this.timer = 6000;
						this.phase = 10;
					}
					this.runningControlDisplay.clear();
					this.runningControlDisplay.fillStyle(0x3f3f40, 1);
					this.runningControlDisplay.fillRect(this.W*0.2, this.H*0.85, this.W*0.6, this.H*0.1);
					this.runningControlDisplay.fillStyle(0xb82500, 0.8);
					this.runningControlDisplay.fillRect(this.W*0.22, this.H*0.86, this.W*0.15, this.H*0.08);
					this.runningControlDisplay.fillStyle(0x7eff33, 0.7);
					this.runningControlDisplay.fillRect(this.W*0.22, this.H*0.86, this.W*0.56*this.barPercent, this.H*0.08);
				}
				if(this.runLoopTimer[0] > 0) {
					this.runLoopTimer[0] -= d;
					if(this.runLoopTimer[0] <= 0) {
						if(this.runLoopTimer[1] == 0) {
							this.runLoopTimer[0] = 250;
							this.runLoopTimer[1] = 1;
							this.batter.setFrame(5);
						} else if (this.runLoopTimer[1] == 1) {
							this.runLoopTimer[0] = 250;
							this.runLoopTimer[1] = 0;
							this.batter.setFrame(4);
						}
					}
				}
				this.processBaseRunning(d);
				break;
			} case 10: {
				//this.runningText.setText("TESTING: " + this.glitchTimer);
				if(this.timer > 0) {
					this.timer -= d;
					if((this.timer <= 6000) && (this.timer > 5500))
					{
						this.runningControlDisplay.setAlpha((this.timer-5500)/500);
						this.runningText.setAlpha((this.timer-5500)/500);	
					} else {
						this.runningControlDisplay.setVisible(false);
						this.runningText.setVisible(false);
					}
					if(this.timer <= 4000) {
						if (!this.ballFallen) {
							this.ballSprite.setVelocityX(2*(this.batter.x-this.ballSprite.sp.x));
							this.ballSprite.setVelocityY(2*(this.batter.y-this.ballSprite.sp.y));
							this.ballSprite.sp.setVisible(true);
							this.ballFallen = true;
						}
						if((this.ballSprite.sp.y >= this.batter.y) || (this.ballSprite.sp.x < this.batter.x)) {
							if(!this.hasExploded) {
								let mx = new BasicEffect(this, "meme_explosion", this.batter.x, this.batter.y, 18, 50, false, 0);
								this.effects.push(mx);
								this.ballSprite.sp.setVisible(false);
								this.ballSprite.setPosition(0,0);
								this.ballSprite.stopMovement();
								this.batter.setFrame(3);
								this.sound.play("meme_explosion_sound");
								this.hasExploded = true;
								this.timer = 2500;
							}
						}
					}
					if((this.timer <= 5500) && (this.timer > 3450)) {
						if(!this.skellyLag) {
							this.sound.play("lag_sound");
							this.skellyLag = true;
						}

						if((this.timer < 4500) && (this.timer >= 3500)) {
							this.cAlpha = (this.timer-3500)/1000;
						} else if (this.timer < 3500){ 
							this.cAlpha = 0;
						}

						if((this.circleUpdateTimer > 0)){
							this.circleUpdateTimer -= d;
							if(this.circleUpdateTimer <= 0) {
								this.circleUpdateTimer = 125;
								this.activeCircle++;
								if(this.activeCircle >= this.circleAngles.length) {
									this.activeCircle = 0;
								}
							}
							this.drawLagCircles();
						}

					}
					if(this.timer < 0) {
						this.timer = 0;
						this.advanceScene();
					}
				}
				if((this.glitchTimer > 0) && (this.timer < 5500)) {
					this.glitchTimer -= d;
					if(this.glitchTimer <= 0) {
						this.glitchTimer = 25;
						let t = Math.trunc(Math.random()*4.99999);
						if(!this.hasExploded){
							switch(t) {
								case 0: {
									this.batter.setFrame(0);
									break;
								} case 1: {
									this.batter.setFrame(1);
									break;
								} case 2: {
									this.batter.setFrame(2);
									break;
								} case 3: {
									this.batter.setFrame(4);
									break;
								} case 4: {
									this.batter.setFrame(5);
									break;
								}
							}
						}
					}
				}
				break;
			} case 11: {
				if(this.timer > 0) {
					this.timer -=d;
					if(this.timer <= 0) {
						this.timer = 0;
						this.advanceScene();
					}

					if((this.timer <= 4000) && (this.timer > 3750)) {
						this.lagCircleDisplay.clear();
						this.lagCircleDisplay.setVisible(true);
						this.lagCircleDisplay.lineStyle(this.W*0.025, (0xFFFF00 - (0x3cFF00*0*(this.timer-3750)/250)));
						this.lagCircleDisplay.setAlpha((this.timer-3750)/250);
						this.lagCircleDisplay.beginPath();
						this.lagCircleDisplay.arc(this.batter.x, this.batter.y, this.W*0.25*(1-((this.timer-3750)/250)), 0, 360, false, 0.001)
						this.lagCircleDisplay.strokePath();
						this.lagCircleDisplay.closePath();
					}

					if((this.timer <= 4000) && (this.timer > 3500))
					{
						let v = (this.timer-3500)/500;
						this.runningControlDisplay.clear();
						this.runningControlDisplay.fillStyle(0x3f3f40, v);
						this.runningControlDisplay.fillRect(this.W*0.2, this.H*0.85, this.W*0.6, this.H*0.1);
						this.runningControlDisplay.fillStyle(0xb82500, v*0.8);
						this.runningControlDisplay.fillRect(this.W*0.22, this.H*0.86, this.W*0.15, this.H*0.08);
						this.runningControlDisplay.fillStyle(0x7eff33, v*0.7);
						this.runningControlDisplay.fillRect(this.W*0.22, this.H*0.86, this.W*0.56*this.barPercent, this.H*0.08);

						this.runningText.setAlpha(v);
					} else if (this.timer <= 3500) {
						this.runningControlDisplay.clear();
						this.runningControlDisplay.setVisible(false);
						this.runningText.setVisible(false);
					}

					if(this.timer < 2500) {
						if(!this.ballFallen) {
							this.ballSprite.setPosition(this.pitcher.x+(this.W*0.025), this.H*-1*0.025);
							this.ballSprite.setVelocityX(2*(this.pitcher.x-this.ballSprite.sp.x));
							this.ballSprite.setVelocityY(2*(this.pitcher.y-this.ballSprite.sp.y));
							this.ballSprite.sp.setVisible(true);
							this.ballSprite.sp.setScale(1,1);
							this.ballFallen = true;
						}
						if((this.ballSprite.sp.y >= this.pitcher.y) || (this.ballSprite.sp.x < this.pitcher.x)) {
							if(!this.hasExploded) {
								let mx = new BasicEffect(this, "meme_explosion", this.pitcher.x, this.pitcher.y, 18, 50, false, 0);
								this.effects.push(mx);
								this.ballSprite.sp.setVisible(false);
								this.ballSprite.setPosition(0,0);
								this.ballSprite.stopMovement();
								this.pitcher.setFrame(3);
								this.sound.play("meme_explosion_sound");
								this.hasExploded = true;
							}
						}
					}

				}
			}
		}
	}

	drawLagCircles()
	{
		this.angleColors = [0x000000,0x000000,0x000000,0x000000,0x000000,0x000000,0x000000,0x000000];
		let colorx = [0xFFFFFF, 0xC9C9C9, 0x808080, 0x474747];
		let t = this.activeCircle;
		for(let i = 0; i < 4; i++) {
			t = this.activeCircle - i;
			if(t < 0) {
				t += 8;
			}
			this.angleColors[t] = colorx[i];
		}

		this.lagCircleDisplay.clear();
		
		for(let n = 0; n < (this.circleAngles.length); n++) {
			this.lagCircleDisplay.fillStyle(this.angleColors[n], this.cAlpha);
			this.lagCircleDisplay.fillCircle((this.batter.x+(this.W*0.02*Math.cos(this.circleAngles[n]))), (this.batter.y+this.H*-0.125+(this.W*0.02*Math.sin(this.circleAngles[n]))), this.W*0.005);
		}

		//this.lagCircleDisplay.fillStyle(0x000000, 1);
		//this.lagCircleDisplay.fillCircle(this.batter.x, this.batter.y, 60);

	}

	updatePhaseTimer(d: number){
		if(this.timer > 0) {
			this.timer -= d;
		}
	}

	processBaseRunning(d: number){
		let px = this.batter.x;
		let py = this.batter.y;
		
		if(this.currentBase < 5)
		{
			px += (this.batterVelocity[0]*this.W*(d/1000));
			py += (this.batterVelocity[1]*this.H*(d/1000));
		}

		switch (this.currentBase) {
			case 1: {
				if((px <= (this.base_2[0]*this.W)) || (py <= (this.base_2[1])*this.H)) {
					this.batter.setX(this.base_2[0]*this.W);
					this.batter.setY(this.base_2[1]*this.H);
					this.batterVelocity = [((this.base_3[0]-this.base_2[0])/2),((this.base_3[1]-this.base_2[1])/2)];
					this.batter.setScale(-1, 1);
					this.currentBase = 2;
				} else {
					this.batter.setX(px);
					this.batter.setY(py);
				}
				break;
			} case 2: {
				if((px >= (this.base_3[0]*this.W)) || (py <= (this.base_3[1]*this.H))) {
					this.batter.setX(this.base_3[0]*this.W);
					this.batter.setY(this.base_3[1]*this.H);
					this.batterVelocity = [((this.base_4[0]-this.base_3[0])/2),((this.base_4[1]-this.base_3[1])/2)];
					this.currentBase = 3;
				} else {
					this.batter.setX(px);
					this.batter.setY(py);
				}
				break;
			} case 3: {
				if((px >= (this.base_4[0]*this.W)) || (py >= (this.base_4[1]*this.H))) {
					this.batter.setX(this.base_4[0]*this.W);
					this.batter.setY(this.base_4[1]*this.H);
					this.batterVelocity = [((this.base_1[0]-this.base_4[0])/2),((this.base_1[1]-this.base_4[1])/2)];
					this.batter.setScale(1, 1);
					this.currentBase = 4;
				} else {
					this.batter.setX(px);
					this.batter.setY(py);
				}
				break;
			} case 4: {
				if((px <= (this.base_1[0]*this.W)) || (py >= (this.base_1[1]*this.H))) {
					this.batter.setX(this.base_1[0]*this.W);
					this.batter.setY(this.base_1[1]*this.H);
					this.batterVelocity = [0,0];
					this.currentBase = 5;
					this.batter.setFrame(6);
					this.sound.play("memescream");
					this.phase = 11; //skip to win condition
					this.timer = 4000;
				} else {
					this.batter.setX(px);
					this.batter.setY(py);
				}
			} case 5: {
				break;
			}
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
						let r = (0.15+(Math.random()*0.5))*this.W;
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
			} case 8: {
				break;
			} case 9: {
				break;
			} case 10: {
				break;
			} case 11: {
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

	onPointerUp(pointer: Phaser.Input.Pointer){
		if(this.phase == 9) {
			this.timer += 100;
			if(this.timer >= 2000) {
				this.timer = 2000;
			}
		}
	}

	processClickEffects(d: number) {
		this.clickEffectDisplay.clear();
		let xflag = false;
		for (let i = 0; i < this.clickEffects.length; i++) {
			this.clickEffects[i][0] -=d;
			if(this.clickEffects[i][0] < 0) {
				this.clickEffects[i][0] = 0;
				xflag = true;
			}
			this.clickEffectDisplay.fillStyle(0xFFFFFF,this.clickEffects[i][0]/250);
			this.clickEffectDisplay.fillCircle(this.clickEffects[i][1], this.clickEffects[i][2], this.W*0.125*(1-(this.clickEffects[i][0]/250)));
		}
		if(xflag) {
			this.clickEffects.shift();
		}
	}

	update(time: number, delta: number) {
		const pointer = this.input.activePointer;
		this.processPhase(delta);
		this.processClickEffects(delta);
		this.nextButton.update(time, delta);
		this.updateEffects(delta);
		if(this.phase == 4) {
			this.updateBonePosition(delta);
		}
		this.processBounce(delta);
	}
}
