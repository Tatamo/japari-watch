import * as PIXI from "pixi.js";
import {AraiSan, Fennec, Hat} from "./entities";
import EventEmitter = PIXI.utils.EventEmitter;

export class EntityManager extends EventEmitter {
	private arai_san: AraiSan;
	private fennec: Fennec;
	private hats: PIXI.Container;
	constructor(private stage: PIXI.Container) {
		super();
		this.init();

		this.fennec.on("drop", (x: number) => {
			this.hats.addChild(new Hat(x));
		})
	}
	init() {
		// init entities
		AraiSan.initTextures();
		this.arai_san = new AraiSan;
		this.stage.addChild(this.arai_san);

		Fennec.initTextures();
		this.fennec = new Fennec;
		this.stage.addChild(this.fennec);

		Hat.initTextures();
		this.hats = new PIXI.Container();
		this.stage.addChild(this.hats);
	}
	update() {
		this.arai_san.update();
		this.fennec.update();
		for (const hat of this.hats.children) {
			(hat as Hat).update(); // downcast
		}
	}
}