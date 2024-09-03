import { BaseScene } from "@/scenes/BaseScene";
import { Music } from "@/components/Music";
import { Button } from "@/components/elements/Button";

export class UIScene extends BaseScene {
	private currentMusic: Music;
	private songs: { [key: string]: Music };

	public musicEnabled: boolean;
	public audioEnabled: boolean;
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
		this.musicEnabled = true;
		this.audioEnabled = true;

		/* Music */

		this.songs = {
			funky: new Music(this, "m_funky", { volume: 0.25 }),
			tense: new Music(this, "m_tense", { volume: 0.25 }),
			air: new Music(this, "m_air_on_g", { volume: 0.25 }),
		};
		for (let key in this.songs) {
			this.songs[key].on("bar", this.onBar, this);
			this.songs[key].on("beat", this.onBeat, this);
		}

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

		this.game.events.on(Phaser.Core.Events.BLUR, () => {
			this.sound.mute = true;
		});
		this.game.events.on(Phaser.Core.Events.FOCUS, () => {
			setTimeout(() => {
				this.sound.mute = !this.audioEnabled;
				this.audioImage.setFrame(this.audioEnabled ? 0 : 1);
			}, 100);
		});
	}

	update(time: number, delta: number) {
		this.musicButton.setScale(1.0 - 0.1 * this.musicButton.holdSmooth);
		this.audioButton.setScale(1.0 - 0.1 * this.audioButton.holdSmooth);

		if (this.currentMusic && this.musicEnabled) {
			let beat = this.currentMusic.barTime % 2;
			this.musicButton.angle = 10 * Math.sin(beat * Math.PI);
		} else {
			this.musicButton.angle = 0;
		}
	}

	onBar(bar: number) {}

	onBeat(time: number) {}

	toggleMusic() {
		this.musicEnabled = !this.musicEnabled;
		this.musicImage.setFrame(this.musicEnabled ? 0 : 1);

		for (let key in this.songs) {
			this.songs[key].setVolume(this.musicEnabled ? 0.25 : 0.0);
		}
	}

	toggleAudio() {
		this.audioEnabled = !this.audioEnabled;
		this.sound.mute = !this.audioEnabled;
		this.audioImage.setFrame(this.audioEnabled ? 0 : 1);
	}

	playMusic(key: string) {
		if (this.songs[key]) {
			if (this.songs[key] != this.currentMusic) {
				this.stopMusic();
				this.currentMusic = this.songs[key];
			}

			if (!this.currentMusic.isPlaying) {
				this.currentMusic.play();
			}
		}
	}

	stopMusic() {
		// Stop all songs
		for (let key in this.songs) {
			this.songs[key].stop();
		}
	}
}
