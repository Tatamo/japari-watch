import * as PIXI from "pixi.js";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const ticker = new PIXI.ticker.Ticker();
ticker.speed = 1 / 60;
const renderer = PIXI.autoDetectRenderer(512, 512);
const stage = new PIXI.Container();

document.body.appendChild(renderer.view);

PIXI.loader.add("background", "assets/background.png");
PIXI.loader.add("sprite", "assets/sprite.png");
PIXI.loader.load(setup);

let background: PIXI.Sprite;
let sprite: PIXI.Sprite;

function setup() {
	background = new PIXI.Sprite(PIXI.loader.resources["background"].texture);
	background.scale.x = background.scale.y = 4.0;
	sprite = new PIXI.Sprite(PIXI.loader.resources["sprite"].texture);

	stage.addChild(background);
	stage.addChild(sprite);
	renderer.render(stage);
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

function update() {
	sprite.x += 10;
	renderer.render(stage);
}