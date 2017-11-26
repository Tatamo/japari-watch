import * as PIXI from "pixi.js";

/*
アライさん
gridx: 左の列から順に[0,2]
 */
export class AraiSan extends PIXI.Sprite {
	static spritesheet_position: Array<Array<number>> = [[16, 97, 24, 30], [51, 97, 27, 30], [88, 97, 24, 30]];
	static textures: Array<PIXI.Texture> = [];
	static is_initialized: boolean = false;
	private gridx: number;
	static initTextures() {
		if (this.is_initialized) return;
		for (const pos of this.spritesheet_position) {
			this.textures.push(new PIXI.Texture(PIXI.loader.resources["arai_san"].texture.baseTexture, new PIXI.Rectangle(...pos)));
		}
		this.is_initialized = true;
	}
	constructor() {
		super();
		this.gridx = 1;
		this.updateTexture();
	}
	update() {
		this.updateTexture();
		this.emit("update");
	}
	updateTexture() {
		this.texture = AraiSan.textures[this.gridx];
		this.x = AraiSan.spritesheet_position[this.gridx][0];
		this.y = AraiSan.spritesheet_position[this.gridx][1];
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
	static initTextures() {
		if (this.is_initialized) return;
		for (const pos of this.spritesheet_position) {
			this.textures.push(new PIXI.Texture(PIXI.loader.resources["fennec"].texture.baseTexture, new PIXI.Rectangle(...pos)));
		}
		this.is_initialized = true;
	}
	constructor() {
		super();
		this.gridx = 2;
		this.hat_wait = 0;

		this.updateTexture();
	}
	update() {
		// 動くか帽子を落とすか決める
		if (this.hat_wait > 0) {
			// 帽子を落としたばかりなら必ず移動
			this.hat_wait -= 1;
			this.move();
		}
		else {
			// 33%の確率で帽子を落とす
			if (Math.random() < 0.33) {
				this.drop();
				this.hat_wait = 4;
			}
			else {
				this.move();
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
	move() {
		if (this.gridx <= 0) this.gridx = 1;
		else if (this.gridx >= 3) this.gridx = 2;
		else {
			this.gridx += Math.random() < 0.5 ? -1 : 1;
		}
	}
	drop() {
		this.emit("drop", this.gridx);
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

		if (this.gridy >= 10) {
			this.emit("miss");
		}

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
			}
			else {
				this.gridy += 1;
			}
		}
		else if (this.gridy === 9) {
			this.gridy += 1;
		}
	}
	caught() {
		this.is_caught = true;
	}
}