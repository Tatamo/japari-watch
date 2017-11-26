import * as PIXI from "pixi.js";
import {ScoreManager} from "./score";
import {EntityManager} from "./entitymanager";
import {InputController} from "./input";
import {EffectManager} from "./effects";

export class Game {
	ticker: PIXI.ticker.Ticker;
	renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
	stage: PIXI.Container;
	background: PIXI.Sprite;
	entity_manager: EntityManager;
	score_manager: ScoreManager;
	miss_manager: ScoreManager;
	effect_manager: EffectManager;
	input: InputController;
	constructor(parent: HTMLElement) {
		PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

		this.ticker = new PIXI.ticker.Ticker();
		this.ticker.speed = 1 / 60;
		this.ticker.add((() => {
			const tick_interval = 1 / 3;
			let tick_count = 0;
			return ((delta: number) => {
				tick_count += delta;
				if (tick_count < tick_interval) return;
				tick_count = 0;
				this.update();
			})
		})());

		this.renderer = PIXI.autoDetectRenderer(512, 512);
		parent.appendChild(this.renderer.view);

		this.stage = new PIXI.Container();
		this.stage.scale.x = this.stage.scale.y = 4.0;

		this.input = new InputController();
		this.loadAssets();
	}
	loadAssets() {
		PIXI.loader.add("background", "assets/background.png");
		PIXI.loader.add("arai_san", "assets/arai_san.png");
		PIXI.loader.add("fennec", "assets/fennec.png");
		PIXI.loader.add("hats", "assets/hats.png");
		PIXI.loader.add("numbers", "assets/numbers.png");
		PIXI.loader.add("misc", "assets/misc.png");
		PIXI.loader.load(this.setup.bind(this)); // おまじない
	}
	// called after loading
	setup() {
		this.background = new PIXI.Sprite(PIXI.loader.resources["background"].texture);
		this.stage.addChild(this.background);
		this.renderer.render(this.stage);

		this.entity_manager = new EntityManager(this.stage, this.input, this.renderer);
		this.score_manager = new ScoreManager(this.stage, 1, 8);
		this.miss_manager = new ScoreManager(this.stage, 113, 8);
		this.effect_manager = new EffectManager(this.stage);


		this.entity_manager.on("catch", (x: number) => {
			this.score_manager.addScore();
			this.effect_manager.catchHat(x);
		});

		this.entity_manager.on("miss", (x: number) => {
			this.miss_manager.addScore();
			this.effect_manager.miss(x);
		});

		this.score_manager.resetScore();
		this.miss_manager.resetScore();
		this.renderer.render(this.stage);
		this.ticker.start();
	}

	update() {
		this.entity_manager.update();
		this.effect_manager.update();
		this.renderer.render(this.stage);
	}
}