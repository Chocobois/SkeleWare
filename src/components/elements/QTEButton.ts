import { BaseScene } from "@/scenes/BaseScene";
import { Button } from "./Button";

export class QTEButton extends Button {
	// private hover: boolean;
	constructor(scene: BaseScene, x: number, y: number) {
		super(scene, x, y);

	}

	onOut(pointer: Phaser.Input.Pointer, event: Phaser.Types.Input.EventData) {
		super.onOut(pointer, event);
	}

	onOver(
		pointer: Phaser.Input.Pointer,
		localX: number,
		localY: number,
		event: Phaser.Types.Input.EventData
	) {
		super.onOver(pointer, localX, localY, event);
	}

	onDown(
		pointer: Phaser.Input.Pointer,
		localX: number,
		localY: number,
		event: Phaser.Types.Input.EventData
	) {
		super.onDown(pointer, localX, localY, event);
	}

	onUp(
		pointer: Phaser.Input.Pointer,
		localX: number,
		localY: number,
		event: Phaser.Types.Input.EventData
	) {
		super.onUp(pointer, localX, localY, event);
	}
}
