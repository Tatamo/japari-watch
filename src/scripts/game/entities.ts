import * as PIXI from "pixi.js";
import {ScoreManager} from "./score";

/*
アライさん
gridx: 左の列から順に[0,2]
 */
export class AraiSan extends PIXI.Sprite {
	static spritesheet_position: Array<Array<number>> = [[16, 97, 24, 30], [51, 97, 27, 30], [88, 97, 24, 30]];
	static textures: Array<PIXI.Texture> = [];
	static is_initialized: boolean = false;
	private gridx: number;
	private aimode: boolean;

	static initTextures() {
		if (this.is_initialized) return;
		for (const pos of this.spritesheet_position) {
			this.textures.push(new PIXI.Texture(PIXI.loader.resources["arai_san"].texture.baseTexture, new PIXI.Rectangle(...pos)));
		}
		this.is_initialized = true;
	}

	constructor() {
		super();
		this.aimode = false;
		this.reset();
	}

	getGridX(): number {
		return this.gridx;
	}

	getAIMode(): boolean {
		return this.aimode;
	}

	setAIMode(mode: boolean) {
		this.aimode = mode;
	}

	update() {
		if (this.aimode) this.emit("move-auto");
		this.updateTexture();
		this.emit("update");
	}

	updateTexture() {
		this.texture = AraiSan.textures[this.gridx];
		this.x = AraiSan.spritesheet_position[this.gridx][0];
		this.y = AraiSan.spritesheet_position[this.gridx][1];
	}

	reset() {
		this.gridx = 1;
		this.updateTexture();
	}

	moveAuto(hats: PIXI.Container) {
		let target: Hat | null = null;
		for (const hat of hats.children) {
			if (!(hat as Hat).isAlive() || (hat as Hat).isCaught() || (hat as Hat).getGridY() > 10) continue;
			if (target === null) target = hat as Hat;
			else if ((hat as Hat).getGridY() > target.getGridY()) {
				target = hat as Hat;
			}
		}
		if (target === null) {
			// move random
			const rand = Math.random();
			if (rand < 0.4) this.moveLeft();
			else if (rand < 0.8) this.moveRight();
			return;
		}
		// 帽子の落下予測位置とそれまでの時間を予測
		let hx = target.getGridX();
		let hy = target.getGridY();
		let dir = target.getDirection();

		let goal_x = -1;
		let time_remain = 0;
		while (hy < 10) {
			if (hy === 9 && hx === 0) {
				goal_x = 0;
				break;
			}
			else if (hy === 8 && hx === 2) {
				goal_x = 1;
				break;
			}
			else if (hy === 9 && hx === 4) {
				goal_x = 2;
				break;
			}

			if (hy < 8) {
				// 斜めに落ちていく
				hx += dir;
				if (dir === 1 && hx >= 4 ||
					dir === -1 && hx <= 0) {
					dir *= -1;
				}
				hy += 1;
			}
			else if (hy === 8) {
				if (hx === 2) {
					// center
					hx += dir;
					hy += 2;
				}
				else {
					hy += 1;
				}
			}
			else if (hy === 9) {
				hy += 1;
			}
			time_remain += 1;
		}

		if (Math.abs(goal_x - this.gridx) > time_remain) {
			// ぼうしに向かわないと間に合わない
			if (goal_x < this.gridx) this.moveLeft();
			else if (goal_x > this.gridx) this.moveRight();
			if (Math.abs(goal_x - this.gridx) > time_remain) {
				setTimeout(() => {
					if (goal_x < this.gridx) this.moveLeft();
					else if (goal_x > this.gridx) this.moveRight();
				}, 130);
			}
			return;
		}
		if (goal_x === this.gridx && time_remain <= 1) {
			// 動くと間に合わなくなる
			return;
		}

		// 一番近いぼうしに寄せるような動きをする
		// x: アライさんの望ましい位置
		let x: number;
		if (target.getDirection() === -1) {
			if (target.getGridX() <= 1) x = 0;
			else if (target.getGridX() <= 3) x = 1;
			else x = 2;
		}
		else {
			if (target.getGridX() <= 0) x = 0;
			else if (target.getGridX() <= 2) x = 1;
			else x = 2;
		}
		if (Math.random() < 0.85) { // 85%でしか採用しない
			if (x < this.gridx) {
				this.moveLeft();
				return;
			}
			else if (x > this.gridx) {
				this.moveRight();
				return;
			}
		}

		// move random
		const rand = Math.random();
		if (this.gridx === 1) {
			if (rand < 0.33) this.moveLeft();
			else if (rand < 0.66) this.moveRight();
		}
		else {
			if (rand < 0.5) this.moveLeft();
			else this.moveRight();
		}
	}

	moveLeft() {
		this.gridx -= 1;
		if (this.gridx < 0) this.gridx = 0;
		this.updateTexture();
		this.emit("check-catch");
		this.emit("re-render");
	}

	moveRight() {
		this.gridx += 1;
		if (this.gridx > 2) this.gridx = 2;
		this.updateTexture();
		this.emit("check-catch");
		this.emit("re-render");
	}

	checkCatch(hats: PIXI.Container) {
		for (const hat of hats.children) {
			if (!(hat instanceof Hat)) continue;
			const hx = hat.getGridX();
			const hy = hat.getGridY();
			if (hy === 8 && hx === 2 && this.gridx === 1 ||
				hy === 9 && hx === 0 && this.gridx === 0 ||
				hy === 9 && hx === 4 && this.gridx === 2) {
				if (!hat.isCaught()) {
					this.emit("catch", hat);
				}
			}
		}
	}
}

class Queue<T> {
	private _in: Array<T>;
	private _out: Array<T>;

	get length(): number {
		return this._in.length + this._out.length;
	}

	constructor(iterable?: Iterable<T>) {
		this._in = iterable === undefined ? [] : [...iterable];
		this._out = [];
	}

	private _fix() {
		this._out = this._in.reverse().concat(this._out);
		this._in = [];
	}

	push(...values: Array<T>): void {
		this._in.push(...values);
	}

	shift(): T | undefined {
		if (this._out.length == 0) this._fix();
		return this._out.pop();
	}

	toArray(): Array<T> {
		this._fix();
		return this._out.slice().reverse();
	}
}

/*
フェネック
gridx: 左の列から順に[0,3]
 */
export class Fennec extends PIXI.Sprite {
	static spritesheet_position: Array<Array<number>> = [[17, 1, 22, 23], [41, 1, 22, 23], [65, 1, 22, 23], [89, 1, 22, 23]];
	static textures: Array<PIXI.Texture> = [];
	static is_initialized: boolean = false;
	private gridx: number;
	private hat_wait: number;
	private action_queue: Queue<"left" | "right" | "drop">; // 行動キュー
	private counter: number; // 行動決定に使用するためのカウンター
	private difficulty_border_init: number;
	private difficulty_border: number;

	static initTextures() {
		if (this.is_initialized) return;
		for (const pos of this.spritesheet_position) {
			this.textures.push(new PIXI.Texture(PIXI.loader.resources["fennec"].texture.baseTexture, new PIXI.Rectangle(...pos)));
		}
		this.is_initialized = true;
	}

	constructor(private game_score: ScoreManager) {
		super();
		this.difficulty_border_init = 50;
		this.difficulty_border = 200;
		this.reset();
	}

	getHatWait(): number {
		// スコア200未満: 3
		// スコア400未満: 2
		// スコア600以上: 1
		if (this.game_score.score < this.difficulty_border) return 3;
		else if (this.game_score.score < this.difficulty_border * 2) return 2;
		return 1;
	}
	getDropPossibility(): number {
		let score = this.game_score.score;
		if (score < this.difficulty_border_init) return 0.33;
		if (score < this.difficulty_border) score -= this.difficulty_border_init;
		let s = score % this.difficulty_border;
		if (score >= this.difficulty_border * 3) s = this.difficulty_border;
		s /= this.difficulty_border;
		return 0.33 + 0.33 * s;
	}

	update() {
		// 動くか帽子を落とすか決める
		if (this.counter <= 0 && this.action_queue.length === 0) {
			// 一定回数ぼうしを落としたあとの行動を予め決めておく
			this.counter = Math.random() < 0.5 ? 3 : 4;

			const rand = Math.random();
			let wait = this.getHatWait() + (rand < 0.4 ? 0 : 1) + (rand < 0.8 ? 0 : 1); // +0:+1:+2 = 4:4:2
			let gx = this.gridx;

			// 基本的にはむりやり端まで移動して落とさせる
			while (wait > 3) {
				if (gx === 0 || gx <= 2 && Math.random() < 0.5) {
					this.action_queue.push("right");
					gx += 1;
				}
				else {
					this.action_queue.push("left");
					gx -= 1;
				}
				wait -= 1;
			}

			if (wait <= 1) {
				switch (gx) {
					case 0:
						this.action_queue.push("right", "left");
						break;
					case 1:
						this.action_queue.push("left");
						break;
					case 2:
						this.action_queue.push("right");
						break;
					case 3:
						this.action_queue.push("left", "right");
						break;
				}
			}
			else if (wait <= 2) {
				switch (gx) {
					case 0:
						this.action_queue.push("right", "left");
						break;
					case 1:
						this.action_queue.push("right", "right");
						break;
					case 2:
						this.action_queue.push("left", "left");
						break;
					case 3:
						this.action_queue.push("left", "right");
						break;
				}
			}
			else if (wait <= 3) {
				switch (gx) {
					case 0:
						this.action_queue.push("right", "right", "right");
						break;
					case 1:
						if (Math.random() < 0.5) this.action_queue.push("right", "left", "left");
						else this.action_queue.push("left", "right", "left");
						break;
					case 2:
						if (Math.random() < 0.5) this.action_queue.push("left", "right", "right");
						else this.action_queue.push("right", "left", "right");
						break;
					case 3:
						this.action_queue.push("left", "left", "left");
						break;
				}
			}
			this.action_queue.push("drop");
		}
		if (this.action_queue.length > 0) {
			// 行動が決定済み
			const action = this.action_queue.shift()!;
			if (action === "left" || action === "right") {
				this.move(action);
			}
			else {
				this.drop();
				this.hat_wait = this.getHatWait();
			}
		}
		else {
			if (this.hat_wait > 0) {
				// 帽子を落としたばかりなら必ず移動
				this.move();
			}
			else {
				// 一定の確率で帽子を落とす
				if (Math.random() < this.getDropPossibility()) {
					this.drop();
					this.hat_wait = this.getHatWait();
				}
				else {
					if (Math.random() < 0.9) this.move();
					else {
						// 反対側まで移動する
						switch (this.gridx) {
							case 0:
								this.move("right");
								this.action_queue.push("right", "right");
								break;
							case 1:
								this.move("right");
								this.action_queue.push("right");
								break;
							case 2:
								this.move("left");
								this.action_queue.push("left");
								break;
							case 3:
								this.move("left");
								this.action_queue.push("left", "left");
								break;
						}
					}
				}
			}
		}

		this.updateTexture();
		this.emit("update");
	}

	updateTexture() {
		this.texture = Fennec.textures[this.gridx];
		this.x = Fennec.spritesheet_position[this.gridx][0];
		this.y = Fennec.spritesheet_position[this.gridx][1];
	}

	move(dir?: "left" | "right") {
		this.hat_wait -= 1;
		if (dir === undefined) {
			if (this.gridx <= 0) this.gridx = 1;
			else if (this.gridx >= 3) this.gridx = 2;
			else {
				this.gridx += Math.random() < 0.5 ? -1 : 1;
			}
		}
		else if (dir === "left") {
			if (this.gridx > 0) this.gridx -= 1;
		}
		else if (this.gridx < 3) this.gridx += 1;
	}

	drop() {
		if (this.counter > 0) this.counter -= 1;
		this.emit("drop", this.gridx);
	}

	reset() {
		this.gridx = 2;
		this.hat_wait = 0;
		this.action_queue = new Queue<"left" | "right" | "drop">();
		this.counter = 3;
		this.updateTexture();
	}
}

/*
アライさんに似合いそうなぼうし
gridx: 左の列から順に[0,4]
gridy: 上の列から順に[0,10]
ただし最下段中央については、左を(x,y)=(1,10), 右を(x,y)=(3,10)とする
*/
export class Hat extends PIXI.Sprite {
	static spritesheet_position: Array<Array<Array<number> | null>> = [
		[[1, 22, 15, 10], null, [56, 23, 16, 9], null, [112, 22, 15, 10]],
		[null, [28, 31, 16, 9], null, [84, 31, 16, 9], null],
		[[1, 38, 15, 10], null, [56, 39, 16, 9], null, [112, 39, 15, 10]],
		[null, [28, 47, 16, 9], null, [84, 47, 16, 9], null],
		[[1, 54, 15, 10], null, [56, 55, 16, 9], null, [112, 54, 15, 10]],
		[null, [28, 63, 16, 9], null, [84, 63, 16, 9], null],
		[[1, 70, 15, 10], null, [56, 71, 16, 9], null, [112, 70, 15, 10]],
		[null, [28, 79, 16, 9], null, [84, 79, 16, 9], null],
		[[1, 86, 15, 10], null, [56, 87, 16, 9], null, [112, 86, 15, 10]],
		[[1, 102, 15, 10], null, null, null, [112, 102, 15, 10]],
		[[3, 115, 16, 12], [39, 115, 16, 12], null, [74, 115, 16, 12], [110, 115, 16, 12]]
	];
	static textures: Array<Array<PIXI.Texture | null>> = [];
	static is_initialized: boolean = false;
	private direction: -1 | 1; // -1 to left, +1 to right
	private gridx: number;
	private gridy: number;
	private remove_count: number;
	private is_caught: boolean;
	private alive: boolean;

	static initTextures() {
		if (this.is_initialized) return;
		for (const line of this.spritesheet_position) {
			this.textures.push([]);
			for (const pos of line) {
				if (pos === null) this.textures[this.textures.length - 1].push(null);
				else this.textures[this.textures.length - 1].push(new PIXI.Texture(PIXI.loader.resources["hats"].texture.baseTexture, new PIXI.Rectangle(...(pos!))));
			}
		}
		this.is_initialized = true;
	}

	constructor(fennec_x: number) {
		super();
		switch (fennec_x) {
			case 0:
				this.gridx = 0;
				this.direction = 1;
				break;
			case 1:
				this.gridx = 2;
				this.direction = 1;
				break;
			case 2:
				this.gridx = 2;
				this.direction = -1;
				break;
			case 3:
				this.gridx = 4;
				this.direction = -1;
		}
		this.gridy = 0;
		this.remove_count = 1;
		this.alive = true;

		this.updateTexture();
	}

	getGridX(): number {
		return this.gridx;
	}

	getGridY(): number {
		return this.gridy;
	}

	getDirection(): -1 | 1 {
		return this.direction;
	}

	isAlive(): boolean {
		return this.alive;
	}

	isCaught(): boolean {
		return this.is_caught;
	}

	update() {
		if ((this.gridy > 9 || this.is_caught) && this.remove_count > 0) {
			this.remove_count -= 1;
		}
		else if (this.remove_count <= 0) {
			this.alive = false;
		}

		if (!this.is_caught) this.move();

		this.updateTexture();
		this.emit("update");
	}

	updateTexture() {
		this.texture = Hat.textures[this.gridy][this.gridx]!;
		this.x = Hat.spritesheet_position[this.gridy][this.gridx]![0];
		this.y = Hat.spritesheet_position[this.gridy][this.gridx]![1];
	}

	move() {
		if (this.gridy < 8) {
			// 斜めに落ちていく
			this.gridx += this.direction;
			if (this.direction === 1 && this.gridx >= 4 ||
				this.direction === -1 && this.gridx <= 0) {
				this.direction *= -1;
			}
			this.gridy += 1;
		}
		else if (this.gridy === 8) {
			if (this.gridx === 2) {
				// center
				this.gridx += this.direction;
				this.gridy += 2;
				this.emit("miss");
			}
			else {
				this.gridy += 1;
			}
		}
		else if (this.gridy === 9) {
			this.gridy += 1;
			this.emit("miss");
		}
	}

	caught() {
		this.is_caught = true;
	}
}