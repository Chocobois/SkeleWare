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

	// Baseball scene
	image("scenes/baseball/background", "baseball_background"),

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
	image("scenes/dishes/dirt", "dishes_dirt"),
	image("scenes/dishes/plate", "dishes_plate"),
	image("scenes/dishes/sparkles", "dishes_sparkles"),
	image("scenes/dishes/sponge", "dishes_sponge"),

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
];

/* Spritesheets */
const spritesheets: SpriteSheet[] = [
	spritesheet("effects/meme_explosion", "meme_explosion", 200, 282),
];

/* Audios */
const audios: Audio[] = [
	// Placeholder template
	music("title", "m_main_menu"),
	music("first", "m_first"),
	sound("tree/rustle", "t_rustle", 0.5),
	sound("w_explosion", "w_explosion", 0.5),

	/* Scenes */

	// Baseball scene
	sound("baseball/smashping", "baseball_smashping"),

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
	
];

/* Fonts */
await loadFont("DynaPuff-Medium", "Game Font");

export { images, spritesheets, audios };
