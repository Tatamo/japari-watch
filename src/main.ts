import {Game} from "./game";

let high_score = 0;

(() => new Game(document.body).on("high-score", (score: number) => high_score = score))();