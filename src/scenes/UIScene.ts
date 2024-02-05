import { BaseScene } from "@/scenes/BaseScene";
import { Music } from "@/components/Music";
import { Button } from "@/components/elements/Button";

export class UIScene extends BaseScene {
	private musicFunky: Music;

	private musicButton: Button;
	private audioButton: Button;
	private musicCircle: Phaser.GameObjects.Ellipse;
	private audioCircle: Phaser.GameObjects.Ellipse;
	private musicImage: Phaser.GameObjects.Image;
	private audioImage: Phaser.GameObjects.Image;

	constructor() {
		super({ key: "UIScene" });
	}

	create(): void {
		/* Music */

		this.musicFunky = new Music(this, "m_funky", { volume: 0.2 });
		this.musicFunky.on("bar", this.onBar, this);
		this.musicFunky.on("beat", this.onBeat, this);

		/* Buttons */

		this.musicButton = new Button(this, this.W - 70, 70);
		this.musicCircle = this.add.ellipse(0, 0, 64, 64, 0x777777);
		this.musicButton.add(this.musicCircle);
		this.musicImage = this.add.image(0, 0, "music");
		this.musicImage.setScale(64 / this.musicImage.width);
		this.musicButton.add(this.musicImage);
		this.musicButton.bindInteractive(this.musicImage);
		this.musicButton.on("click", this.toggleMusic, this);

		this.audioButton = new Button(this, this.W - 170, 70);
		this.audioCircle = this.add.ellipse(0, 0, 64, 64, 0x777777);
		this.audioButton.add(this.audioCircle);
		this.audioImage = this.add.image(0, 0, "audio");
		this.audioImage.setScale(64 / this.audioImage.width);
		this.audioButton.add(this.audioImage);
		this.audioButton.bindInteractive(this.audioImage);
		this.audioButton.on("click", this.toggleAudio, this);

		/* Events */

		this.scene.get("CutsceneScene").events.on(
			"funkyMusic",
			(state: boolean) => {
				if (state) this.musicFunky.play();
				else this.musicFunky.stop();
			},
			this
		);
	}

	update(time: number, delta: number) {
		this.musicButton.setScale(1.0 - 0.1 * this.musicButton.holdSmooth);
		this.audioButton.setScale(1.0 - 0.1 * this.audioButton.holdSmooth);

		let beat = this.musicFunky.barTime % 2;
		this.musicButton.angle = 5 * Math.sin(beat * Math.PI);
	}

	onBar(bar: number) {}

	onBeat(time: number) {}

	toggleMusic() {
		if (this.musicFunky.isPlaying) {
			this.musicFunky.pause();
			this.musicImage.setFrame(1);
		} else {
			this.musicFunky.play();
			this.musicImage.setFrame(0);
		}
	}

	toggleAudio() {
		this.audioImage.setFrame(1);
	}

	stopFunkyMusic() {
		this.musicFunky.stop();
	}
}
