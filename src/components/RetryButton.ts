import { BaseScene } from "@/scenes/BaseScene";
import { Button } from "./elements/Button";
import { RoundRectangle } from "./elements/RoundRectangle";

export class RetryButton extends Button {
	constructor(scene: BaseScene) {
		super(scene, 0, 0);

		const nw = 300;
		const nh = 75;

		this.x = scene.CX;
		this.y = scene.H - nh / 2 - 20;

		let background = new RoundRectangle(scene, { width: nw, height: nh, color: 0x444444});
		this.add(background);

		const text = scene.addText({ text: "Try again", color: "white", size: 40 });
		text.setOrigin(0.5);
		this.add(text);

		this.bindInteractive(background);
	}
	update(time: number, delta: number) {
		this.setScale(1.0 - 0.1 * this.holdSmooth);
	}
}
