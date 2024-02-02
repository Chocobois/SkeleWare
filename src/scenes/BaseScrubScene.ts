import { BaseScene } from "@/scenes/BaseScene";
import { Player } from "@/components/Player";
import { UI } from "@/components/UI";

export class BaseScrubScene extends BaseScene {
	protected texture: Phaser.GameObjects.RenderTexture;
	protected brush: Phaser.GameObjects.Image;
	protected clearBrush: Phaser.GameObjects.Image;
	protected dirtParticles: { x: number; y: number; hp: number }[];
	protected dirtDebug: Phaser.GameObjects.Graphics;

	protected progress: number;
	protected isComplete: boolean;

	constructor(config: Phaser.Types.Scenes.SettingsConfig) {
		super(config);
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x777777);

		this.progress = 1;
		this.isComplete = false;

		// this.initDynamicTexture("test_foreground", this.CX, this.CY, false, false);
		// this.initDynamicTexture("test_circle", this.CX, this.CY, true, true);
	}

	update(time: number, delta: number) {
		// this.dirt.setAlpha(0.5 + 0.5 * Math.sin((4 * time) / 1000));
		// this.sparkles.setAlpha(0.75 + 0.25 * Math.sin((40 * time) / 1000));
	}

	/* Mask */

	initDynamicTexture({
		textureKey,
		centerX = 1920 / 2,
		centerY = 1080 / 2,
		asCircle = false,
		debug = false,
	}: {
		textureKey: string;
		centerX: number;
		centerY: number;
		asCircle: boolean;
		debug: boolean;
	}) {
		this.progress = 0;
		this.isComplete = false;

		this.input.on("pointerdown", this.onPointerDown, this);
		this.input.on("pointermove", this.onPointerMove, this);

		this.texture = this.add.renderTexture(0, 0, this.W, this.H);
		this.texture.setOrigin(0);
		let { width, height } = this.textures.getFrame(textureKey);
		this.texture.draw(textureKey, centerX - width / 2, centerY - height / 2);

		this.brush = this.make.image({ key: "brush" }, false);
		this.brush.setAlpha(0.5);
		this.brush.setScale(this.brushSize / this.brush.width);

		this.clearBrush = this.make.image({ key: "circle" }, false);
		this.clearBrush.setScale(100);

		let left = centerX - width / 2;
		let right = centerX + width / 2;
		let top = centerY - height / 2;
		let bottom = centerY + height / 2;

		this.dirtParticles = [];
		let k = 0;
		for (let x = left; x <= right; x += this.dirtSize / 2) {
			for (let y = top; y <= bottom; y += this.dirtSize / 2) {
				// Skip every other
				if (k++ % 2 == 0) {
					continue;
				}
				// Circle test
				let dist = Phaser.Math.Distance.Between(x, y, centerX, centerY);
				if (asCircle && dist > width / 2) {
					continue;
				}

				this.dirtParticles.push({ x, y, hp: 1 });
			}
			k++;
		}

		if (debug) {
			this.dirtDebug = this.add.graphics();
			this.drawDebug();
		}
	}

	onPointerDown(pointer: Phaser.Input.Pointer) {
		if (this.isComplete) return;

		for (let i = 0; i < 5; i++) {
			this.onRub(pointer);
		}
	}

	onPointerMove(pointer: Phaser.Input.Pointer) {
		if (this.isComplete) return;

		if (pointer.isDown) {
			this.onRub(pointer);
		}
	}

	onRub(pointer: Phaser.Input.Pointer) {
		if (this.isComplete) return;

		// Rotate and apply brush
		this.brush.angle = 360 * Math.random();
		this.texture.erase(this.brush, pointer.x, pointer.y);

		// Remove dirt checks
		this.dirtParticles.forEach((dirt) => {
			if (dirt.hp > 0) {
				let dist = Phaser.Math.Distance.BetweenPoints(dirt, pointer);
				if (dist < 0.5 * this.brushSize) {
					dirt.hp = Math.max(dirt.hp - 0.3, 0);
				}
			}
		});

		// Calculate progress
		let sum = this.dirtParticles.reduce((sum, { hp }) => sum + hp, 0);
		this.progress = 1 - sum / this.dirtParticles.length;

		// Debug rendering
		if (this.dirtDebug) {
			this.drawDebug();
		}

		if (this.progress >= 1.0) {
			this.clearDirt();
		}
	}

	drawDebug() {
		this.dirtDebug.clear();
		this.dirtParticles.forEach(({ x, y, hp }) => {
			this.dirtDebug.fillStyle(0xffffff, hp > 0 ? 0.5 : 0);
			this.dirtDebug.fillCircle(x, y, this.dirtSize / 2);
		});
	}

	clearDirt() {
		this.isComplete = true;
		this.onComplete();

		this.tweens.addCounter({
			from: 0,
			to: 1,
			duration: 1000,
			ease: "Quad.In",
			onUpdate: (tween, target, key, current) => {
				this.clearBrush.setAlpha(current);
				this.texture.erase(this.clearBrush, this.CX, this.CY);
			},
		});
	}

	onComplete() {}

	get brushSize(): number {
		return 256;
	}

	get dirtSize(): number {
		return 64;
	}
}
