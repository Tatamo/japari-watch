import * as PIXI from "pixi.js";
import {ScoreManager} from "./score";
import {EntityManager} from "./entitymanager";
import {InputController} from "./input";
import {EffectManager} from "./effects";
import EventEmitter = PIXI.utils.EventEmitter;

export type GameState = "title" | "in-game" | "gameover";

export class Game extends EventEmitter {
	state: GameState;
	high_score: number;
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
		super();
		this.state = "title";
		this.high_score = 0;
		PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

		this.ticker = new PIXI.ticker.Ticker();
		this.ticker.speed = 1 / 60;
		this.ticker.add((() => {
			const tick_interval = 0.3;
			let tick_count = -1.5; // 最初のupdateだけ時間をかける (スプライト全表示を見せるため)
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
		PIXI.loader.add("all_sprites", "assets/sprite.png");
		PIXI.loader.load(this.setup.bind(this)); // おまじない
	}

	// called after loading
	setup() {
		this.background = new PIXI.Sprite(PIXI.loader.resources["background"].texture);
		this.stage.addChild(this.background);
		this.renderer.render(this.stage);

		this.entity_manager = new EntityManager(this.stage, this.renderer);
		this.score_manager = new ScoreManager(this.stage, 1, 8);
		this.miss_manager = new ScoreManager(this.stage, 113, 8);
		this.effect_manager = new EffectManager(this.stage);


		this.entity_manager.on("catch", (x: number) => {
			this.score_manager.addScore();
			if (this.score_manager.score > this.high_score) {
				this.high_score = this.score_manager.score;
				this.emit("high-score", this.high_score);
			}
			this.effect_manager.catchHat(x);
			if ([10, 20, 30, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 999].indexOf(this.score_manager.score) !== -1) {
				// 高スコアを達成するとフェネックがほめてくれるのだ
				this.effect_manager.getCoolScore();
			}
			if (this.score_manager.score % 200 == 0 || this.score_manager.score === 998) {
				// スコア200ごとにミスのカウントをリセット
				this.miss_manager.resetScore();
			}
		});

		this.entity_manager.on("miss", (x: number) => {
			this.miss_manager.addScore();
			this.effect_manager.miss(x);
			if (this.miss_manager.score >= 3) {
				this.state = "gameover";
				this.emit("gameover", this.score_manager.score);
				this.entity_manager.resetGame();
				this.effect_manager.gameOver();
			}
		});

		const startGame = () => {
			this.state = "in-game";
			this.effect_manager.startGame();
			this.emit("start");
		};
		const getInput = (key: "left" | "right" | "reset") => {
			if (this.state === "title") {
				startGame();
			}
			else if (this.state === "in-game") {
				switch (key) {
					case "left":
						this.entity_manager.player.moveLeft();
						break;
					case "right":
						this.entity_manager.player.moveRight();
						break;
					case "reset":
						this.resetGame();
						break;
				}
			}
		};

		this.input.on("keydown", (key: number) => {
			if (key === 37) getInput("left");
			else if (key === 39) getInput("right");
			else if (key === 84) getInput("reset");
		});
		this.effect_manager.on("return-to-title", () => {
			this.resetGame();
		});

		const left_button = new PIXI.Sprite(PIXI.Texture.EMPTY);
		this.stage.addChild(left_button);
		left_button.x = left_button.y = 0;
		left_button.height = 128;
		left_button.width = 64;
		left_button.interactive = true;
		left_button.on("click", () => getInput("left"));
		left_button.on("touchstart", () => getInput("left"));

		const right_button = new PIXI.Sprite(PIXI.Texture.EMPTY);
		this.stage.addChild(right_button);
		right_button.x = 64;
		right_button.y = 0;
		right_button.height = 128;
		right_button.width = 64;
		right_button.interactive = true;
		right_button.on("click", () => getInput("right"));
		right_button.on("touchstart", () => getInput("right"));

		this.score_manager.resetScore();
		this.miss_manager.resetScore();
		this.effect_manager.title();

		const initial_view = new PIXI.Sprite(PIXI.loader.resources["all_sprites"].texture);
		this.stage.addChild(initial_view);
		this.renderer.render(this.stage);
		this.stage.removeChild(initial_view);

		this.ticker.start();
	}

	update() {
		if (this.state === "in-game") {
			this.entity_manager.update();
		}
		this.effect_manager.update();
		this.renderer.render(this.stage);
	}

	resetGame() {
		this.state = "title";
		this.score_manager.resetScore();
		this.miss_manager.resetScore();
		this.entity_manager.resetGame();
		this.effect_manager.resetGame();
		this.effect_manager.title();
		this.emit("title");
		this.renderer.render(this.stage);
	}
}