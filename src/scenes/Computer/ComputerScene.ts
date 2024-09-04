import { BaseScene } from "../BaseScene";
import { NextButton } from "@/components/NextButton";
import { Button } from "@/components/elements/Button";
import { PopupWindow } from "./PopupWindow";
import { DoubleClickButton } from "@/components/DoubleClickButton";
import { BasicEffect } from "@/components/elements/BasicEffect";
import { Instructions } from "@/components/Instructions";

export class ComputerScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private overlay: Phaser.GameObjects.Image;
	private nextButton: NextButton;

	private exp: BasicEffect;

	private pState: number = 0;
	private debugUI: Phaser.GameObjects.Image;
	private debugBar: Phaser.GameObjects.Sprite;
	private numPopups: number = 0;
	private timer: number = 0;
	private burst: number = 0;
	private nburst: number = 0;
	private acc: number = 0;
	private maxPopups: number = 20;
	private antivirus: DoubleClickButton;
	private totalPopups: number = 0;
	private instructions: Instructions;

	private proceedTimer: number = 0;

	constructor() {
		super({ key: "ComputerScene" });
	}

	spawnPopup(){
		if((this.proceedTimer > 0) || (this.pState > 0)){
			return;
		}
		let popup = new PopupWindow(this, 0, 0);
		popup.setRandomPosition(
			410 + popup.width,
			160,
			1520 - 410 - popup.width,
			770 - 160 - popup.height);
		popup.on("notify", this.notify, this);
		this.add.existing(popup);
	}

	double(){
		if(this.numPopups < 30) {
			this.spawnPopup();
		}
		if(this.numPopups < 30) {
			this.spawnPopup();
		}
		return;
	}

	notify(n: number){
		if(n == 0) {
			this.numPopups++;
			this.totalPopups++;
			return;
		}
		if(n == 1) {
			this.numPopups--;
			return;
		}
		if(n == 2) {
			this.double();
			return;
		}
		if(n == 4) {
			this.instructions.destroy();
			this.debugUI.setVisible(true);
			this.debugBar.setVisible(true);
			this.proceedTimer = 9500;
			return;
		}

	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x67e8f9);

		this.background = this.add.image(this.CX, this.CY, "computer_background");
		this.overlay = this.add.image(this.CX, this.CY, "computer_overlay");
		this.overlay.setDepth(5);
		this.input.on("pointerdown", this.onPointerDown, this);


		this.antivirus = new DoubleClickButton(this,584,650,"antivirus");
		this.add.existing(new PopupWindow(this,794,450,2));

		this.debugUI = new Phaser.GameObjects.Image(this,986,496,"debugwindow");
		this.debugUI.setOrigin(0.5,0.5);
		this.debugUI.setDepth(3);
		this.debugUI.setVisible(false);
		this.add.existing(this.debugUI);
		
		this.debugBar = new Phaser.GameObjects.Sprite(this,986,386,"progressbar");
		this.debugBar.setOrigin(0.5,0.5);
		this.debugBar.setDepth(4);
		this.debugBar.setVisible(false);
		this.add.existing(this.debugBar);

		this.exp = new BasicEffect(this, "meme_explosion", this.W*0.505, this.H*0.838, 18, 50, false, 0, 15);
		this.exp.sp.setDepth(6);
		this.exp.hide();

		this.numPopups = 0;
		this.totalPopups = 0;
		this.burst = 7;
		this.timer = 200;
		this.nburst = 0;
		this.acc = 0;
		this.maxPopups = 25;

		this.instructions = new Instructions(this, "Start the antivirus");

		this.nextButton = new NextButton(this);
		this.nextButton.setVisible(false);
		this.nextButton.on("click", () => {
			this.startScene("CutsceneScene", {
				textureKey: "5_package",
				nextScene: "IroningScene",
			});
		});
	}

	update(time: number, delta: number) {
		this.nextButton.update(time, delta);

		if(this.proceedTimer > 0) {
			this.parseProgress(delta);
		} else {
			this.parsePopups(delta);
		}
	}

	parsePopups(delta: number){
		if(this.totalPopups < this.maxPopups) {
			if(this.timer > 0) {
				this.timer -= delta;
				if(this.timer <= 0) {
					this.timer = 0;
					this.spawnPopup();
					if(this.burst > 0){
						this.burst--;
						this.timer = 125+Math.trunc(Math.random()*175);
					} else if (this.burst <= 0) {
						if((Math.random()*1) < this.nburst) {
							this.acc = 0;
							this.nburst = 0;
							this.burst = 3 + Math.trunc(Math.random()*3.999);
						} else {
							this.acc++;
							this.nburst += 0.1;
							if(this.acc >= 6) {
								this.nburst = 1;
							}
						}
						this.timer = 800 + Math.trunc(Math.random()*600);
					}
				}
			}
		}
	}

	parseProgress(d: number){
		this.proceedTimer -= d;
		if((this.proceedTimer <= 8000) && (this.pState == 0)) {
			this.debugBar.setFrame(1);
			this.pState = 1;
		} else if ((this.proceedTimer <= 6500) && (this.pState == 1)) {
			this.debugBar.setFrame(2);
			this.pState = 2;
		} else if ((this.proceedTimer <= 5000) && (this.pState == 2)) {
			this.debugBar.setFrame(3);
			this.sound.play("shutdown");
			this.pState = 3;
		} else if ((this.proceedTimer <= 2000) && (this.pState == 3)) {
			this.debugUI.setVisible(false);
			this.debugBar.setVisible(false);
			this.sound.play("meme_explosion_sound");
			this.overlay.setTexture("computer_overlay_burnt");
			this.exp.unhide();
			this.pState = 4;
		}
		if(this.pState == 4) {
			this.exp.update(d);
		}
		if(this.proceedTimer <= 0) {
			this.startScene("CutsceneScene", {
				textureKey: "5_package",
				nextScene: "IroningScene",
			});
		}
	}

	onPointerDown(pointer: Phaser.Input.Pointer) {
		this.sound.play("computer_click", { volume: 1 });
	}
}
