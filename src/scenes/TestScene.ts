import { BaseScene } from "@/scenes/BaseScene";
import { Player } from "@/components/Player";
import { UI } from "@/components/UI";

export class TestScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private foreground: Phaser.GameObjects.Image;
	private text: Phaser.GameObjects.Text;

	private texture: Phaser.GameObjects.RenderTexture;
	private brush: Phaser.GameObjects.Image;
	private dirt: { x: number; y: number; hp: number }[];

	constructor() {
		super({ key: "TestScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x777777);

		/* Objects */

		this.background = this.add.image(this.CX, this.CY, "test_background");

		// let circle = this.add.circle(this.CX, this.CY, 300, 0xffffff);

		this.initDynamicTexture("test_foreground");

		this.text = this.addText({
			x: this.CX,
			y: 0,
			size: 60,
			text: "Rub on the screen",
			color: "black",
		});
		this.text.setOrigin(0.5, 0.0);
	}

	update(time: number, delta: number) {
		// this.dirt.setAlpha(0.5 + 0.5 * Math.sin((4 * time) / 1000));
		// this.sparkles.setAlpha(0.75 + 0.25 * Math.sin((40 * time) / 1000));
	}

	/* Mask */

	initDynamicTexture(textureKey: string) {
		this.input.on("pointerdown", this.onPointerDown, this);
		this.input.on("pointermove", this.onPointerMove, this);

		this.texture = this.add.renderTexture(this.CX, this.CY, this.W, this.H);
		this.texture.draw(textureKey, 0, 0);

		this.brush = this.make.image({ key: "brush" }, false);
		this.brush.setAlpha(0.4);
		this.brush.setScale(this.brushSize / this.brush.width);

		this.dirt = [];
		for (let x = 0; x <= this.W; x += this.dirtSize / 2) {
			for (let y = 0; y <= this.H; y += this.dirtSize / 2) {
				this.dirt.push({
					x,
					y,
					hp: 1,
				});
			}
		}
	}

	onPointerDown(pointer: Phaser.Input.Pointer) {
		for (let i = 0; i < 5; i++) {
			this.onRub(pointer);
		}
	}

	onPointerMove(pointer: Phaser.Input.Pointer) {
		if (pointer.isDown) {
			this.onRub(pointer);
		}
	}

	onRub(pointer: Phaser.Input.Pointer) {
		this.brush.angle = 360 * Math.random();
		this.texture.erase(this.brush, pointer.x, pointer.y);

		this.dirt.forEach((dirt) => {
			if (dirt.hp > 0) {
				let dist = Phaser.Math.Distance.BetweenPoints(dirt, pointer);
				if (dist < 0.5 * this.brushSize) {
					dirt.hp = Math.max(dirt.hp - 0.12, 0);
				}
			}
		});

		let sum = this.dirt.reduce((sum, { hp }) => sum + hp, 0);
		let progress = sum / this.dirt.length;
		this.text.setText(`${Math.round(100 * progress)}%`);
	}

	get brushSize(): number {
		return 256;
	}

	get dirtSize(): number {
		return 64;
	}
}
