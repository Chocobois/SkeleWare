import { Image, SpriteSheet, Audio } from "./util";
import { image, sound, music, loadFont, spritesheet } from "./util";

/* Images */
const images: Image[] = [
	// Titlescreen
	image("titlescreen/sky", "title_sky"),
	image("titlescreen/background", "title_background"),
	image("titlescreen/foreground", "title_foreground"),
	image("titlescreen/character", "title_character"),

	// Brushes
	image("brushes/soft_brush", "soft_brush"),
	image("brushes/bite_brush", "bite_brush"),

	// Misc
	image("circle", "circle"),

	/* Scenes */

	// Baseball scene
	image("scenes/baseball/background", "baseball_background"),

	// Boxing scene
	image("scenes/boxing/BGboxingring", "boxing_background"),
	image("scenes/boxing/jabRight", "boxing_ui_jab_right"),
	image("scenes/boxing/jabLeft", "boxing_ui_jab_left"),
	image("scenes/boxing/SkeletonIdle", "boxing_skeleton_idle"),
	image("scenes/boxing/SkeletonDefeat", "boxing_skeleton_defeat"),
	image("scenes/boxing/SkeletonPunchLeft1", "boxing_punch_left1"),
	image("scenes/boxing/SkeletonPunchLeft2", "boxing_punch_left2"),
	image("scenes/boxing/SkeletonPunchRight1", "boxing_punch_right1"),
	image("scenes/boxing/SkeletonPunchRight2", "boxing_punch_right2"),
	// boxer animations left
	image("scenes/boxing/BoxerIdleLeft", "boxing_boxer_idle_left"),
	image("scenes/boxing/BoxerLeftTell", "boxing_boxer_tell_left"),
	image("scenes/boxing/BoxerLeftAttack", "boxing_boxer_attack_left"),
	image("scenes/boxing/BoxerLeftHIT", "boxing_boxer_hit_left"),
	// boxer animation right
	image("scenes/boxing/BoxerIdleRight", "boxing_boxer_idle_right"),
	image("scenes/boxing/BoxerRightTell", "boxing_boxer_tell_right"),
	image("scenes/boxing/BoxerRightAttack", "boxing_boxer_attack_right"),
	image("scenes/boxing/BoxerRightHIT", "boxing_boxer_hit_right"),

	// Computer scene
	image("scenes/computer/background", "computer_background"),

	// Court scene
	image("scenes/court/bgCourt", "court_background"),
	image("scenes/court/foregroundTable", "court_foreground"),
	image("scenes/court/skeletourneyIdle", "court_skeleton_idle"),
	image("scenes/court/skeletourneyObjection1", "court_skeleton_objection_1"),
	image("scenes/court/skeletourneyObjection2", "court_skeleton_objection_2"),

	// Cutscene scene
	image("scenes/cutscene/background", "cutscene_background"),

	// Dig scene
	image("scenes/dig/background", "dig_background"),
	image("scenes/dig/foreground", "dig_foreground"),
	image("scenes/dig/dirt", "dig_dirt"),
	image("scenes/dig/shoe", "dig_shoe"),
	image("scenes/dig/shovel", "dig_shovel"),

	// Dishes scene
	image("scenes/dishes/background", "dishes_background"),
	image("scenes/dishes/dirt", "dishes_dirt"),
	image("scenes/dishes/plate", "dishes_plate"),
	image("scenes/dishes/sparkles", "dishes_sparkles"),
	image("scenes/dishes/sponge", "dishes_sponge"),

	// Drivethru scene
	image("scenes/drivethru/background", "drivethru_background"),

	// Ironing scene
	image("scenes/ironing/background", "ironing_background"),

	//mutually assured destruction
	image("scenes/bomb/bomb_background", "bomb_background"),
	image("scenes/bomb/button_up", "button_up"),
	image("scenes/bomb/button_down", "button_up"),
	image("scenes/bomb/c1", "c1"),
	image("scenes/bomb/c2", "c2"),
	image("scenes/bomb/c3", "c3"),
	image("scenes/bomb/c4", "c4"),
	image("scenes/bomb/c5", "c5"),
	image("scenes/bomb/c6", "c6"),
	image("scenes/bomb/c7", "c7"),
	image("scenes/bomb/c8", "c8"),
	image("scenes/bomb/rip", "rip")
];

/* Spritesheets */
const spritesheets: SpriteSheet[] = [
	spritesheet('sprites/enter_button', 'enter_button', 100, 100),
	spritesheet('sprites/button_text', 'text_button', 120, 120),
	spritesheet('sprites/erase_button', 'erase_button', 100, 100)
];

/* Audios */
const audios: Audio[] = [
	music("title", "m_main_menu"),
	music("first", "m_first"),
	sound("tree/rustle", "t_rustle", 0.5),
	sound("bomb/bad_beep", "beep", 0.5),
	sound("bomb/button", "button_press", 0.5),
	sound("bomb/victory", "victory", 0.5),
	sound("bomb/fail_1", "fail_1", 0.5),
	sound("bomb/fail_2", "fail_2", 0.5),
	sound("bomb/fail_3", "fail_3", 0.5),
	sound("bomb/success", "success", 0.5),
	sound("bomb/darksouls", "darksouls", 0.5),
	sound("bomb/air_on_g", "air_on_g", 0.5),
];

/* Fonts */
await loadFont("DynaPuff-Medium", "Game Font");

export { images, spritesheets, audios };
