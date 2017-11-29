import * as PIXI from "pixi.js";
import EventEmitter = PIXI.utils.EventEmitter;

export class InputController extends EventEmitter {
	private keycode_left: number;
	private keycode_right: number;
	private keycode_reset: number;
	constructor(stage: PIXI.Container) {
		super();
		// key event
		this.keycode_left = 37;
		this.keycode_right = 39;
		this.keycode_reset = 84;

		window.addEventListener(
			"keydown", (event) => {
				if (event.keyCode === this.keycode_left) {
					this.emit("left");
					event.preventDefault();
				}
				else if (event.keyCode === this.keycode_right) {
					this.emit("right");
					event.preventDefault();
				}
				else if (event.keyCode === this.keycode_reset) {
					this.emit("reset");
					event.preventDefault();
				}
			}, false);

		// touch event
		const left_button = new PIXI.Sprite(PIXI.Texture.EMPTY);
		stage.addChild(left_button);
		left_button.x = left_button.y = 0;
		left_button.height = 128;
		left_button.width = 64;
		left_button.interactive = true;
		left_button.on("click", () => this.emit("left"));
		left_button.on("touchstart", () => this.emit("left"));

		const right_button = new PIXI.Sprite(PIXI.Texture.EMPTY);
		stage.addChild(right_button);
		right_button.x = 64;
		right_button.y = 0;
		right_button.height = 128;
		right_button.width = 64;
		right_button.interactive = true;
		right_button.on("click", () => this.emit("right"));
		right_button.on("touchstart", () => this.emit("right"));

	}
}