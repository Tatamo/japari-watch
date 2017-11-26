import * as PIXI from "pixi.js";
import {AraiSan, Fennec, Hat} from "./entities";

export class EntityManager {
	private arai_san: AraiSan;
	private fennec: Fennec;
	private hats: Array<Hat>;
	constructor(private stage:PIXI.Container) {
		// init entities
		AraiSan.initTextures();
		this.arai_san = new AraiSan;
		stage.addChild(this.arai_san);

		Fennec.initTextures();
		this.fennec = new Fennec;
		stage.addChild(this.fennec);

		Hat.initTextures();
		this.hats = [];
		this.hats.push(new Hat(1));
		stage.addChild(this.hats[0]);
	}
	update() {
		this.arai_san.update();
		this.fennec.update();
		for (const hat of this.hats) {
			hat.update();
		}
	}
}