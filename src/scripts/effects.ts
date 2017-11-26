import * as PIXI from "pixi.js";

export class EffectManager extends PIXI.Container {
	private score_label: PIXI.Sprite;
	private miss_label: PIXI.Sprite;
	private game_start_label: Effect;
	private game_over_label: Effect;
	private arai_san_label: Effect;
	private fennec_label: Effect;
	private catch_effect: Array<Effect>;
	private miss_effect: Array<Effect>;

	private title_animation_counter: number;
	constructor(private stage: PIXI.Container) {
		super();
		stage.addChild(this);
		this.init();
		this.resetGame();
	}
	init() {
		const bt = PIXI.loader.resources["misc"].texture.baseTexture;
		this.score_label = new PIXI.Sprite(new PIXI.Texture(bt, new PIXI.Rectangle(1, 1, 14, 5)));
		this.score_label.setTransform(1, 1);
		this.addChild(this.score_label);
		this.miss_label = new PIXI.Sprite(new PIXI.Texture(bt, new PIXI.Rectangle(113, 1, 14, 5)));
		this.miss_label.setTransform(113, 1);
		this.addChild(this.miss_label);
		this.game_start_label = new Effect(new PIXI.Texture(bt, new PIXI.Rectangle(25, 57, 81, 5)), 0);
		this.game_start_label.setTransform(25, 57);
		this.addChild(this.game_start_label);
		this.game_over_label = new Effect(new PIXI.Texture(bt, new PIXI.Rectangle(53, 49, 22, 21)), 0);
		this.game_over_label.setTransform(53, 49);
		this.addChild(this.game_over_label);
		this.arai_san_label = new Effect(new PIXI.Texture(bt, new PIXI.Rectangle(25, 72, 86, 6)), 0);
		this.arai_san_label.setTransform(25, 72);
		this.addChild(this.arai_san_label);
		this.fennec_label = new Effect(new PIXI.Texture(bt, new PIXI.Rectangle(27, 41, 76, 5)), 0);
		this.fennec_label.setTransform(27, 41);
		this.addChild(this.fennec_label);
		this.catch_effect = [
			new Effect(new PIXI.Texture(bt, new PIXI.Rectangle(31, 90, 13, 13)), 0),
			new Effect(new PIXI.Texture(bt, new PIXI.Rectangle(49, 90, 31, 13)), 0),
			new Effect(new PIXI.Texture(bt, new PIXI.Rectangle(84, 90, 13, 13)), 0)
		];
		this.catch_effect[0].setTransform(31, 90);
		this.catch_effect[1].setTransform(49, 90);
		this.catch_effect[2].setTransform(84, 90);
		for (const ef of this.catch_effect) this.addChild(ef);
		this.miss_effect = [
			new Effect(new PIXI.Texture(bt, new PIXI.Rectangle(39, 104, 5, 6)), 0),
			new Effect(new PIXI.Texture(bt, new PIXI.Rectangle(49, 104, 31, 6)), 0),
			new Effect(new PIXI.Texture(bt, new PIXI.Rectangle(84, 104, 5, 6)), 0)
		];
		this.miss_effect[0].setTransform(39, 104);
		this.miss_effect[1].setTransform(49, 104);
		this.miss_effect[2].setTransform(84, 104);
		for (const ef of this.miss_effect) this.addChild(ef);
	}
	update() {
		for (const sprite of this.children) {
			if (!(sprite instanceof Effect)) continue;
			(sprite as Effect).update();
		}
		if (this.title_animation_counter > 0) {
			this.title_animation_counter -= 1;
			if (this.title_animation_counter === 0) {
				this.arai_san_label.setLife(2);
				this.catch_effect[1].setLife(2);
				this.arai_san_label.once("die", () => {
					this.title_animation_counter = 2;
				});
			}
		}
	}
	resetGame() {
		this.game_start_label.setLife(0);
		this.game_over_label.setLife(0);
		this.arai_san_label.setLife(0);
		this.fennec_label.setLife(0);
		for (const ef of this.catch_effect) ef.setLife(0);
		for (const ef of this.miss_effect) ef.setLife(0);
		this.title_animation_counter = 2;
	}
	title() {
		this.arai_san_label.setLife(2);
		this.arai_san_label.once("die", () => {
			this.title_animation_counter = 2;
		});
		this.catch_effect[1].setLife(2);
	}
	startGame() {
		this.arai_san_label.removeAllListeners();
		this.arai_san_label.setLife(0);
		this.catch_effect[1].setLife(0);
		this.game_start_label.setLife(10);
		this.title_animation_counter = -1;
	}
	gameOver() {
		this.game_over_label.setLife(10);
		this.miss_effect[1].setLife(10);
		this.game_over_label.once("die", () => {
			this.emit("return-to-title");
		})
	}
	catchHat(x: number) {
		this.catch_effect[x].setLife(2);
	}
	miss(x: number) {
		this.miss_effect[x].setLife(2);
	}
	getCoolScore() {
		this.fennec_label.setLife(10);
	}
}

export class Effect extends PIXI.Sprite {
	private _state: "live" | "die" | "immortal";
	get state(): "live" | "die" | "immortal" {
		return this._state;
	}
	constructor(texture: PIXI.Texture, private life: number) {
		super(texture);
		this.setLife(life);
	}
	setLife(life: number) {
		this.life = life;
		if (this.life > 0) {
			this._state = "live";
			this.visible = true;
		}
		else if (this.life === 0) {
			this._state = "die";
			this.visible = false;
		}
		else {
			this._state = "immortal";
			this.visible = true;
		}
	}
	update() {
		if (this.life > 0) {
			this.life -= 1;
			if (this.life <= 0) {
				this._state = "die";
				this.visible = false;
				this.emit("die");
			}
		}
	}
}