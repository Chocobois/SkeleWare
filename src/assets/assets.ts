import { Image, SpriteSheet, Audio } from "./util";
import { image, sound, music, loadFont, spritesheet } from "./util";

/* Images */
const images: Image[] = [
	// Titlescreen
	image("titlescreen/sky", "title_sky"),
	image("titlescreen/background", "title_background"),
	image("titlescreen/foreground", "title_foreground"),
	image("titlescreen/character", "title_character"),

	// Dishes
	image("scenes/dishes/background", "dishes_background"),
	image("scenes/dishes/dirt", "dishes_dirt"),
	image("scenes/dishes/plate", "dishes_plate"),
	image("scenes/dishes/sparkles", "dishes_sparkles"),
	image("scenes/dishes/sponge", "dishes_sponge"),

	// Court
	image("scenes/court/bgCourt", "court_background"),
	image("scenes/court/foregroundTable", "court_foreground"),
	image("scenes/court/skeletoruneyIdle", "court_skeleton_idle"),
	image("scenes/court/skeletoruneyObjection1", "court_skeleton_objection_1"),
	image("scenes/court/skeletoruneyObjection2", "court_skeleton_objection_2"),
	// Testing
	image("scenes/test_background", "test_background"),
	image("scenes/test_foreground", "test_foreground"),
];

/* Spritesheets */
const spritesheets: SpriteSheet[] = [];

/* Audios */
const audios: Audio[] = [
	music("title", "m_main_menu"),
	music("first", "m_first"),
	sound("tree/rustle", "t_rustle", 0.5),
];

/* Fonts */
await loadFont("Sketch", "Game Font");

export { images, spritesheets, audios };