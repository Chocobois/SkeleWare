import { Button } from "@/components/elements/Button";
import { BaseScene } from "./BaseScene";
import { NextButton } from "@/components/NextButton";
import { RoundRectangle } from "@/components/elements/RoundRectangle";

type Item = {
	key: string;
	x: number;
	y: number;
	name: string;
};

const MenuItems = [
	{
		key: "drivethru_burger",
		x: 800,
		y: 280,
		name: "burger",
	},
	{
		key: "drivethru_coffe",
		x: 800,
		y: 800,
		name: "coffe",
	},
	{
		key: "drivethru_fries",
		x: 1200,
		y: 550,
		name: "fries",
	},
	{
		key: "drivethru_nuggets",
		x: 800,
		y: 520,
		name: "nuggets",
	},
	{
		key: "drivethru_salad",
		x: 1200,
		y: 280,
		name: "salad",
	},
	{
		key: "drivethru_soda",
		x: 1200,
		y: 800,
		name: "soda",
	},
];

export class DrivethruScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private buttons: Button[];
	private nextButton: NextButton;
	private randomItem: Item;

	constructor() {
		super({ key: "DrivethruScene" });
		this.buttons = [];
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x67e8f9);

		this.background = this.add.image(this.CX, this.CY, "drivethru_background");

		MenuItems.forEach(this.addMenuButton.bind(this));

		this.randomItem = MenuItems[Math.floor(Math.random() * MenuItems.length)];

		this.add.sprite(280, this.CY - 80, this.randomItem.key);

		this.nextButton = new NextButton(this);
		this.nextButton.on("click", () => {
			this.startScene("CutsceneScene", {
				textureKey: "9_dinner",
				nextScene: "DishesScene",
			});
		});
	}

	update(time: number, delta: number) {
		this.buttons.forEach((button) => {
			button.setScale(1.0 - 0.1 * button.holdSmooth);
		});
		this.nextButton.update(time, delta);
	}

	addMenuButton({ x, y, key, name }: Item) {
		const button = new Button(this, x, y);
		this.buttons.push(button);

		const image = this.add.sprite(0, 0, key);
		button.add(image);

		button.bindInteractive(image);

		button.on("down", () => this.sound.play("drivethru_clickdown", { volume: 0.2 }) );
		button.on("up",   () => this.sound.play("drivethru_clickup",   { volume: 0.2 }) );

		button.on("click", () => {
			const correct = this.randomItem.name == name;

			setTimeout(() => {
				this.sound.play(`drivethru_${correct ? "success" : "failure"}`, { volume: 0.5 });

				if (correct) {
					this.startScene("CutsceneScene", {
						textureKey: "9_dinner",
						nextScene: "DishesScene",
					});
				}
			}, 150);
		});
	}
}
