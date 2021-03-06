import * as PIXI from "pixi.js";
import {AraiSan, Fennec, Hat} from "./entities";
import EventEmitter = PIXI.utils.EventEmitter;
import {ScoreManager} from "./score";

export class EntityManager extends EventEmitter {
	private arai_san: AraiSan;
	private fennec: Fennec;
	private hats: PIXI.Container;

	get player(): AraiSan {
		return this.arai_san;
	}

	constructor(private stage: PIXI.Container, renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer, score: ScoreManager) {
		super();
		this.init(renderer, score);
	}

	private createHat(n: number): Hat {
		// Hat Factory
		const result = new Hat(n);
		// add some callback
		result.on("miss", () => {
			this.emit("miss", this.arai_san.getGridX());
		});
		return result;
	}

	init(renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer, score: ScoreManager) {
		// init entities
		AraiSan.initTextures();
		this.arai_san = new AraiSan();
		this.stage.addChild(this.arai_san);

		Fennec.initTextures();
		this.fennec = new Fennec(score);
		this.stage.addChild(this.fennec);

		Hat.initTextures();
		this.hats = new PIXI.Container();
		this.stage.addChild(this.hats);

		// set callbacks
		this.arai_san.on("check-catch", () => this.arai_san.checkCatch(this.hats)); // hatsの参照を流し込む
		this.arai_san.on("move-auto", () => this.arai_san.moveAuto(this.hats)); // hatsの参照を流し込む

		this.arai_san.on("catch", (hat: Hat) => {
			// x: アライさんの位置
			let x = hat.getGridX();
			if (x === 2) x = 1;
			else if (x === 4) x = 2;
			hat.caught();
			this.emit("catch", x);
		});

		this.arai_san.on("re-render", () => renderer.render(this.stage)); // 再描画

		this.fennec.on("drop", (n: number) => {
			this.hats.addChild(this.createHat(n));
		});
	}

	update() {
		for (const hat of this.hats.children) {
			(hat as Hat).update(); // downcast
		}
		this.arai_san.update();
		this.arai_san.checkCatch(this.hats);
		this.fennec.update();

		// remove dead hats
		for (const hat of this.hats.children.slice()) {
			if (!(hat as Hat).isAlive()) {
				this.hats.removeChild(hat);
			}
		}
	}

	resetGame() {
		this.arai_san.reset();
		this.fennec.reset();
		this.stage.removeChild(this.hats);
		this.hats.destroy();
		this.hats = new PIXI.Container();
		this.stage.addChild(this.hats);
	}
}