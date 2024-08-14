import { BaseScene } from "../BaseScene";
import { NextButton } from "@/components/NextButton";
import { ComputerPopup } from "./Popup";
import { Button } from "@/components/elements/Button";
import { PopupWindow } from "@/components/elements/PopupWindow";

export class ComputerScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private nextButton: NextButton;

	private popups: ComputerPopup<string[]>[];

	private numPopups: number = 0;
	private timer: number = 0;
	private burst: number;
	private maxPopups: number = 20;

	constructor() {
		super({ key: "ComputerScene" });
	}

	addPopup(x: number, y: number, frame: string, close: "close_horizontal" | "close_vertical") {
		const popup = this.add.sprite(0, 0, frame).setOrigin(0,0);
		const button = new Button(this, 0, 0);
		const closeSprite = this.add.sprite(0,0, close).setOrigin(1,0).setX(popup.width - 20).setY(15);
		button.add(closeSprite);
		button.bindInteractive(closeSprite);

		const container = this.add.container(x,y,[
			popup, 
			button
		]);

		button.on("click", () => {
			container.setVisible(false);
		})

		return [container, button];
	}

	spawnPopup(){

	}

	notify(){

	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x67e8f9);

		this.background = this.add.image(this.CX, this.CY, "computer_background");

		this.input.on("pointerdown", this.onPointerDown, this);

		this.addPopup(500,200, "computer_ibone_horizontal", "close_horizontal");


		this.nextButton = new NextButton(this);
		this.nextButton.on("click", () => {
			this.startScene("CutsceneScene", {
				textureKey: "5_package",
				nextScene: "IroningScene",
			});
		});
	}

	update(time: number, delta: number) {
		this.nextButton.update(time, delta);
		/*
		if(this.numPopups < this.maxPopups) {
			if(this.timer > 0) {
				this.timer -= delta;
				if(this.timer <= 0) {
					this.timer = 0;
					this.spawnPopup();
				}
			}
		}*/
	}

	onPointerDown(pointer: Phaser.Input.Pointer) {
		// console.count("click bwah")
		this.sound.play("computer_click", { volume: 1 });
	}
}
