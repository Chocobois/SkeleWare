import Phaser from "phaser";
import OutlinePipelinePlugin from "phaser3-rex-plugins/plugins/outlinepipeline-plugin.js";

import { PreloadScene } from "@/scenes/PreloadScene";
import { TitleScene } from "@/scenes/TitleScene";
import { GameScene } from "@/scenes/GameScene";

import { BaseballScene } from "@/scenes/BaseballScene";
import { BoxingScene } from "@/scenes/Boxing/BoxingScene";
import { ComputerScene } from "@/scenes/ComputerScene";
import { CourtScene } from "@/scenes/CourtScene";
import { CutsceneScene } from "@/scenes/CutsceneScene";
import { DigScene } from "@/scenes/DigScene";
import { DishesScene } from "@/scenes/DishesScene";
import { DrivethruScene } from "@/scenes/DrivethruScene";
import { IroningScene } from "@/scenes/IroningScene";

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.WEBGL,
	width: 1920,
	height: 1080,
	mipmapFilter: "LINEAR_MIPMAP_LINEAR",
	roundPixels: false,
	scale: {
		mode: Phaser.Scale.FIT,
	},
	scene: [
		PreloadScene,
		TitleScene,
		GameScene,
		// Minigame scenes
		BaseballScene,
		BoxingScene,
		ComputerScene,
		CourtScene,
		CutsceneScene,
		DigScene,
		DishesScene,
		DrivethruScene,
		IroningScene,
	],

	plugins: {
		global: [
			{
				key: "rexOutlinePipeline",
				plugin: OutlinePipelinePlugin,
				start: true,
			},
		],
	},
};

const game = new Phaser.Game(config);
