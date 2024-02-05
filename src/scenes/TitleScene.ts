import { BaseScene } from "@/scenes/BaseScene";
import { Music } from "@/components/Music";

const creditsLeft = `@Golenchu
@LuxxArt
@ArcticFqx
@KonixKun
@MatoCookies
Lumie
Soulsong
Frassy`;

const creditsRight = `code & art
art
code
art
audio & code
art & code
art
art`;

export class TitleScene extends BaseScene {
	public sky: Phaser.GameObjects.Image;
	public foreground: Phaser.GameObjects.Image;
	public skeleton1: Phaser.GameObjects.Image;
	public skeleton2: Phaser.GameObjects.Image;
	public skeleton3: Phaser.GameObjects.Image;
	public skeleton4: Phaser.GameObjects.Image;

	public credits: Phaser.GameObjects.Container;
	public title: Phaser.GameObjects.Image;
	public subtitle: Phaser.GameObjects.Text;
	public tap: Phaser.GameObjects.Text;

	public musicTitle: Phaser.Sound.WebAudioSound;
	public select: Phaser.Sound.WebAudioSound;
	public select2: Phaser.Sound.WebAudioSound;

	public isStarting: boolean;

	constructor() {
		super({ key: "TitleScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);

		this.sky = this.add.image(this.CX, this.CY, "title_sky");
		this.containToScreen(this.sky);
		this.skeleton1 = this.add.image(this.CX, this.CY, "title_skeleton_1");
		this.skeleton2 = this.add.image(this.CX, this.CY, "title_skeleton_2");
		this.skeleton3 = this.add.image(this.CX, this.CY, "title_skeleton_3");
		this.skeleton4 = this.add.image(this.CX, this.CY, "title_skeleton_4");
		this.containToScreen(this.skeleton1);
		this.containToScreen(this.skeleton2);
		this.containToScreen(this.skeleton3);
		this.containToScreen(this.skeleton4);

		this.skeleton1.setAlpha(0);
		this.skeleton2.setAlpha(-1);
		this.skeleton3.setAlpha(-2);
		this.skeleton4.setAlpha(-3);
		this.skeleton1.x -= 1 * 200;
		this.skeleton2.x += 2 * 200;
		this.skeleton3.x -= 3 * 200;
		this.skeleton4.x += 4 * 200;

		this.title = this.add.image(400, 200, "title_title");
		this.title.setVisible(false);
		this.title.setScale(0.5);
		this.title.setAngle(-10);
		this.title.setAlpha(-2);

		this.subtitle = this.addText({
			x: 0.2 * this.W,
			y: 0.87 * this.H,
			size: 100,
			color: "#000",
			text: "Tap to start",
		});
		this.subtitle.setOrigin(0.5);
		this.subtitle.setStroke("#FFF", 8);
		this.subtitle.setPadding(2);
		this.subtitle.setVisible(false);
		this.subtitle.setAlpha(0);

		this.tap = this.addText({
			x: this.CX,
			y: this.CY,
			size: 140,
			color: "#000",
			text: "Tap to focus",
		});
		this.tap.setOrigin(0.5);
		this.tap.setAlpha(-1);
		this.tap.setStroke("#FFF", 8);
		this.tap.setPadding(2);

		this.credits = this.add.container(0, 0);
		this.credits.setVisible(false);
		this.credits.setAlpha(0);

		let credits1 = this.addText({
			x: 0.68 * this.W,
			y: this.H,
			size: 40,
			color: "#c2185b",
			text: creditsLeft,
		});
		credits1.setOrigin(0, 1);
		credits1.setStroke("#FFF", 10);
		credits1.setPadding(2);
		credits1.setLineSpacing(-10);
		this.credits.add(credits1);

		let credits2 = this.addText({
			x: 0.85 * this.W,
			y: this.H,
			size: 40,
			color: "#c2185b",
			text: creditsRight,
		});
		credits2.setOrigin(0, 1);
		credits2.setStroke("#FFF", 10);
		credits2.setPadding(2);
		credits2.setLineSpacing(-10);
		this.credits.add(credits2);

		// Music
		if (!this.musicTitle) {
			this.musicTitle = new Music(this, "m_first", { volume: 0.0 });
			this.musicTitle.on("bar", this.onBar, this);
			this.musicTitle.on("beat", this.onBeat, this);

			// this.select = this.sound.add("dayShift", { volume: 0.8, rate: 1.0 }) as Phaser.Sound.WebAudioSound;
			// this.select2 = this.sound.add("nightShift", { volume: 0.8, rate: 1.0 }) as Phaser.Sound.WebAudioSound;
		}
		this.musicTitle.play();

		// Input

		this.input.keyboard
			?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
			.on("down", this.progress, this);
		this.input.on(
			"pointerdown",
			(pointer: PointerEvent) => {
				if (pointer.button == 0) {
					this.progress();
				}
			},
			this
		);
		this.isStarting = false;
	}

	update(time: number, delta: number) {
		if (this.title.visible) {
			// this.title.y += 0.02 * (this.CY - this.title.y);
			// this.foreground.y += 0.025 * (this.CY - this.foreground.y);
			this.skeleton1.x += 0.02 * (this.CX - this.skeleton1.x);
			this.skeleton2.x += 0.02 * (this.CX - this.skeleton2.x);
			this.skeleton3.x += 0.02 * (this.CX - this.skeleton3.x);
			this.skeleton4.x += 0.02 * (this.CX - this.skeleton4.x);

			this.skeleton1.alpha += 0.02 * (1 - this.skeleton1.alpha);
			this.skeleton2.alpha += 0.02 * (1 - this.skeleton2.alpha);
			this.skeleton3.alpha += 0.02 * (1 - this.skeleton3.alpha);
			this.skeleton4.alpha += 0.02 * (1 - this.skeleton4.alpha);
			this.title.alpha += 0.02 * (1 - this.title.alpha);

			// this.title.alpha += 0.03 * (1 - this.title.alpha);
			// this.skeleton1.scaleX = Math.sin((3 * time) / 1000);
			// this.skeleton2.scaleX = Math.sin((3 * time) / 1000);
			// this.skeleton3.scaleX = Math.sin((3 * time) / 1000);
			// this.skeleton4.scaleX = Math.sin((3 * time) / 1000);

			this.title.alpha +=
				0.02 * ((this.title.visible ? 1 : 0) - this.title.alpha);
			this.subtitle.alpha +=
				0.02 * ((this.subtitle.visible ? 1 : 0) - this.subtitle.alpha);

			if (this.credits.visible) {
				this.credits.alpha += 0.02 * (1 - this.credits.alpha);
			}
		} else {
			this.tap.alpha += 0.01 * (1 - this.tap.alpha);

			if (this.musicTitle.seek > 0) {
				this.title.setVisible(true);
				this.tap.setVisible(false);
			}
		}

		this.subtitle.setScale(1 + 0.02 * Math.sin((5 * time) / 1000));

		if (this.isStarting) {
			this.subtitle.setAlpha(0.6 + 0.4 * Math.sin((50 * time) / 1000));
		}
	}

	progress() {
		if (!this.title.visible) {
			this.onBar(1);
		} else if (!this.subtitle.visible) {
			this.title.setVisible(true);
			this.title.setAlpha(1);
			this.subtitle.setVisible(true);
			this.subtitle.setAlpha(1);
		} else if (!this.isStarting) {
			this.sound.play("t_rustle", { volume: 0.3 });
			// this.sound.play("m_slice", { volume: 0.3 });
			// this.sound.play("u_attack_button", { volume: 0.5 });
			// this.select2.play();
			this.isStarting = true;
			this.flash(3000, 0xffffff, 0.6);

			this.addEvent(1000, () => {
				this.fade(true, 1000, 0x000000);
				this.addEvent(1050, () => {
					this.musicTitle.stop();

					// this.scene.start("IntroScene");
					this.scene.start("CutsceneScene", {
						textureKey: "1_intro",
						nextScene: "CutsceneScene",
						nextArgs: {
							textureKey: "2_dig",
							nextScene: "DigScene",
						},
					});
				});
			});
		}
	}

	onBar(bar: number) {
		if (bar >= 2) {
			this.title.setVisible(true);
		}
		if (bar >= 4) {
			this.subtitle.setVisible(true);
			this.credits.setVisible(true);
		}
	}

	onBeat(time: number) {
		// this.select.play();
	}
}
