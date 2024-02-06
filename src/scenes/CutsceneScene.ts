import { BaseScene } from "./BaseScene";
import { NextButton } from "@/components/NextButton";
import { UIScene } from "./UIScene";

const red = "#f87171";
const green = "#4ade80";
const blue = "#60a5fa";
const yellow = "#fcd34d";
const cyan = "#22d3ee";
const white = "#ffffff";

const dialogue: { [key: string]: [string, string][] } = {
	"0_crimes": [
		[red, "You wanna do crimes?"],
		[red, "No, I mean baseball."],
	],
	"1_intro": [
		[green, "Dude."],
		[yellow, "So, what we gonna do?"],
		[blue, "I dunno. What'cha wanna do?"],
		[red, "Hey, I got an idea."],
	],
	"2_dig": [
		[yellow, "Is that a shovel?"],
		[red, "We gotta start pillaging some stuff."],
		[blue, "... Yes."],
	],
	"3_loot": [
		[red, "Look at this haul."],
		[yellow, "Yeah but I dunno what it is it's too dirty."],
	],
	"4_shoes": [
		[yellow, "Holy shit, full size sneakers!"],
		[yellow, "Now we can play baseball."],
		[red, "If only we had some cool outfits."],
		[blue, "Guys, look. We can order clothes online."],
	],
	"5_package": [
		[yellow, "Ok, that was quick."],
		[blue, "Wow they're all crumpled up."],
		[red, "... I got just the thing."],
	],
	"6_baseball": [[red, "Baseball baseball baseball. *rattling noises*"]],
	"7_argument": [
		[blue, "We won!"],
		[yellow, "No, we just lost on purpose."],
		[blue, "We just suck."],
	],
	"8_court": [
		[red, "No time to cross examine."],
		[red, "We gotta eat! We're going to McBonalds."],
	],
	"9_dinner": [
		[yellow, "Wow, good burgz."],
		[red, "Yeah, but you guys eat like pigs."],
	],
	"10_bomb": [
		[red, "Holy shit where did this bomb come from?!"],
		[red, "Who used a bomb as a plate?"],
		[yellow, "Whoops."],
	],
	"11_defused": [
		[blue, "Phew, our bones are saved."],
		[red, "I've never seen cables like this."],
	],
	"12_miku": [
		[cyan, "That's because it's me!"],
		[red, "It's miku-bomb!"],
		[cyan, "Miku makes every bomb better."],
		[cyan, "Prepare to get miku-crushed."],
	],
	"13_victory": [
		[red, "Alas, the day is saved"],
		[yellow, "*bone noises*"],
	],
	"14_final": [
		[red, "Let's do this again tomorrow."],
		[green, "Dude."],
		[white, "- The End -"],
	],
};

export class CutsceneScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private text: Phaser.GameObjects.Text;
	private nextIcon: Phaser.GameObjects.Text;

	private complete: () => void;
	private messages: [string, string][];

	constructor() {
		super({ key: "CutsceneScene" });
	}

	create({
		textureKey,
		nextScene,
		nextArgs,
	}: {
		textureKey: string;
		nextScene: string;
		nextArgs?: any;
	}): void {
		this.fade(false, 400, 0x000000);
		this.cameras.main.setBackgroundColor(0x101010);

		this.background = this.add.image(this.CX, 0.46 * this.H, textureKey);
		this.background.setScale(0.6);

		this.text = this.addText({
			x: this.CX,
			y: this.background.y + this.background.displayHeight / 2 + 35,
			size: 50,
			color: "white",
		});
		this.text.setOrigin(0.5, 0.0);
		this.text.setWordWrapWidth(0.9 * this.W);

		// Error
		if (!this.textures.exists(textureKey)) {
			this.text.setText(
				"Missing cutscene!\nGo to previous scene and add:\nstartScene({ textureKey: ..., nextScene: ... })"
			);
		}

		this.nextIcon = this.addText({
			x: this.W - 80,
			y: this.H - 80,
			size: 120,
			text: ">",
			color: "white",
		});
		this.nextIcon.setOrigin(0.5);
		this.nextIcon.setVisible(false);

		let rect = this.add.rectangle(this.CX, this.CY, this.W, this.H, 0, 0.0001);
		rect.setInteractive({ useHandCursor: true });

		/* Continue */

		this.complete = () => {
			if (nextArgs) {
				this.startScene("CutsceneScene", nextArgs);
			} else {
				this.startScene(nextScene);
			}
		};

		this.messages = [...dialogue[textureKey]];

		rect.on("pointerdown", () => {
			if (this.nextIcon.visible) {
				this.continue();
			}
		});
		this.input.keyboard?.on("keydown-SPACE", () => {
			if (this.nextIcon.visible) {
				this.continue();
			}
		});

		// Special case for intro cutscene
		if (textureKey == "1_intro") {
			let rect = this.add.rectangle(
				this.background.x,
				this.background.y,
				this.background.displayWidth,
				this.background.displayHeight / 2,
				0,
				0
			);
			let mask = rect.createGeometryMask();
			this.background.setMask(mask);

			this.background.y += this.background.displayHeight / 4;
			this.text.y -= this.background.displayHeight / 4;
			this.fade(false, 2000, 0x000000);

			this.addEvent(2000, () => {
				this.tweens.add({
					targets: this.background,
					y: "-=" + this.background.displayHeight / 2,
					ease: "Cubic.InOut",
					duration: 4000,
					onComplete: () => {
						this.continue();
					},
				});
			});
		} else {
			this.addEvent(400, this.continue, this);
		}

		if (textureKey == "1_intro") {
			(this.scene.get("UIScene") as UIScene).playMusic("funky");
		}
		if (textureKey == "10_bomb") {
			(this.scene.get("UIScene") as UIScene).playMusic("tense");
		}
		if (textureKey == "11_defused") {
			(this.scene.get("UIScene") as UIScene).playMusic("funky");
		}
	}

	update(time: number, delta: number) {
		this.nextIcon.setAlpha(0.5 + 0.4 * Math.sin(6 * (time / 1000)));
	}

	continue() {
		this.nextIcon.setVisible(false);

		if (this.messages.length > 0) {
			let [color, message] = this.messages.shift()!;

			// Measure size
			this.text.x = this.CX;
			this.text.setOrigin(0.5, 0.0);
			this.text.setText(message);
			// Move to left for letter appearance
			this.text.x -= this.text.displayWidth / 2;
			this.text.setOrigin(0.0, 0.0);
			this.text.setText("");
			// Text color
			this.text.setColor(color);

			this.tweens.addCounter({
				from: 0,
				to: message.length,
				delay: 200,
				duration: 15 * message.length,
				onUpdate: (tween, target, key, current) => {
					this.text.setText(message.substring(0, current));
				},
				onComplete: () => {
					this.addEvent(300, () => {
						this.nextIcon.setVisible(true);
					});
				},
			});
		} else {
			this.complete();
		}
	}
}
