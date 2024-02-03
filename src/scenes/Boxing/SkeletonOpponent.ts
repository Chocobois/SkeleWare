import { BaseScene } from "../BaseScene";

function wait(time: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, time)
	});
}

export enum AnimDir {
	LEFT = 0,
	RIGHT,
};

export enum AnimState {
	IDLE = 0,
	OPEN,
	HIT,
	DEAD,
	WINNER
}

export class SkeletonOpponent extends Phaser.GameObjects.GameObject {
	declare public scene: BaseScene;
	public x: number;
	public y: number;
	public offsetX: number;
	public offsetY: number;
	private eventTime: number;
	private eventState: AnimState;
	private canHit: number;

	public health: number;

	private skeleton: {
		idleLeft: Phaser.GameObjects.Image;
		jabTellLeft: Phaser.GameObjects.Image;
		jabAttackLeft: Phaser.GameObjects.Image;
		jabHitLeft: Phaser.GameObjects.Image;
		idleRight: Phaser.GameObjects.Image;
		jabTellRight: Phaser.GameObjects.Image;
		jabAttackRight: Phaser.GameObjects.Image;
		jabHitRight: Phaser.GameObjects.Image;
	};

	private currentHitPose: Phaser.GameObjects.Image;

	constructor(scene: BaseScene, health: number) {
		super(scene, "Player Skeleton");
		this.x = this.scene.CX;
		this.y = this.scene.CY;
		this.offsetX = 0;
		this.offsetY = 0;
		this.health = health;
		this.eventTime = 0;
		this.setAnimState(AnimState.IDLE);
		this.canHit = -1;

		this.skeleton = {
			idleLeft: this.addSprite("boxing_boxer_idle_left"),
			jabTellLeft: this.addSprite("boxing_boxer_tell_left"),
			jabAttackLeft: this.addSprite("boxing_boxer_attack_left"),
			jabHitLeft: this.addSprite("boxing_boxer_hit_left"),
			idleRight: this.addSprite("boxing_boxer_idle_right"),
			jabTellRight: this.addSprite("boxing_boxer_tell_right"),
			jabAttackRight: this.addSprite("boxing_boxer_attack_right"),
			jabHitRight: this.addSprite("boxing_boxer_hit_right"),
		};

		this.currentHitPose = this.skeleton.jabHitLeft;

		this.skeleton.idleLeft.visible = true;

		this.newEventTime(0, 3000);
	}

	private addSprite(name: string) {
		const sprite = new Phaser.GameObjects.Sprite(this.scene, this.x, this.y, name);
		this.scene.add.existing(sprite);
		sprite.visible = false;
		return sprite;
	};

	async tryHit(dir: AnimDir) {
		if(this.eventState != AnimState.OPEN) return;
		if(dir == this.canHit) {
			this.setAnimState(AnimState.HIT);
			this.currentHitPose.visible = true;
			this.skeleton.jabTellLeft.visible = false;
			this.skeleton.jabTellRight.visible = false;
			this.canHit = -1;
			this.emit("damage");
			this.health--;
			if( this.health == 0 ) {
				this.setAnimState( AnimState.DEAD );
				this.emit("defeat");
				return;
			}
			await wait(400);
			this.currentHitPose.visible = false;
			this.newEventTime(3000, 1000);
			this.setAnimState(AnimState.IDLE);
			return;
		}
	}

	private setAnimState(state: AnimState) {
		this.eventState = state;
	}

	setWinner() {
		this.eventState = AnimState.WINNER;
	}

	private isJabOut() {
		return this.skeleton.jabAttackLeft.visible || this.skeleton.jabAttackRight.visible;
	}

	private async runEvent(dir: number) {
		if( this.eventState != AnimState.IDLE ) return;
		this.setAnimState(AnimState.OPEN);

		this.skeleton.idleLeft.visible = false;
		this.skeleton.idleRight.visible = false;

		const tell = dir == AnimDir.LEFT ? this.skeleton.jabTellLeft : this.skeleton.jabTellRight;
		const jab = dir == AnimDir.LEFT ? this.skeleton.jabAttackLeft : this.skeleton.jabAttackRight;
		this.currentHitPose = dir == AnimDir.LEFT ? this.skeleton.jabHitLeft : this.skeleton.jabHitRight;

		// Can be hit
		tell.visible = true;
		this.canHit = dir;
		await wait(1000);

		// When he is punching
		// @ts-ignore
		if( this.eventState != AnimState.OPEN ) return;
		this.canHit = -1;
		tell.visible = false;
		jab.visible = true;
		this.emit("punch");

		await wait(400);
		jab.visible = false;
		if(this.eventState == AnimState.WINNER) return;

		// Back to idle
		this.setAnimState(AnimState.IDLE);
		this.newEventTime(3000, 1000);
	}

	private newEventTime(time: number, delay: number) {
		this.eventTime = this.scene.game.getTime() + delay + Math.random()*time;
	}

	update(time: number, delta: number) {
		if(this.eventState == AnimState.DEAD) return;

		Object.values(this.skeleton).forEach((sprite) => {
			sprite.x = this.x + this.offsetX;
			sprite.y = this.y + this.offsetY;
		});

		if( this.eventState != AnimState.IDLE && this.eventState != AnimState.WINNER ) return;

		const dir = Math.floor((time)/800%2);

		// @ts-ignore
		if( time > this.eventTime && this.eventState != AnimState.WINNER ) {
			this.runEvent(dir);
			return;
		}

		switch(dir) {
		case AnimDir.LEFT: {
			if( this.eventState == AnimState.WINNER ) {
				this.skeleton.jabTellLeft.visible = true;
				this.skeleton.jabTellRight.visible = false;
				return;
			} else {
				this.skeleton.idleLeft.visible = true;
				this.skeleton.idleRight.visible = false;
			}
		} break;
		case AnimDir.RIGHT: {
			if( this.eventState == AnimState.WINNER ) {
				this.skeleton.jabTellLeft.visible = false;
				this.skeleton.jabTellRight.visible = true;
				return;
			} else {
				this.skeleton.idleLeft.visible = false;
				this.skeleton.idleRight.visible = true;
			}
		} break;
		}

	};
}