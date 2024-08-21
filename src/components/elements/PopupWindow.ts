import { BaseScene } from "@/scenes/BaseScene";
import { TextButton } from "../TextButton";

//x button at -12,-12

export interface PopupInfo {
    spr: string;
    hitspr: string[];
    w: number;
    h: number;
    hx: number[];
    hy: number[];
    nbx: number;
}

export class PopupWindow extends Phaser.GameObjects.Container {
    public scene: BaseScene;
    private xbutton: TextButton;
    private okbutton: TextButton;
    private ok2: TextButton;
    private ok3: TextButton;
    private window: Phaser.GameObjects.Image;
    private disabled: boolean = false;
    private types: PopupInfo[] = [
        {spr: "w1", hitspr: ["ok1"], w: 232, h: 128, hx: [-50], hy: [100], nbx: 1},
        {spr: "w2", hitspr: ["ok2a", "ok2b"], w: 203, h: 320, hx: [-102, -102], hy: [246, 286], nbx: 2},
        {spr: "w3", hitspr: ["ok3a", "ok3b"], w: 310, h: 290, hx: [-75, -235], hy: [250, 250], nbx: 2},
        {spr: "w4", hitspr: ["ok4"], w: 290, h: 160, hx: [-90], hy: [124], nbx: 1},
        {spr: "w5", hitspr: ["ok5a", "ok5b"], w: 420, h: 128, hx: [-300, -120], hy: [110, 110], nbx: 2},
        {spr: "w6", hitspr: ["ok6a", "ok6b", "ok6c"], w: 232, h: 128, hx: [-194, -128, -50], hy: [110, 110, 110], nbx: 3},
        {spr: "w7", hitspr: ["ok7a", "ok7b"], w: 232, h: 260, hx: [-176, -56], hy: [236, 236], nbx: 2},
        {spr: "w8", hitspr: ["ok8a", "ok8b"], w: 840, h: 640, hx: [-578, -262], hy: [528, 528], nbx: 2},
    ];

    private sounds: string[] = ["err1","err2","err3","err4","err5","err6","err7","err8"];

    constructor(scene: BaseScene, x: number, y: number, ix: number = -1) {
        super(scene,x,y);
        this.scene = scene;
        let index = Math.trunc(Math.random()*7.999);
        if((ix >= 0) && (ix <= 7)){
            index = ix;
        }
        let ref = this.types[index];
        this.window = new Phaser.GameObjects.Image(this.scene,-1*ref.w,0,ref.spr);
        this.window.setOrigin(0,0);
        this.window.setInteractive();
        //this.window.setOrigin((-1*ref.w),0);
        this.add(this.window);
        this.xbutton = new TextButton(this.scene, -12, 12, "", "xbutton", 10);
        this.xbutton.center();
        this.add(this.xbutton);
        this.xbutton.on("click", () => {
			this.close();
		});
        if(ref.nbx >= 1) {
            this.okbutton = new TextButton(this.scene, ref.hx[0], ref.hy[0], "", ref.hitspr[0], 10);
            this.okbutton.center();
            this.add(this.okbutton);
            this.okbutton.on("click", () => {
                this.multiply();
            });
        }
        if(ref.nbx >= 2) {
            this.ok2 = new TextButton(this.scene, ref.hx[1], ref.hy[1], "", ref.hitspr[1], 10);
            this.ok2.center();
            this.add(this.ok2);
            this.ok2.on("click", () => {
                this.multiply();
            });
        }
        if(ref.nbx >= 3) {
            this.ok3 = new TextButton(this.scene, ref.hx[2], ref.hy[2], "", ref.hitspr[2], 10);
            this.ok3.center();
            this.add(this.ok3);
            this.ok3.on("click", () => {
                this.multiply();
            });
        }
        //this.scene.add.existing(this);
        this.scene.notify(0);
        this.scene.sound.play(this.sounds[Math.trunc(Math.random()*7.999)]);
    }

    multiply(){
        if(!this.disabled) {
            this.scene.notify(2);
        }
    }

    playSpawnSound(){

    }

    generatePopups(){

    }

    close(){
        if(!this.disabled) {
            this.scene.notify(1);
            this.scene.sound.play("close");
            this.destroy();
        }
    }
}