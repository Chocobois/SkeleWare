import { BaseScene } from "@/scenes/BaseScene";
import { Button } from "./elements/Button";

export class DoubleClickButton extends Button {
	public index: number;
    private sprite: Phaser.GameObjects.Sprite;
    private disabled: boolean = false;
    private doubleClickTimer: number = 0;
    private clickCount: number = 0;


	constructor(scene: BaseScene, x: number, y: number, spr: string) {
		super(scene, x, y);
        this.sprite = scene.add.sprite(0, 0, spr, 0);
        this.add(this.sprite);
        this.bindInteractive(this.sprite);
        this.index = -1;
        this.disabled = false;
	}

    update(t:number,d:number){
        if(this.disabled) {
            return;
        }
        if(this.clickCount > 0) {
            if(this.doubleClickTimer > 0) {
                this.doubleClickTimer -=d;
                if(this.doubleClickTimer <= 0) {
                    this.doubleClickTimer = 0;
                    this.clickCount = 0;
                }
            }
        }
    }

    center() {
        this.sprite.setOrigin(0.5,0.5);
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
            this.clickCount++;
            if(this.clickCount == 1){
                this.doubleClickTimer = 250;
            } else if (this.clickCount >= 2) {
                this.sprite.setFrame(0);
                this.proceed();
            }
        }
    }

    proceed(){
        this.scene.sound.play("close");
        this.disabled = true;
        this.scene.notify(4);
    }
}
