import {Game} from "./game/game";

const generateURL = (text: string, url: string, hashtags: string): string => {
	return `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`;
};

const updateHighScore = (score: number, ai:boolean) => {
	const text = `${score}点とったのだ！${ai?"アライさんにおまかせなのだ！":""}`;
	const url = "https://tatamo.github.io/japari-watch/";
	const hashtags = "じゃぱりうぉっち";
	const tweethref = generateURL(text, url, hashtags);

	const a = document.getElementById("tweet-link")!;
	a.setAttribute("href", tweethref);
};

window.addEventListener("DOMContentLoaded", () => {
	const game = new Game(document.getElementById("game")!);
	game.on("high-score", updateHighScore);
	const a = document.getElementById("toggle-ai-mode")!;
	const mode_view = document.getElementById("view-ai-mode")!;
	mode_view.innerText = game.isAIMode() ? "オン" : "オフ";

	a.onclick = () => {
		game.toggleAIMode();
		mode_view.innerText = game.isAIMode() ? "オン" : "オフ";
		return false;
	};
});
