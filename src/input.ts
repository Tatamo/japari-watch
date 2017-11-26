import * as PIXI from "pixi.js";
import EventEmitter = PIXI.utils.EventEmitter;

export class InputController extends EventEmitter {
	private is_pressed_left: boolean;
	private is_pressed_right: boolean;
	private keycode_left: number;
	private keycode_right: number;
	constructor() {
		super();
		this.is_pressed_left = false;
		this.is_pressed_right = false;
		this.keycode_left = 37;
		this.keycode_right = 39;

		window.addEventListener(
			"keydown", (event) => {
				if (event.keyCode === 37) {
					this.is_pressed_left = true;
				}
				else if (event.keyCode === 39) {
					this.is_pressed_right = true;
				}
				if (event.keyCode === 37 || event.keyCode === 39) {
					this.emit("keydown", event.keyCode);
					event.preventDefault();
				}
			}, false);
		window.addEventListener(
			"keyup", (event) => {
				if (event.keyCode === 37) {
					this.is_pressed_left = false;
				}
				else if (event.keyCode === 39) {
					this.is_pressed_right = false;
				}
				if (event.keyCode === 37 || event.keyCode === 39) {
					this.emit("keyup", event.keyCode);
					event.preventDefault();
				}
			}, false);
	}
}