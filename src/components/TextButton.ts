import { BaseScene } from "@/scenes/BaseScene";
import { Button } from "./elements/Button";

export class TextButton extends Button {
	public index: number;
    public value: string;
    private sprite: Phaser.GameObjects.Sprite;
    private tdisplay: Phaser.GameObjects.Text;
    private disabled: boolean = false;



	constructor(scene: BaseScene, x: number, y: number, v: string, spr: string, fsize: number = 40) {
		super(scene, x, y);
        this.sprite = scene.add.sprite(0, 0, spr, 0);
        this.add(this.sprite);
        this.bindInteractive(this.sprite);
        this.value = v;
        this.tdisplay = scene.addText({ text: v, color: "white", size: fsize });
        this.tdisplay.setOrigin(0.5);
        this.add(this.tdisplay);
        this.index = -1;
        this.disabled = false;
	}

    center() {
        this.sprite.setOrigin(0.5,0.5);
    }

    setValue(data: string){
        this.value = data;
        this.tdisplay.setText(this.value);
    }

    setIndex(i: number){
        this.index =  i;
    }

    turnOff(){
        this.disabled = true;
        this.resetState();
    }

    turnOn(){
        this.disabled = false;
        this.resetState();
    }

    resetState(){
        this.tdisplay.setColor("white");
        this.sprite.setFrame(0);
    }

    onDown(
        pointer: Phaser.Input.Pointer,
		localX: number,
		localY: number,
		event: Phaser.Types.Input.EventData
    ) {
        if (!this.disabled) {
            super.onDown(pointer, localX, localY, event);
            this.tdisplay.setColor("green");
            this.sprite.setFrame(1);
        }
    }
    onUp(
        pointer: Phaser.Input.Pointer,
		localX: number,
		localY: number,
		event: Phaser.Types.Input.EventData
    ) {
        if (!this.disabled) {
            super.onUp(pointer, localX, localY, event);
            this.tdisplay.setColor("white");
            this.sprite.setFrame(0);
        }
    }
    onOut(
        pointer: Phaser.Input.Pointer,
        event: Phaser.Types.Input.EventData
    ) {
        if (!this.disabled) {
            super.onOut(pointer, event);
            this.tdisplay.setColor("white");
            this.sprite.setFrame(0);
        }
    }
}
