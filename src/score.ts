import * as PIXI from "pixi.js";

export class ScoreManager extends PIXI.Container {
	private _score: number;
	get score(): number {
		return this._score;
	}
	private score_sprites: Array<SevenSeg>;
	constructor(private stage: PIXI.Container, x: number, y: number) { // (1,8), (113,8)
		super();
		SevenSeg.initTextures();
		this.score_sprites = [new SevenSeg(x, y, 8), new SevenSeg(x + 5, y, 8), new SevenSeg(x + 10, y, 8)];
		for (let i = 0; i < 3; i++) this.addChild(this.score_sprites[i]);
		stage.addChild(this);
	}
	addScore() {
		if (this._score < 999) {
			this._score += 1;
		}
	}
	resetScore() {
		this._score = 0;
	}
	private updateScore() {
		const score_numbers = [Math.floor(this.score / 100), Math.floor((this.score / 10) % 10), Math.floor(this.score % 10)];
		for (let i = 0; i < 3; i++) {
			this.score_sprites[i].setNumber(score_numbers[i]);
		}
	}
}

export class SevenSeg extends PIXI.Sprite {
	static textures: Array<PIXI.Texture> = [];
	static is_initialized: boolean = false;
	static initTextures() {
		if (this.is_initialized) return;
		for (let i = 0; i <= 9; i++) {
			this.textures.push(new PIXI.Texture(PIXI.loader.resources["numbers"].texture.baseTexture, new PIXI.Rectangle(i * 5, 0, 4, 7)));
		}
		this.is_initialized = true;
	}
	private _num: number;
	get num(): number {
		return this._num;
	}
	constructor(x: number, y: number, n: number) {
		super();
		this.x = x;
		this.y = y;
		this.setNumber(n);
	}
	setNumber(n: number) {
		if (n < 0) n *= -1;
		if (n > 9) n %= 10;
		this._num = Math.floor(n);
		this.texture = SevenSeg.textures[n];
	}
}