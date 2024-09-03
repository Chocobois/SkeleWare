import { BaseScene } from "@/scenes/BaseScene";

export class Instructions extends Phaser.GameObjects.Container {
	private text: Phaser.GameObjects.Text;

	constructor(scene: BaseScene, text: string) {
		super(scene, scene.CX, 0);
		scene.add.existing(this);

		this.text = scene
			.addText({
				size: 60,
				text,
				color: "white",
			})
			.setStroke("black", 8)
			.setShadow(0, 4, "black", 8)
			.setDepth(1000)
			.setPadding(4)
			.setOrigin(0.5, -0.25);
		this.add(this.text);

		this.setDepth(1000);
	}
}
