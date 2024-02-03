import { BaseScene } from "../BaseScene";

function wait(time: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, time)
	});
}

export class SkeletonPlayer extends Phaser.GameObjects.GameObject {
	declare public scene: BaseScene;
	public x: number;
	public y: number;
	public offsetX: number;
	public offsetY: number;

	public health: number;

	private skeleton: {
		idle: Phaser.GameObjects.Image;
		defeat: Phaser.GameObjects.Image;
		jabLeft1: Phaser.GameObjects.Image;
		jabLeft2: Phaser.GameObjects.Image;
		jabRight1: Phaser.GameObjects.Image;
		jabRight2: Phaser.GameObjects.Image;
	};

	constructor(scene: BaseScene, health: number) {
		super(scene, "Player Skeleton");
		this.x = this.scene.CX;
		this.y = this.scene.H-450;
		this.offsetX = 0;
		this.offsetY = 0;
		this.health = health;

		this.skeleton = {
			idle: this.addSprite('boxing_skeleton_idle'),
			defeat: this.addSprite('boxing_skeleton_defeat'),
			jabLeft1: this.addSprite('boxing_punch_left1'),
			jabLeft2: this.addSprite('boxing_punch_left2'),
			jabRight1: this.addSprite('boxing_punch_right1'),
			jabRight2: this.addSprite('boxing_punch_right2'),
		};

		this.skeleton.idle.visible = true;
	};

	setHealth(health: number) {
		this.health = health;
		if(this.health == 0) {
			Object.values(this.skeleton).forEach((sprite) => {
				sprite.visible = false;
			});
			this.skeleton.defeat.visible = true;
		};
	}

	addSprite(name: string) {
		const sprite = new Phaser.GameObjects.Sprite(this.scene, this.x, this.y, name);
		this.scene.add.existing(sprite);
		sprite.visible = false;
		return sprite;
	};

	update(time: number, delta: number) {
		if(this.health == 0) return;
		Object.values(this.skeleton).forEach((sprite) => {
			sprite.x = this.x + this.offsetX;
			sprite.y = this.y + this.offsetY;
		});
	};

	async jabLeft() {
		if(this.health == 0) return;
		this.skeleton.idle.visible = false;
		this.skeleton.jabLeft1.visible = true;
		await wait(50);
		this.skeleton.jabLeft1.visible = false;
		this.skeleton.jabLeft2.visible = true;
		await wait(100);
		this.skeleton.jabLeft2.visible = false;
		this.skeleton.idle.visible = true;
	};

	async jabRight() {
		if(this.health == 0) return;
		this.skeleton.idle.visible = false;
		this.skeleton.jabRight1.visible = true;
		await wait(50);
		this.skeleton.jabRight1.visible = false;
		this.skeleton.jabRight2.visible = true;
		await wait(100);
		this.skeleton.jabRight2.visible = false;
		this.skeleton.idle.visible = true;
	};
}