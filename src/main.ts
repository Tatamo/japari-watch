import * as PIXI from "pixi.js";
import {EntityManager} from "./entitymanager";
import {ScoreManager} from "./score";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const ticker = new PIXI.ticker.Ticker();
ticker.speed = 1 / 60;
const renderer = PIXI.autoDetectRenderer(512, 512);
const stage = new PIXI.Container();

document.body.appendChild(renderer.view);

PIXI.loader.add("background", "assets/background.png");
PIXI.loader.add("arai_san", "assets/arai_san.png");
PIXI.loader.add("fennec", "assets/fennec.png");
PIXI.loader.add("hats", "assets/hats.png");
PIXI.loader.add("numbers", "assets/numbers.png");
PIXI.loader.add("misc", "assets/misc.png");
PIXI.loader.load(setup);

let background: PIXI.Sprite;
let entity_manager: EntityManager;

function setup() {
	background = new PIXI.Sprite(PIXI.loader.resources["background"].texture);

	stage.scale.x = stage.scale.y = 4.0;
	stage.addChild(background);
	renderer.render(stage);
	init();
	ticker.start();
}

ticker.add((() => {
	const tick_interval = 1 / 3;
	let tick_count = 0;
	return ((delta: number) => {
		tick_count += delta;
		if (tick_count < tick_interval) return;
		tick_count = 0;
		update();
	})
})());

function init() {
	entity_manager = new EntityManager(stage);
	const score_manager = new ScoreManager(stage, 1, 8);
	const miss_manager = new ScoreManager(stage, 113, 8);
}

function update() {
	entity_manager.update();
	renderer.render(stage);
}