import { RoundRectangle } from "@/components/elements/RoundRectangle";
import { BaseScene } from "./BaseScene";
import { NextButton } from "@/components/NextButton";

const dialogue = [
	"OpenAI give me 20 bone puns. 1. Why did the skeleton go to the party alone? He had no body to go with him. 2. Did you hear about the skeleton who won the marathon? He had a bone to pick with the competition. 3. How do you make a skeleton laugh? Tickler bone. 4. Why did the skeleton always carry a ladder? In case he needed a rib-tickler. 5. What do you call a funny bone that doesn’t laugh? A humerus joke. 6. Why didn’t the skeleton go to the dance party? He had no funny bone. 7. How do you make a skeleton laugh on Halloween? Tickle its funny bone. 8. Did you hear about the skeleton who couldn’t pay his bar tab? They took him bone debt. 9. Why did the skeleton refuse to play cards with the other skeletons? He didn’t have the guts for it. 10. Why did the skeleton take up knitting? It wanted to make a nice ribbed sweater. 11. How did the skeleton know it was going to rain? It could feel it in its bones. 12. What did the skeleton say to the burglar? “I’ve got a bone to pick with you!” 13. Why did the skeleton join a band? It had a good trom-bone tutor. 14. Why did the skeleton get in trouble at school? He got caught skull-pting. 15. What is a skeleton’s favorite instrument? The xylo-bone. 16. Did you hear about the skeleton who went to the barbecue? It had a bone to grill. 17. Why did the skeleton cross the road? To get to the body shop. 18. How do you call two skeletons shaking hands? Skeleton hands! 19. Why are skeletons so calm? Because nothing gets under their skin. 20. Why do skeletons hate winter? They fear the bone-chilling cold.",
];

export class CourtScene extends BaseScene {
	private text: Phaser.GameObjects.Text;
	private textCount: number;

	private nextButton: NextButton;

	constructor() {
		super({ key: "CourtScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x67e8f9);

		let background = this.add.image(this.CX, this.CY, "court_background");
		let skeleton = this.add.image(
			this.CX,
			this.CY,
			"court_skeleton_objection_2"
		);
		let foreground = this.add.image(this.CX, this.CY, "court_foreground");

		let panel = new RoundRectangle(this, {
			x: this.CX,
			y: this.H - 150,
			width: 1500,
			height: 300 - 50,
			color: 0x000000,
			alpha: 0.75,
		});

		this.textCount = 0;
		this.text = this.addText({
			x: panel.x - panel.width / 2 + 20,
			y: panel.y - panel.height / 2 + 20,
			size: 40,
			color: "white",
			text: "",
		});
		this.text.setWordWrapWidth(panel.width - 40);

		this.nextButton = new NextButton(this);
		this.nextButton.on("click", () => {
			this.startScene("CutsceneScene");
		});
	}

	update(time: number, delta: number) {
		this.nextButton.update(time, delta);

		this.textCount += delta / 50;
		const len = Math.floor(this.textCount);
		this.text.setText(dialogue[0].substring(0, len));
	}
}
