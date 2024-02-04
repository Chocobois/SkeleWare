import { BaseScene } from "./BaseScene";
import { NextButton } from "@/components/NextButton";
import dict from './dictionary.txt?raw'
import { TextButton } from "@/components/TextButton";


export class BombScene extends BaseScene {
	private background: Phaser.GameObjects.Image;
	private nextButton: NextButton;
    private currentWords: string[] = ["","",""];
	private yandereDev: string[] = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    private correctLane: number = 1; // which lane is safe
    private dictionary: string[] = [""];
	private charList: string[] = ["", "", "", "", ""];
	private indices: number[] = [0, 0, 0];
	private currentPosition: number;
	private currentPositionList: number[] = [0,0,0];
	private index1: number;
	private index2: number;
	private index3: number;
	private stopLight: number; //how long before wrong lane changes
	private timer: number = 45000;
	private secondTimer: number = 1000;
	static LANES: number[] = [0.05, 0.2, 0.35];
	private displayBars: Phaser.GameObjects.Graphics;
	private textList: Phaser.GameObjects.Container;
	private t1: Phaser.GameObjects.Text;
	private t2: Phaser.GameObjects.Text;
	private t3: Phaser.GameObjects.Text;
	private t4: Phaser.GameObjects.Text;
	private debugTxt: Phaser.GameObjects.Text;
	private debugTxt2: Phaser.GameObjects.Text;
	private currentString: string;
	private enteredTextDisplay: Phaser.GameObjects.Text;
	private conservedNumbers: number = 3;
	private meme: string[] = ["  s", "            u", "            d", "            o"];
	private ff: string[] = ["  x", "                    x", "                    x"];
	private buttons: TextButton[];
	private enterButton: TextButton;
	private eraseButton: TextButton;
	private failCounter: Phaser.GameObjects.Text;
	private successCounter: Phaser.GameObjects.Text;
	private timerDisplay: Phaser.GameObjects.Graphics;
	private fails: number;
	private successes: number;
	private stopTimer: boolean = false;
	private exploded: boolean = false;
	private flashScreen: Phaser.GameObjects.Graphics;

	private initFadeTimer: number = 5000;
	private imageTimer: number = 2000;
	private lingerTimer: number = 3000;
	private cinematicState: number = 0;
	private cIteration: number = 0;
	private cFrames: string[] = ["c1","c2","c3","c4","c5","c6","c7","c8","rip"];
	private baseImage: Phaser.GameObjects.Image;
	private overImage: Phaser.GameObjects.Image;

	constructor() {
		super({ key: "BombScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(0x67e8f9);
		this.background = this.add.image(this.CX, this.CY, "bomb_background");
		this.dictionary = [];
		this.meme = ["  s", "            u", "            d", "            o"];
		this.secondTimer = 1000;
		this.displayBars = this.add.graphics();
		this.timerDisplay = this.add.graphics();
		this.stopLight = 2000;
		this.currentString = "";
		this.currentPosition = 0;
		this.indices = [0, 1, 2];
		this.conservedNumbers = 3;
		this.currentPositionList = [0,0,0];
		this.fails = 0;
		this.successes = 0;
		this.stopTimer = false;
		this.exploded = false;
		this.cinematicState = 0;
		this.imageTimer = 1500;
		this.lingerTimer = 3500;
		this.cFrames = ["c1","c2","c3","c4","c5","c6","c7","c8","rip"];
		this.t1 = this.addText({
			x: this.W*0.10,
			y: this.H*0.085,
			size: 60,
			color: "white",
			text: "",
		});
		this.t2 = this.addText({
			x: this.W*0.10,
			y: this.H*0.235,
			size: 60,
			color: "white",
			text: "",
		});
		this.t3 = this.addText({
			x: this.W*0.10,
			y: this.H*0.385,
			size: 60,
			color: "white",
			text: "",
		});
		this.t4 = this.addText({
			x: this.W*0.75,
			y: this.H*0.12,
			size: 170,
			color: "white",
			text: "",
		});
		this.debugTxt = this.addText({
			x: this.W*0.342,
			y: this.H*0.372,
			size: 70,
			color: "green",
			text: "",
		});
		this.debugTxt2 = this.addText({
			x: this.W*0.342,
			y: this.H*0.572,
			size: 70,
			color: "green",
			text: "",
		});
		this.enteredTextDisplay = this.addText({
			x: this.W*0.542,
			y: this.H*0.72,
			size: 70,
			color: "blue",
			text: "_",
		});
		this.failCounter = this.addText({
			x: this.W*0.75,
			y: this.H*0.461,
			size: 40,
			color: "red",
			text: "",
		});
		this.successCounter = this.addText({
			x: this.W*0.75,
			y: this.H*0.361,
			size: 40,
			color: "green",
			text: "",
		});
		this.charList = ["a", "b", "c", "d", "e"];
		this.currentString = "";
		/*
		this.textList.add(this.t1);
		this.textList.add(this.t2);
		this.textList.add(this.t3);
		*/
		this.loadDictionary();
		this.changeLane();
		this.reloadCurrentWords();
		this.drawlanes();
		this.correctLane = Math.round(Math.random()*3);
		this.initiateButtons();
		this.flashScreen = this.add.graphics();
		this.baseImage = this.add.image(this.CX, this.CY, "c1");
		this.baseImage.setAlpha(0);
		this.overImage = this.add.image(this.CX, this.CY, "c2");
		this.overImage.setAlpha(0);
		this.nextButton = new NextButton(this);
		this.nextButton.on("click", () => {
			this.startScene("BoxingScene");
		});
		this.discombobulateChars();

	}

	playButton(){
		if(!this.exploded) {
			this.sound.play("button_press");
		}
	}

	initiateButtons()
	{

		this.enterButton = new TextButton(this, this.W*0.875, this.H*0.851, "ENTER", "enter_button", 20);
		this.enterButton.on("click", () => {
			this.playButton();
			this.submit();
		});
		this.eraseButton = new TextButton(this, this.W*0.950, this.H*0.851, "CLEAR", "erase_button", 20);
		this.eraseButton.on("click", () => {
			this.playButton();
			this.clear();
		});
		this.buttons = [new TextButton(this, this.W*0.537, this.H*0.898, "a", "text_button"),
						new TextButton(this, this.W*0.607, this.H*0.898, "b", "text_button"),
						new TextButton(this, this.W*0.677, this.H*0.898, "c", "text_button"),
						new TextButton(this, this.W*0.747, this.H*0.898, "d", "text_button"),
						new TextButton(this, this.W*0.817, this.H*0.898, "e", "text_button")];

		this.buttons[0].on("click", () => {
			this.advanceString(this.buttons[0].value);
		});
		this.buttons[1].on("click", () => {
			this.advanceString(this.buttons[1].value);
		});
		this.buttons[2].on("click", () => {
			this.advanceString(this.buttons[2].value);
		});
		this.buttons[3].on("click", () => {
			this.advanceString(this.buttons[3].value);
		});
		this.buttons[4].on("click", () => {
			this.advanceString(this.buttons[4].value);
		});
	}

	submit(){
		if(this.currentString === this.currentWords[this.correctLane])
		{
			this.playSuccess();
			if(this.successes <= 4) {
				this.successes++;
			}
			let st = "";
			for(let p = 0; p < this.successes; p++)
			{
				st = st.concat(this.meme[p]);
			}
			this.successCounter.setText(st);
			if(this.successes >= 4)
			{
				this.victory();
			}
			this.reloadCurrentWords();
			//this.drawlanes();
			this.clear();
		} else {
			if(this.fails <= 2)
			{
				this.fails++;
				this.failSound();
			}
			let sf = "";
			for(let r = 0; r < this.fails; r++)
			{
				sf = sf.concat(this.ff[r]);
			}
			this.failCounter.setText(sf);
			if(this.fails >= 3)
			{
				this.defeat();
			}
			this.reloadCurrentWords();
			//this.drawlanes();
			this.clear();
		}
		this.index1 = 0;
		this.index2 = 1;
		this.index3 = 2;
	}

	playSuccess(){
		if(!this.exploded) {
			this.sound.play("success");
		}
	}

	failSound()
	{
		if(!this.exploded){
			if(this.fails == 1)
			{
				this.sound.play("fail_1");
			} else if (this.fails == 2) {
				this.sound.play("fail_2")
			} else if (this.fails >= 3){
				this.sound.play("fail_3")
			}
		}
	}

	timeoutSound()
	{
		if(!this.exploded){
			this.sound.play("fail_3")
		}
	}

	victory(){
		this.stopTimer = true;
		this.sound.play("victory");
		this.currentWords[0] = "Awesome!"
		this.currentWords[1] = "Impressive."
		this.currentWords[2] = "POGGERS"
		this.drawlanes();
		this.enterButton.removeInteractive();
		this.enterButton.turnOff();
		this.eraseButton.removeInteractive();
		this.eraseButton.turnOff();
		for(let i = 0; i < this.buttons.length; i++)
		{
			this.buttons[i].removeInteractive();
			this.buttons[i].turnOff();
		}
	}

	defeat(){
		//set all text invisible
		//this.t1.setVisible(false);
		//this.t2.setVisible(false);
		//this.t3.setVisible(false);
		//this.t4.setVisible(false);
		//this.enteredTextDisplay.setVisible(false);
		//this.successCounter.setVisible(false);
		//this.failCounter.setVisible(false);
		//this.displayBars.clear();
		//this.displayBars.setVisible(false);
		if(!this.exploded) {
			this.enterButton.removeInteractive();
			this.enterButton.turnOff();
			this.eraseButton.removeInteractive();
			this.eraseButton.turnOff();
			for(let i = 0; i < this.buttons.length; i++)
			{
				this.buttons[i].removeInteractive();
				this.buttons[i].turnOff();
			}
			this.exploded = true;
			this.stopTimer = true;
			this.flashScreen.fillStyle(0xffffff,0.01);
			this.flashScreen.fillRect(-25, -25, this.W+50, this.H+50);
			this.cinematicState = 1;
		}
		this.nextButton.setVisible(false);
	}

	hideElements()
	{
		this.t1.setVisible(false);
		this.t2.setVisible(false);
		this.t3.setVisible(false);
		this.t4.setVisible(false);
		this.enteredTextDisplay.setVisible(false);
		this.successCounter.setVisible(false);
		this.failCounter.setVisible(false);
		this.displayBars.clear();
		this.displayBars.setVisible(false);
		this.eraseButton.setVisible(false);
		this.enterButton.setVisible(false);
		for(let i = 0; i < this.buttons.length; i++)
		{
			this.buttons[i].setVisible(false);
		}
	}

	initTransition()
	{

	}
	
	explode(){

	}

	advanceString(value: string) {
		this.playButton();
		this.currentString = this.currentString.concat(value);
		for (let i = 0; i < this.currentPositionList.length; i++)
		{
			if((this.currentWords[i].substring(this.currentPositionList[i],this.currentPositionList[i]+1) == value))
			{
				if((this.currentPositionList[i] < (this.currentWords[i].length-1))){
					this.currentPositionList[i] = this.currentPositionList[i] + 1;
				}
			}
		}
		this.discombobulateChars();
	}

	clear() {
		this.currentString = "";
		this.enteredTextDisplay.setText("_");
		this.currentPosition = 0;
		this.currentPositionList = [0,0,0];
		this.indices = [0,0,0];
		this.discombobulateChars();
		/*
		for(let i = 0; i < this.buttons.length; i++)
		{
			this.buttons[i].setIndex(-1);
		}
		*/
	}

	discombobulateChars(){
		this.conservedNumbers = 3;
		this.indices[0] = Math.round(Math.random()*(this.buttons.length-1));
		this.indices[1] = Math.round(Math.random()*(this.buttons.length-1));
		this.indices[2] = Math.round(Math.random()*(this.buttons.length-1));
		this.returnProperIndex(1);
		this.returnProperIndex(2); // get the right places to put our chars

		for(let i = 0; i < this.charList.length; i++)
		{
			this.charList[i] = this.yandereDev[Math.round(Math.random()*(this.yandereDev.length-1))];
			//fill all the charlist with random shit
		}
		this.charList[0] = this.currentWords[0].substring(this.currentPositionList[0],this.currentPositionList[0]+1);
		this.charList[1] = this.currentWords[1].substring(this.currentPositionList[1],this.currentPositionList[1]+1);
		this.charList[2] = this.currentWords[2].substring(this.currentPositionList[2],this.currentPositionList[2]+1);		//get our required characters
		this.charList[3] = this.yandereDev[Math.round(Math.random()*(this.yandereDev.length-1))];
		this.charList[4] = this.yandereDev[Math.round(Math.random()*(this.yandereDev.length-1))];
		this.rerollChars(4, 0, this.yandereDev.indexOf(this.charList[4]));
		this.rerollChars(3, 0, this.yandereDev.indexOf(this.charList[3]));
		if(this.rerollChars(2, 0, this.yandereDev.indexOf(this.charList[2])) > 0)
		{
			this.conservedNumbers--;
			this.indices[2] = -1;
		}
		if(this.rerollChars(1, 0, this.yandereDev.indexOf(this.charList[1])) > 0)
		{
			this.conservedNumbers--;
			this.indices[1] = -1;
		} //fills in the required characters, then goes backward from the end of the array and replaces any duplicates
		
		for(let n = 0; n < this.conservedNumbers; n++)
		{
			this.buttons[this.indices[n]].setValue(this.charList[n]);
			this.buttons[this.indices[n]].resetState();
			//this.buttons[this.indices[n]].setIndex(n);
		}
		let p = this.conservedNumbers;
		for(let h = 0; h < this.buttons.length; h++)
		{
			if(p >= this.charList.length) {
				break;
			}
			if(!(this.indices.indexOf(h) > -1))
			{
				this.buttons[h].setValue(this.charList[p]);
				this.buttons[h].resetState();
				//this.buttons[h].setIndex(-1);
				p++;
			}
		}
		//this.debugTxt.setText("CHARS: [" + this.charList[0] + " " + this.charList[1] + " " + this.charList[2] + " " + this.charList[3] + " " + this.charList[4] + "]");


	}

	rerollChars(ix: number, iter: number, newv: number): number
	{
		let ii = iter;
		if(ii == 0) {
			if(this.charList.indexOf(this.yandereDev[newv]) != ix)
			{
				ii++;
				newv++;
				this.rerollChars(ix, ii, newv);
			} else {
				return ii;
			}
		} else {
			if(this.charList.indexOf(this.yandereDev[newv]) > -1)
			{
				ii++;
				newv++;
				this.rerollChars(ix, ii, newv);
			} else {
				this.charList[ix] = this.yandereDev[newv];
				return ii;
			}
		}
		return 0;
	}

	returnProperIndex(key: number){
		if(key == 1)
		{
			if((this.indices[1] != this.indices[2]) && (this.indices[1] != this.indices[0]))
			{
				return;
			} else {
				this.indices[1] = this.indices[1]+1;
				if(this.indices[1] >= this.buttons.length){
					this.indices[1] = 0;				
				}
				this.returnProperIndex(1);
			}
		}
		else if (key == 2)
		{
			if((this.indices[2] != this.indices[1]) && (this.indices[2] != this.indices[0]))
			{
				return;
			} else {
				this.indices[2] = this.indices[2]+1;
				if(this.indices[2] >= this.buttons.length){
					this.indices[2] = 0;				
				}
				this.returnProperIndex(2);
			}
		}

	}

    loadDictionary() {
		this.dictionary = dict.split('\n');
	}

	reloadCurrentWords(){
		this.index1 = Math.round(Math.random()*(this.dictionary.length-1));
		this.currentWords[0] = this.dictionary[this.index1].trim();
		this.index2 = Math.round(Math.random()*(this.dictionary.length-1));
		if (this.index2 == this.index1 || this.index2 == this.index3)
		{
			this.adjustWords(1);
		}
		this.currentWords[1] = this.dictionary[this.index2].trim();
		this.index3 = Math.round(Math.random()*(this.dictionary.length-1));
		if (this.index3 == this.index1 || this.index3 == this.index2)
		{
			this.adjustWords(2);
		}
		this.currentWords[2] = this.dictionary[this.index3].trim();
		this.t1.setText(this.currentWords[0]);
		this.t2.setText(this.currentWords[1]);
		this.t3.setText(this.currentWords[2]);

	}

	adjustWords(key: number)
	{
		if(key == 1)
		{
			this.index2++;
			if (this.index2 >= this.dictionary.length)
			{
				this.index2 = 0;
			}

			if(this.index2 != this.index1) {
				return;
			} else {
				this.adjustWords(1);
			}
		}
		else if (key == 2)
		{
			this.index3++;
			if (this.index3 >= this.dictionary.length)
			{
				this.index3 = 0;
			}
			
			if(this.index3 != this.index1 && this.index3 != this.index2) {
				return;
			} else {
				this.adjustWords(2);
			}
		}
		//if you pick the same word, keep iterating until you get a different one

	}

	drawlanes(){
		this.displayBars.clear();
		for (let i = 0; i < BombScene.LANES.length; i++ )
		{
			if(!(i == this.correctLane)) {
				this.displayBars.fillStyle(0xFF6868,0.35);
				this.displayBars.fillRect(this.W*0.05, this.H*BombScene.LANES[i], 1200, 120);
			} else {
				this.displayBars.fillStyle(0x6BFF68,0.35);
				this.displayBars.fillRect(this.W*0.05, this.H*BombScene.LANES[i], 1200, 120);
			}
		}
	}

	changeLane()
	{
		this.correctLane = Math.round(Math.random()*2);
		this.stopLight = 3000;
	}

	loadChars()
	{
		let r = Math.round(Math.random()*(this.charList.length-1));
		for(let i = 0; i<this.charList.length; i++)
		{

		}
	}

	updateTimers(d: number)
	{
		this.stopLight -= d;
		this.secondTimer -= d;
		if(this.secondTimer <= 0) {
			if(this.timer <= 10500)
			{
				this.sound.play("beep");
				this.t4.setColor("red");
			}
			this.secondTimer = 1000;
		}
		
		if(this.stopLight <= 0){
			this.changeLane();
			this.displayBars.clear();
			this.drawlanes();
		}

		this.timer -= d;
		if(this.timer <= 0)
		{
			this.timer = 0;
			this.timeoutSound();
			this.defeat();
		}
		this.t4.setText((this.timer/1000).toFixed(2).toString());
		this.enteredTextDisplay.setText(this.currentString.concat("_"));
		//this.debugTxt2.setText("CORRECT: " + this.currentWords[this.correctLane] + "* " + this.currentWords[this.correctLane].length + " ENTERED: " + this.currentString + "* " + this.currentString.length);
	}

	updateCinematics(d: number)
	{
		switch(this.cinematicState) {
			case 1: {
				if(this.initFadeTimer > 0){
					this.initFadeTimer -= d;
					//this.debugTxt2.setText("DEBUG: " + this.initFadeTimer);
					this.flashScreen.clear();
					this.flashScreen.fillStyle(0xffffff, ((5000-this.initFadeTimer)/5000));
					this.flashScreen.fillRect(-25, -25, this.W+50, this.H+50);
					if(this.initFadeTimer <= 0)
					{
						this.initFadeTimer = 0;
						this.hideElements();
						this.sound.play("air_on_g");
						this.cinematicState = 2;
					}
				}
				break;
			}
			case 2: {
				if (this.imageTimer > 0)
				{
					this.imageTimer -= d;
					this.baseImage.setAlpha(((2000-this.imageTimer)/2000));
				}
				if(this.imageTimer <= 0)
				{
					this.imageTimer = 0;
					this.baseImage.setAlpha(1);
					this.flashScreen.setVisible(false);
					this.lingerTimer = 3000;
					this.cinematicState = 3;
				}
				break;
			}
			case 3: {
				if (this.lingerTimer > 0)
				{
					this.lingerTimer -= d;
				}
				if(this.lingerTimer <= 0)
				{
					this.lingerTimer = 0;
					this.imageTimer = 2000;
					this.cinematicState = 4;
				}
				break;
			} case 4: {
				if (this.imageTimer > 0)
				{
					this.imageTimer -= d;
					this.overImage.setAlpha(((2000-this.imageTimer)/2000));
				}
				if(this.imageTimer <= 0)
				{
					this.imageTimer = 0;
					this.overImage.setAlpha(1);
					this.baseImage.setAlpha(0);
					this.cIteration = 2;
					this.lingerTimer = 3000;
					this.cinematicState++;
				}
				break;
			} case 5 : {
				if (this.lingerTimer > 0)
				{
					this.lingerTimer -= d;
				}
				if(this.lingerTimer <= 0)
				{
					this.lingerTimer = 0;
					this.imageTimer = 2000;
					this.baseImage.setTexture(this.cFrames[this.cIteration-1]);
					this.baseImage.setAlpha(1);
					this.overImage.setTexture(this.cFrames[this.cIteration]);
					this.overImage.setAlpha(0);
					this.cinematicState = 6;
					if(this.cIteration >= 8)
					{
						this.flashScreen.fillStyle(0x000000, 1);
						this.flashScreen.fillRect(-25, -25, this.W+50, this.H+50);
						this.flashScreen.setVisible(true);
						this.baseImage.setTexture(this.cFrames[this.cIteration-1]);
						this.overImage.setTexture(this.cFrames[this.cIteration])
						this.overImage.setAlpha(0);
						this.baseImage.setAlpha(1);
						this.cinematicState = 7;
						return;
					}
					this.cIteration++;

				}
				break;
			} case 6: {
				if (this.imageTimer > 0)
				{
					this.imageTimer -= d;
					this.overImage.setAlpha(((2000-this.imageTimer)/2000));
				}
				if(this.imageTimer <= 0)
				{
					this.imageTimer = 0;
					this.overImage.setAlpha(1);
					this.baseImage.setAlpha(0);
					this.lingerTimer = 3000;
					this.cinematicState = 5;
				}
				break;
			} case 7: {
				if (this.imageTimer > 0)
				{
					this.imageTimer -= d;
					this.baseImage.setAlpha((this.imageTimer/2000));
				}
				if(this.imageTimer <= 0)
				{
					this.imageTimer = 0;
					this.overImage.setAlpha(1);
					this.flashScreen.setVisible(false);
					this.baseImage.setAlpha(0)
					this.nextButton.setVisible(true);
					this.sound.play("darksouls");
					this.lingerTimer = 3000;
					this.cinematicState = 8;
				}
				break;
			}
		}
	}

	update(time: number, delta: number) {
		if(!this.stopTimer){
			this.updateTimers(delta);
		}
		if(this.cinematicState > 0)
		{
			this.updateCinematics(delta);
		}
		this.nextButton.update(time, delta);
	}
}