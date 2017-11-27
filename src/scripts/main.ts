import {Game} from "./game/game";

const generateURL = (text: string, url: string, hashtags: string): string => {
	return `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`;
};

const generateTweet = (score: number): string => {
	const text = `${score}点とったのだ！`;
	const url = "https://tatamo.github.io/japari-watch/";
	const hashtags = "じゃぱりうぉっち";
	return generateURL(text, url, hashtags);
};

const updateHighScore = (score: number) => {
	const a = document.getElementById("tweet-link")!;
	a.setAttribute("href", generateTweet(score));
};

window.addEventListener("DOMContentLoaded", () => new Game(document.getElementById("game")!).on("high-score", updateHighScore));
