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
		backgroundFlip: false,
		sprite: "court_skeletourney_idle",
		name: "Skeletourney",
		text: "I think we won.",
	},
	{
		text: "objection",
	},
	{
		backgroundFlip: true,
		sprite: "court_skelecutor_idle",
		name: "Skelecutor",
		text: "No, we definitely lost.",
	},
	{
		backgroundFlip: false,
		sprite: "court_skeletourney_idle",
		name: "Skeletourney",
		text: "But didn't we agree to try to lose?",
	},
	{
		backgroundFlip: true,
		sprite: "court_skelecutor_idle",
		name: "Skelecutor",
		text: "Objection! That's hearsay.",
	},
	{
		text: "objection",
	},
	{
		backgroundFlip: false,
		sprite: "court_skeletourney_objection_2",
		name: "Skeletourney",
		text: "Sustained. Let's stick to the facts.",
	},
	{
		text: "objection",
	},
	{
		backgroundFlip: true,
		sprite: "court_skelecutor_idle",
		name: "Skelecutor",
		text: "Well, the fact is, we both tried to lose.",
	},
	{
		text: "objection",
	},
	{
		backgroundFlip: false,
		sprite: "court_skeletourney_idle",
		name: "Skeletourney",
		text: "But I tried harder to lose!",
	},
	{
		backgroundFlip: false,
		sprite: "court_skeletourney_idle",
		text: "That's irrelevant. We both failed at losing.",
	},
	{
		backgroundFlip: false,
		sprite: "court_skeletourney_idle",
		text: "Maybe the real victory was in our failure.",
	},
	{
		backgroundFlip: false,
		sprite: "court_skeletourney_idle",
		text: "But if failing to lose means winning, then did we really lose?",
	},
	{
		backgroundFlip: false,
		sprite: "court_skeletourney_idle",
		text: "This is getting absurd.",
	},
	{
		backgroundFlip: false,
		sprite: "court_skeletourney_idle",
		text: "I move to dismiss this case.",
	},
	{
		backgroundFlip: false,
		sprite: "court_skeletourney_idle",
		text: "Overruled! Let's settle this over a game of chess.",
	},
];

export class CourtScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private foreground: Phaser.GameObjects.Image;
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
		this.skeleton = this.add.image(this.CX, this.CY, "court_skeletourney_idle");
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
			color: "white",
			text: "",
		});
		this.text.setWordWrapWidth(this.W - 2 * tx);
		this.textBox.add(this.text);

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

		let { backgroundFlip, sprite, name, text } = this.messages.shift()!;

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
			this.sound.play("court_objection", { volume: 0.1 });
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
