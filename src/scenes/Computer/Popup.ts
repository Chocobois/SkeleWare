import { Button } from "@/components/elements/Button";
import { BaseScene } from "../BaseScene";

class FrameContainer<T extends Readonly<string[]>> extends Phaser.GameObjects.Container {
    private visibleFrame: Phaser.GameObjects.Sprite;
    private frames: Phaser.GameObjects.Sprite[];

    private keys: T;

    constructor(scene: BaseScene, keys: Readonly<T>) {
        super(scene);

        this.keys = keys;
        this.frames = keys.map((key) => scene.add.sprite(0, 0, key).setVisible(false));
        this.visibleFrame = this.frames[0].setVisible(true);
    }

    selectFrame(key: T[number]) {
        const index = this.keys.findIndex((entry) => entry == key);
        const frame = this.frames[index];
        this.visibleFrame.setVisible(false);
        frame.setVisible(true);
        this.visibleFrame = frame;
    }
}

export class ComputerPopup<T extends Readonly<string[]>> extends Phaser.GameObjects.Container {
    declare public scene: BaseScene;

    private atlas: FrameContainer<Readonly<T>>;

    private animation: (atlas: FrameContainer<Readonly<T>>) => void;

    constructor(
            scene: BaseScene, 
            frame: "computer_popup_blank_diagonal" | "computer_popup_blank_horizontal", 
            atlas: Readonly<T>, 
            acceptButton: string, 
            denyButton: string
            //animation: (atlas: FrameContainer<Readonly<T>>) => void
        ) {
        super(scene);
        scene.add.sprite(0, 0, frame);
        this.atlas = scene.add.existing(new FrameContainer(scene, atlas));

        const yesButton = new Button(scene, 0, 0);
        const yesImage = scene.add.sprite(0, 0, acceptButton);
        yesButton.add(yesImage);
        yesButton.bindInteractive(yesImage);
        yesButton.on("click", () => this.emit("accept"));

        const noButton = new Button(scene, 0, 0);
        const noImage = scene.add.sprite(0, 0, denyButton);
        noButton.add(noImage);
        noButton.bindInteractive(noImage);
        noButton.on("click", () => this.emit("deny"));
    }

    callFrame(callback: (atlas: FrameContainer<Readonly<T>>) => void) {
        callback(this.atlas);
    }
}