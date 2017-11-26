import * as PIXI from "pixi.js";

const renderer = PIXI.autoDetectRenderer(512, 512);
const stage = new PIXI.Container();

document.body.appendChild(renderer.view);

PIXI.loader.add("background", "background.png");

renderer.render(stage);