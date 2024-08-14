import { BaseScene } from "@/scenes/BaseScene";
import { TextButton } from "../TextButton";

//x button at -12,-12

export interface PopupInfo {
    spr: string;
    hitspr: string;
    w: number;
    h: number;
    hx: number;
    hy: number;
}

export class PopupWindow extends Phaser.GameObjects.Container {
    private xbutton: TextButton;
    private okbutton: TextButton;
    private window: Phaser.GameObjects.Image;
    private types: PopupInfo[] = [
        {spr: "w1", hitspr: "ok1", w: 120, h: 130, hx: -50, hy: -100},

    ];

    constructor(scene: BaseScene, x: number, y: number) {
        super(scene,x,y);

    }

    playSpawnSound(){

    }

    generatePopups(){

    }
}