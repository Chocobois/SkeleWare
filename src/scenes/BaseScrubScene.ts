import { BaseScene } from "@/scenes/BaseScene";

export class BaseScrubScene extends BaseScene {
	protected texture: Phaser.GameObjects.RenderTexture;
	protected brush: Phaser.GameObjects.Image;
	protected clearBrush: Phaser.GameObjects.Image;
	protected dirtParticles: { x: number; y: number; hp: number }[];
	protected dirtDebug: Phaser.GameObjects.Graphics;

	protected progress: number;
	protected isComplete: boolean;
	protected lastMousePos: Phaser.Types.Math.Vector2Like;

	constructor(config: Phaser.Types.Scenes.SettingsConfig) {
		super(config);

		this.progress = 1;
		this.isComplete = false;
		this.lastMousePos = { x: 0, y: 0 };
	}

	initDynamicTexture({
		textureKey,
		brushKey,
		centerX = 1920 / 2,
		centerY = 1080 / 2,
		debug = false,
		filter,
	}: {
		textureKey: string;
		brushKey: string;
		centerX?: number;
		centerY?: number;
		debug?: boolean;
		filter?: Phaser.Geom.Circle[];
	}) {
		console.assert(
			this.textures.exists(textureKey),
			`Texture '${textureKey}' not found`
		);
		console.assert(
			this.textures.exists(brushKey),
			`Texture '${brushKey}' not found`
		);

		this.progress = 0;
		this.isComplete = false;

		this.input.on("pointerdown", this.onPointerDown, this);
		this.input.on("pointermove", this.onPointerMove, this);

		this.texture = this.add.renderTexture(0, 0, this.W, this.H);
		this.texture.setOrigin(0);
		let { width, height } = this.textures.getFrame(textureKey);
		this.texture.draw(textureKey, centerX - width / 2, centerY - height / 2);

		this.brush = this.make.image({ key: brushKey }, false);
		// this.brush.setAlpha(0.7);
		this.brush.setScale(this.brushSize / this.brush.width);

		this.clearBrush = this.make.image({ key: "circle" }, false);
		this.clearBrush.setScale(100);

		this.dirtParticles = [];
		const gap = this.dirtSize * Math.SQRT1_2;
		for (let x = 0; x <= this.W; x += gap) {
			for (let y = 0; y <= this.W; y += gap) {

				// Only include points inside filters
				if (filter && filter.every(shape => !shape.contains(x, y))) {
					continue;
				}

				this.texture.snapshotPixel(x, y, (snapshot: any) => {
					if (snapshot.a > 0) {
						this.dirtParticles.push({ x, y, hp: 1 });
					}
				});
			}
		}

		if (debug) {
			this.dirtDebug = this.add.graphics();
			this.drawDebug();
		}
	}

	onPointerDown(pointer: Phaser.Input.Pointer) {
		if (this.isComplete) return;

		// for (let i = 0; i < 5; i++) {
		this.onRub(pointer);
		// }
	}

	onPointerMove(pointer: Phaser.Input.Pointer) {
		if (this.isComplete) return;

		// let dist = Phaser.Math.Distance.BetweenPoints(this.lastMousePos, pointer);
		// if (dist < this.brushSize / 16) return;
		// this.lastMousePos.x = pointer.x;
		// this.lastMousePos.y = pointer.y;

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
			this.dirtDebug.fillStyle(0xff00ff, hp > 0 ? 0.5 : 0);
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
