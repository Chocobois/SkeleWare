import { RoundRectangle } from "@/components/elements/RoundRectangle";
import { BaseScene } from "./BaseScene";

interface Dialogue {
	backgroundFlip?: boolean;
	sprite?: string;
	name?: string;
	text: string;
}

const dialogue: Dialogue[] = [
	{
		text: "objection",
	},
	{
		text: "fade",
	},
	{
		sprite: "court_skeletourney_objection_2",
		name: "Skeletourney",
		text: "By losing, we demonstrated mastery of the game! A deliberate defeat is a true victory, your honor.",
	},
	{
		sprite: "court_skelecutor_idle",
		name: "Skelecutor",
		text: "Absurd! A loss is a loss, no matter the intent. Purposeful failure is still failure.",
	},
	{
		sprite: "court_skelecutor_objection_2",
		name: "Skelecutor",
		text: "Winning requires more than intent. You can’t claim victory with the bones of a loss.",
	},
	{
		sprite: "court_skeletourney_idle",
		name: "Skeletourney",
		text: "Yet, in losing on purpose, did we not achieve a higher strategy? Intent redefines victory!",
	},
	{
		text: "objection",
	},
	{
		sprite: "court_skelecutor_objection_2",
		name: "Skelecutor",
		text: "Strategy or not, results speak louder than rattles. Losing is a brittle defense!",
	},
	{
		sprite: "court_skelecutor_idle",
		name: "Skelecutor",
		text: "You can't turn defeat into victory with mere boneheaded philosophy.",
	},
	{
		text: "objection",
	},
	{
		sprite: "court_skeletourney_objection_2",
		name: "Skeletourney",
		text: "Our bone of contention isn’t just the score, but the intent behind it!",
	},
	{
		sprite: "court_skelecutor_idle",
		name: "Skelecutor",
		text: "Intent doesn't score points, only runs do!",
	},
	{
		text: "objection",
	},
	{
		sprite: "court_skeletourney_objection_2",
		name: "Skeletourney",
		text: "Intent is the marrow of victory! The bones of strategy outlast the flesh of mere outcomes!",
	},
	{
		text: "objection",
	},
];

export class CourtScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private foreground: Phaser.GameObjects.Image;
	private black: Phaser.GameObjects.Rectangle;
	private skeleton: Phaser.GameObjects.Image;
	private objection: Phaser.GameObjects.Image;
	private textBox: Phaser.GameObjects.Container;
	private panel: Phaser.GameObjects.Rectangle;
	private text: Phaser.GameObjects.Text;
	private nextIcon: Phaser.GameObjects.Text;
	private namePlate: Phaser.GameObjects.Image;
	private name: Phaser.GameObjects.Text;

	private messages: Dialogue[];

	constructor() {
		super({ key: "CourtScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x67e8f9);

		this.background = this.add.image(this.CX, this.CY, "court_background");
		this.skeleton = this.add.image(this.CX, this.CY, "court_skeletourney_objection_2");
		this.foreground = this.add.image(this.CX, this.CY, "court_foreground");

		this.textBox = this.add.container();

		this.panel = this.add.rectangle(
			this.CX,
			this.H - 320 / 2 - 50,
			this.W,
			320,
			0x131a2d,
			0.9
		);
		this.textBox.add(this.panel);

		const tx = 0.2 * this.W;
		const ty = this.panel.y - this.panel.height / 2;

		this.namePlate = this.add.image(this.CX, ty, "court_nameplate");
		this.textBox.add(this.namePlate);

		this.name = this.addText({
			x: 325,
			y: ty,
			size: 35,
			color: "white",
			text: "Skeletourney",
		});
		this.name.setOrigin(0.5);
		this.textBox.add(this.name);

		this.text = this.addText({
			x: tx,
			y: ty + 55,
			size: 60,
			weight: 500,
			color: "white",
			text: "",
		});
		this.text.setStroke("white", 1);
		this.text.setWordWrapWidth(this.W - 2 * tx);
		this.textBox.add(this.text);

		this.black = this.add.rectangle(this.CX, this.CY, this.W, this.H, 0);

		this.objection = this.add.image(this.CX, this.CY, "court_objection");
		this.objection.setVisible(false);

		this.nextIcon = this.addText({
			x: this.W - 80,
			y: this.H - 120,
			size: 120,
			text: ">",
			color: "white",
		});
		this.nextIcon.setOrigin(0.5);
		this.nextIcon.setVisible(false);

		let rect = this.add.rectangle(this.CX, this.CY, this.W, this.H, 0, 0.0001);
		rect.setInteractive({ useHandCursor: true });

		/* Continue */

		this.messages = [...dialogue];

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
		this.addEvent(400, this.continue, this);
	}

	update(time: number, delta: number) {
		this.nextIcon.setAlpha(0.5 + 0.4 * Math.sin(6 * (time / 1000)));
	}

	continue() {
		this.nextIcon.setVisible(false);

		if (this.messages.length == 0) {
			this.startScene("CutsceneScene", {
				textureKey: "8_court",
				nextScene: "DrivethruScene",
			});
			return;
		}

		let { sprite, name, text } = this.messages.shift()!;

		const backgroundFlip = sprite ? sprite.includes("skelecutor") : undefined;

		if (backgroundFlip !== undefined) {
			this.background.flipX = backgroundFlip;
			this.foreground.flipX = backgroundFlip;
		}
		if (sprite !== undefined) {
			this.skeleton.setTexture(sprite);
		}
		if (name !== undefined) {
			this.name.setText(name);
		}

		if (text == "objection") {
			this.textBox.setVisible(false);

			this.flash(500, 0xffffff, 0.5);
			this.sound.play("court_objection", { volume: 0.2 });
			this.objection.setVisible(true);
			this.tweens.addCounter({
				from: 0,
				to: 1,
				duration: 1000,
				onUpdate: (tween, target, key, current) => {
					let shake = Math.exp(-15 * current) * Math.sin(100 * current);
					this.objection.setOrigin(0.5 + 0.1 * shake, 0.5);
				},
				onComplete: () => {
					this.objection.setVisible(false);
					this.continue();
				},
			});
		} else if (text == "fade") {
			this.tweens.add({
				targets: this.black,
				duration: 200,
				alpha: 0,
				onComplete: () => {
					this.black.setVisible(false);
					this.continue();
				},
			});
		} else {
			this.textBox.setVisible(true);
			this.text.setText("");

			this.tweens.addCounter({
				from: 0,
				to: text.length,
				delay: 300,
				duration: 15 * text.length,
				onUpdate: (tween, target, key, current) => {
					this.text.setText(text.substring(0, current));
				},
				onComplete: () => {
					this.addEvent(300, () => {
						this.nextIcon.setVisible(true);
					});
				},
			});
		}
	}
}
