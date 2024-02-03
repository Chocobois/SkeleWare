import { BaseScene } from "@/scenes/BaseScene";
import { Button } from "./elements/Button";
import { RoundRectangle } from "./elements/RoundRectangle";

export class NextButton extends Button {
	constructor(scene: BaseScene) {
		super(scene, 0, 0);

		const nw = 200;
		const nh = 75;

		this.x = scene.W - nw / 2 - 20;
		this.y = scene.H - nh / 2 - 20;

		let background = new RoundRectangle(scene, { width: nw, height: nh });
		this.add(background);

		const text = scene.addText({ text: "Next", color: "black", size: 40 });
		text.setOrigin(0.5);
		this.add(text);

		this.bindInteractive(background);
	}
	update(time: number, delta: number) {
		this.setScale(1.0 - 0.1 * this.holdSmooth);
	}
}
