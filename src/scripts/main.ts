import {Game} from "./game";

let high_score = 0;

window.addEventListener("DOMContentLoaded", () => new Game(document.getElementById("game")!).on("high-score", (score: number) => high_score = score));