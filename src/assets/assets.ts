import { Image, SpriteSheet, Audio } from "./util";
import { image, sound, music, loadFont, spritesheet } from "./util";

/* Images */
const images: Image[] = [
	// Titlescreen
	image("titlescreen/sky", "title_sky"),
	image("titlescreen/title", "title_title"),
	image("titlescreen/character1", "title_skeleton_1"),
	image("titlescreen/character2", "title_skeleton_2"),
	image("titlescreen/character3", "title_skeleton_3"),
	image("titlescreen/character4", "title_skeleton_4"),

	// Brushes
	image("brushes/soft_brush", "soft_brush"),
	image("brushes/bite_brush", "bite_brush"),

	// Misc
	image("circle", "circle"),

	/* Scenes */

	// Cutscenes
	image("scenes/cutscene/0_crimes", "0_crimes"),
	image("scenes/cutscene/1_intro", "1_intro"),
	image("scenes/cutscene/2_dig", "2_dig"),
	image("scenes/cutscene/3_loot", "3_loot"),
	image("scenes/cutscene/4_shoes", "4_shoes"),
	image("scenes/cutscene/5_package", "5_package"),
	image("scenes/cutscene/6_baseball", "6_baseball"),
	image("scenes/cutscene/7_argument", "7_argument"),
	image("scenes/cutscene/8_court", "8_court"),
	image("scenes/cutscene/9_dinner", "9_dinner"),
	image("scenes/cutscene/10_bomb", "10_bomb"),
	image("scenes/cutscene/11_defused", "11_defused"),
	image("scenes/cutscene/12_miku", "12_miku"),
	image("scenes/cutscene/13_victory", "13_victory"),
	image("scenes/cutscene/14_final", "14_final"),

	// Baseball scene
	image("scenes/baseball/background", "baseball_background"),
	image("scenes/baseball/trackway", "trackway"),
	image("scenes/baseball/bone_bat", "bone_bat"),

	// Boxing scene
	image("scenes/boxing/BGboxingring", "boxing_background"),
	image("scenes/boxing/heart", "boxing_heart"),
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
	image("scenes/computer/popupdiagonal", "computer_popup_blank_diagonal"),
	image("scenes/computer/popuphorizontal", "computer_popup_blank_horizontal"),

	image("scenes/computer/close_horizontal", "close_horizontal"),
	image("scenes/computer/ibone_popup_horizontal", "computer_ibone_horizontal"),

	// Court scene
	image("scenes/court/bgCourt", "court_background"),
	image("scenes/court/foregroundTable", "court_foreground"),
	image("scenes/court/skeletourneyIdle", "court_skeleton_idle"),
	image("scenes/court/skeletourneyObjection1", "court_skeleton_objection_1"),
	image("scenes/court/skeletourneyObjection2", "court_skeleton_objection_2"),

	// Dig scene
	image("scenes/dig/background", "dig_background"),
	image("scenes/dig/foreground", "dig_foreground"),
	image("scenes/dig/dirt", "dig_dirt"),
	image("scenes/dig/shoe", "dig_shoe"),
	image("scenes/dig/shovel", "dig_shovel"),

	// Dishes scene
	image("scenes/dishes/background", "dishes_background"),
	image("scenes/dishes/foreground", "dishes_foreground"),
	image("scenes/dishes/dirt", "dishes_dirt"),
	image("scenes/dishes/plate", "dishes_plate"),
	image("scenes/dishes/sponge", "dishes_sponge"),
	image("scenes/dishes/plate_bomb", "dishes_bomb"),

	// Drivethru scene
	image("scenes/drivethru/background", "drivethru_background"),
	image("scenes/drivethru/burger", "drivethru_burger"),
	image("scenes/drivethru/coffe", "drivethru_coffe"),
	image("scenes/drivethru/fries", "drivethru_fries"),
	image("scenes/drivethru/nuggets", "drivethru_nuggets"),
	image("scenes/drivethru/salad", "drivethru_salad"),
	image("scenes/drivethru/soda", "drivethru_soda"),

	// Ironing scene
	image("scenes/ironing/background", "ironing_background"),
	image("scenes/ironing/iron", "ironing_iron"),
	image("scenes/ironing/shirt", "ironing_shirt"),
	image("scenes/ironing/shirt_ironed", "ironing_shirt_ironed"),

	// Polish scene
	image("scenes/polish/background", "polish_background"),
	image("scenes/polish/dirt", "polish_dirt"),
	image("scenes/polish/shoe", "polish_shoe"),
	image("scenes/polish/sparkles", "polish_sparkles"),
	image("scenes/polish/brush", "polish_brush"),

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
	image("scenes/bomb/rip", "rip"),
	image("scenes/bomb/c_alt", "c_alt"),
];

/* Spritesheets */
const spritesheets: SpriteSheet[] = [
	spritesheet("effects/meme_explosion", "meme_explosion", 200, 282),

	spritesheet("sprites/enter_button", "enter_button", 100, 100),
	spritesheet("sprites/button_text", "text_button", 120, 120),
	spritesheet("sprites/erase_button", "erase_button", 100, 100),

	spritesheet("audio", "audio", 300, 300),
	spritesheet("music", "music", 300, 300),
	spritesheet('sprites/arrow_button', 'arrow_button', 512, 512),
	spritesheet('sprites/batting_button', 'batting_button', 256, 256),
	spritesheet('sprites/pitcher', 'pitcher', 256, 256),
	spritesheet('sprites/batter', 'batter', 256, 256),
	spritesheet('sprites/ball', 'ball', 128, 128)
];

/* Audios */
const audios: Audio[] = [
	// Placeholder template
	music("title", "m_main_menu"),
	music("first", "m_first"),
	music("Do the Funky Strut", "m_funky"),
	music("Action Preparation", "m_tense"),
	music("air_on_g", "m_air_on_g"),
	sound("tree/rustle", "t_rustle", 0.5),
	sound("w_explosion", "w_explosion", 0.5),

	/* Scenes */

	// Baseball scene
	sound("baseball/smashping", "baseball_smashping"),
	sound("baseball/ball_hit", "ball_hit"),
	sound("baseball/ball_miss", "ball_miss"),
	sound("baseball/announcer_q", "announcer_q"),
	sound("baseball/meme_explosion_sound", "meme_explosion_sound"),
	sound("baseball/lag_sound", "lag_sound"),
	sound("baseball/fail", "fail_run"),
	sound("baseball/memescream", "memescream"),

	// Boxing scene
	sound("boxing/punch1", "boxing_punch1"),
	sound("boxing/punch2", "boxing_punch2"),
	sound("boxing/punch3", "boxing_punch3"),
	sound("boxing/tunsingle", "boxing_tunsingle"),
	sound("boxing/tundouble", "boxing_tundouble"),

	// Computer scene
	sound("computer/navigationstart", "computer_click"),
	sound("computer/balloon", "computer_popup"),

	// Dig scene

	// Dishes scene
	sound("dishes/rub", "dishes_rub"),
	sound("dishes/wipe", "dishes_wipe"),
	sound("dishes/sparkle", "dishes_sparkle"),

	// Drivethru scene
	sound("drivethru/os_beep_success", "drivethru_success"),
	sound("drivethru/os_beep_failure", "drivethru_failure"),
	sound("drivethru/sim_startclick", "drivethru_clickdown"),
	sound("drivethru/sim_stopclick", "drivethru_clickup"),

	// Ironing scene

	//Bomb scene
	sound("bomb/bad_beep", "beep", 0.5),
	sound("bomb/button", "button_press", 0.5),
	sound("bomb/victory", "victory", 0.5),
	sound("bomb/meme_explosion", "meme_explosion", 0.5),
	sound("bomb/fail_1", "fail_1", 0.5),
	sound("bomb/fail_2", "fail_2", 0.5),
	sound("bomb/fail_3", "fail_3", 0.5),
	sound("bomb/success", "success", 0.5),
	sound("bomb/darksouls", "darksouls", 0.5),
	sound("bomb/alarm", "alarm", 0.5),
	sound("bomb/no", "no", 0.5),
];

/* Fonts */
await loadFont("Pangolin-Regular", "Game Font");

export { images, spritesheets, audios };
