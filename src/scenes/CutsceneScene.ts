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
		[red, "Let's dig some graves!"],
		[yellow, "Where did you get a shovel?"],
		[red, "We gotta start pillaging some stuff."],
		[blue, "... Let's do it."],
	],
	"3_loot": [
		[red, "This treasure is to die for!"],
		[yellow, "It's covered in dirt."],
		[red, "Dirt is good. It cures diseases."],
		[yellow, "Let's brush them up instead."],
	],
	"4_shoes": [
		[yellow, "Holy bones, full size sneakers!"],
		[red, "They smell of drip."],
		[yellow, "Now we can play baseball."],
		[blue, "I'll order some cool shirts online."],
	],
	"5_package": [
		[blue, "Our order has arrived!"],
		[red, "Computers are so reliable."],
		[yellow, "Bah. The shirts are wrinkly."],
		[red, "Nothing an iron can't fix."],
	],
	"6_baseball": [
		[white, "*rattling noises*"],
		[blue, "Baseball baseball baseball!"],
		[red, "Last on the field is a numbskull."],
		[blue, "Hope your swing isn't as dead as you look."],
	],
	"7_argument": [
		[blue, "We won!"],
		[yellow, "No, we just lost on purpose."],
		[blue, "What's the difference?"],
		[red, "... Let's settle this in court."],
	],
	"8_court": [
		[red, "No time to cross examine!"],
		[red, "We gotta eat. We're going to McBonalds."],
		[blue, "I rest my case."],
	],
	"9_dinner": [
		[yellow, "Wow, good burgz."],
		[red, "Yeah, but you guys eat like pigs."],
		[red, "Who's gonna do the dishes?"],
		[blue, "I did them last century. Your turn!"],
	],
	"10_bomb": [
		[red, "Holy boney, where did this bomb come from?!"],
		[blue, "I don't wanna die!"],
		[red, "Who used a bomb as a plate?"],
		[yellow, "Haha, whoops."],
	],
	"11_defused": [
		[blue, "Phew, our bones are saved."],
		[yellow, "Who would ever program such a thing?"],
		[red, "Hmm. I've never seen cables like this."],
	],
	"12_miku": [
		[cyan, "That's because it's me!"],
		[red, "It's Miku-bomb!"],
		[cyan, "Miku makes every bomb better."],
		[cyan, "Prepare to get Miku-crushed."],
	],
	"13_victory": [
		[red, "Alas, the day is saved!"],
		[red, "She's got the voice, but I got the punchlines."],
		[white, "*impressed bone noises*"],
	],
	"14_final": [
		[red, "A perfect ending to a bone-rattling adventure!"],
		[yellow, "Let's do this again tomorrow."],
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

		if (textureKey == "10_bomb") {
			(this.scene.get("UIScene") as UIScene).playMusic("tense");
		} else {
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
