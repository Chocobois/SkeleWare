import { Button } from "@/components/elements/Button";
import { BaseScene } from "@/scenes/BaseScene";
import { NextButton } from "@/components/NextButton";
import { SkeletonPlayer } from "./SkeletonPlayer";
import { AnimDir, SkeletonOpponent } from "./SkeletonOpponent";


function removeLast(group :Phaser.GameObjects.Group) {
	const children = group.getChildren();
	const count = children.length;
	if(count == 0) return 0;
	const child = children[children.length-1];
	group.remove(child, true);
	return count - 1;
}

export class BoxingScene extends BaseScene {
	private background: Phaser.GameObjects.Image;

	private player: SkeletonPlayer;
	private opponent: SkeletonOpponent;

	private playerHealth: Phaser.GameObjects.Group;
	private opponentHealth: Phaser.GameObjects.Group;

	private jabLeftButton: Button;
	private jabRightButton: Button;

	private nextButton: NextButton;

	constructor() {
		super({ key: "BoxingScene" });
	}

	createButton(x: number, y: number, imagePath: string) {
		const button = new Button(this, x, y)
		const image = new Phaser.GameObjects.Image(this, 0, 0, imagePath);
		button.add(image);
		button.bindInteractive(image);
		return button;
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x67e8f9);

		this.background = this.add.image(this.CX, this.CY, "boxing_background");

		this.opponent = new SkeletonOpponent(this, 3);
		this.add.existing(this.opponent);

		this.player = new SkeletonPlayer(this, 3);
		this.add.existing(this.player);

		this.jabLeftButton = this.createButton(300, this.CY*0.7, "boxing_ui_jab_left");
		this.jabRightButton = this.createButton(this.W - 300, this.CY*0.7, "boxing_ui_jab_right");

		this.nextButton = new NextButton(this);
		this.nextButton.on("click", () => {
			this.startScene("ComputerScene");
		});

		this.jabLeftButton.on("click", () => {
			this.player.jabLeft();
			this.opponent.tryHit(AnimDir.LEFT);
		});
		this.jabRightButton.on("click", () => {
			this.player.jabRight();
			this.opponent.tryHit(AnimDir.RIGHT);
		});

		this.playerHealth = this.add.group();
		this.opponentHealth = this.add.group();

		for(let i = 0; i < this.player.health; i++) {
			this.playerHealth.add(
				new Phaser.GameObjects.Image(this, 100 + i*200, this.H - 100, "boxing_heart"), true
			);
		}
			
		for(let i = 0; i < this.opponent.health; i++) {
			this.opponentHealth.add(
				new Phaser.GameObjects.Image(this, 100 + i*200, 100, "boxing_heart"), true
			);
		}
		
		this.opponent.on("punch", () => {
			const remaining = removeLast(this.playerHealth);
			this.player.setHealth(remaining);
			if( remaining == 0 ) {
				this.opponent.setWinner();
			}
		});

		this.opponent.on("damage", () => {
			removeLast(this.opponentHealth);
		});

		this.opponent.on("defeat", () => {
			console.log("You won!")
		});
	}

	update(time: number, delta: number) {
		this.nextButton.update(time, delta);
		this.player.offsetX = Math.cos(time/1000)*20;
		this.player.offsetY = Math.sin(time/200)*6;

		this.opponent.offsetX = Math.cos(500+ time/650)*20;
		this.opponent.offsetY = Math.sin(500+ time/100)*10;

		this.player.update(time, delta);
		this.opponent.update(time, delta);
	}
}
