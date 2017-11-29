/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = PIXI;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _game = __webpack_require__(2);

var generateURL = function generateURL(text, url, hashtags) {
    return "https://twitter.com/intent/tweet?text=" + text + "&url=" + url + "&hashtags=" + hashtags;
};
var generateTweet = function generateTweet(score) {
    var text = score + "\u70B9\u3068\u3063\u305F\u306E\u3060\uFF01";
    var url = "https://tatamo.github.io/japari-watch/";
    var hashtags = "じゃぱりうぉっち";
    return generateURL(text, url, hashtags);
};
var updateHighScore = function updateHighScore(score) {
    var a = document.getElementById("tweet-link");
    a.setAttribute("href", generateTweet(score));
};
window.addEventListener("DOMContentLoaded", function () {
    return new _game.Game(document.getElementById("game")).on("high-score", updateHighScore);
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Game = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pixi = __webpack_require__(0);

var PIXI = _interopRequireWildcard(_pixi);

var _score = __webpack_require__(3);

var _entitymanager = __webpack_require__(4);

var _input = __webpack_require__(6);

var _effects = __webpack_require__(7);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = PIXI.utils.EventEmitter;

var Game = exports.Game = function (_EventEmitter) {
    _inherits(Game, _EventEmitter);

    function Game(parent) {
        _classCallCheck(this, Game);

        var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this));

        _this.state = "title";
        _this.high_score = 0;
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        _this.ticker = new PIXI.ticker.Ticker();
        _this.ticker.speed = 1 / 60;
        _this.ticker.add(function () {
            var tick_interval = 0.3;
            var tick_count = -1.5; // 最初のupdateだけ時間をかける (スプライト全表示を見せるため)
            return function (delta) {
                tick_count += delta;
                if (tick_count < tick_interval) return;
                tick_count = 0;
                _this.update();
            };
        }());
        _this.renderer = PIXI.autoDetectRenderer(512, 512);
        parent.appendChild(_this.renderer.view);
        _this.stage = new PIXI.Container();
        _this.stage.scale.x = _this.stage.scale.y = 4.0;
        _this.input = new _input.InputController();
        _this.loadAssets();
        return _this;
    }

    _createClass(Game, [{
        key: "loadAssets",
        value: function loadAssets() {
            PIXI.loader.add("background", "assets/background.png");
            PIXI.loader.add("arai_san", "assets/arai_san.png");
            PIXI.loader.add("fennec", "assets/fennec.png");
            PIXI.loader.add("hats", "assets/hats.png");
            PIXI.loader.add("numbers", "assets/numbers.png");
            PIXI.loader.add("misc", "assets/misc.png");
            PIXI.loader.add("all_sprites", "assets/sprite.png");
            PIXI.loader.load(this.setup.bind(this)); // おまじない
        }
        // called after loading

    }, {
        key: "setup",
        value: function setup() {
            var _this2 = this;

            this.background = new PIXI.Sprite(PIXI.loader.resources["background"].texture);
            this.stage.addChild(this.background);
            this.renderer.render(this.stage);
            this.entity_manager = new _entitymanager.EntityManager(this.stage, this.renderer);
            this.score_manager = new _score.ScoreManager(this.stage, 1, 8);
            this.miss_manager = new _score.ScoreManager(this.stage, 113, 8);
            this.effect_manager = new _effects.EffectManager(this.stage);
            this.entity_manager.on("catch", function (x) {
                _this2.score_manager.addScore();
                if (_this2.score_manager.score > _this2.high_score) {
                    _this2.high_score = _this2.score_manager.score;
                    _this2.emit("high-score", _this2.high_score);
                }
                _this2.effect_manager.catchHat(x);
                if ([10, 20, 30, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 999].indexOf(_this2.score_manager.score) !== -1) {
                    // 高スコアを達成するとフェネックがほめてくれるのだ
                    _this2.effect_manager.getCoolScore();
                }
                if (_this2.score_manager.score % 200 == 0 || _this2.score_manager.score === 998) {
                    // スコア200ごとにミスのカウントをリセット
                    _this2.miss_manager.resetScore();
                }
            });
            this.entity_manager.on("miss", function (x) {
                _this2.miss_manager.addScore();
                _this2.effect_manager.miss(x);
                if (_this2.miss_manager.score >= 3) {
                    _this2.state = "gameover";
                    _this2.emit("gameover", _this2.score_manager.score);
                    _this2.entity_manager.resetGame();
                    _this2.effect_manager.gameOver();
                }
            });
            var startGame = function startGame() {
                _this2.state = "in-game";
                _this2.effect_manager.startGame();
                _this2.emit("start");
            };
            var getInput = function getInput(key) {
                if (_this2.state === "title") {
                    startGame();
                } else if (_this2.state === "in-game") {
                    switch (key) {
                        case "left":
                            _this2.entity_manager.player.moveLeft();
                            break;
                        case "right":
                            _this2.entity_manager.player.moveRight();
                            break;
                        case "reset":
                            _this2.resetGame();
                            break;
                    }
                }
            };
            this.input.on("keydown", function (key) {
                if (key === 37) getInput("left");else if (key === 39) getInput("right");else if (key === 84) getInput("reset");
            });
            this.effect_manager.on("return-to-title", function () {
                _this2.resetGame();
            });
            var left_button = new PIXI.Sprite(PIXI.Texture.EMPTY);
            this.stage.addChild(left_button);
            left_button.x = left_button.y = 0;
            left_button.height = 128;
            left_button.width = 64;
            left_button.interactive = true;
            left_button.on("click", function () {
                return getInput("left");
            });
            left_button.on("touchstart", function () {
                return getInput("left");
            });
            var right_button = new PIXI.Sprite(PIXI.Texture.EMPTY);
            this.stage.addChild(right_button);
            right_button.x = 64;
            right_button.y = 0;
            right_button.height = 128;
            right_button.width = 64;
            right_button.interactive = true;
            right_button.on("click", function () {
                return getInput("right");
            });
            right_button.on("touchstart", function () {
                return getInput("right");
            });
            this.score_manager.resetScore();
            this.miss_manager.resetScore();
            this.effect_manager.title();
            var initial_view = new PIXI.Sprite(PIXI.loader.resources["all_sprites"].texture);
            this.stage.addChild(initial_view);
            this.renderer.render(this.stage);
            this.stage.removeChild(initial_view);
            this.ticker.start();
        }
    }, {
        key: "update",
        value: function update() {
            if (this.state === "in-game") {
                this.entity_manager.update();
            }
            this.effect_manager.update();
            this.renderer.render(this.stage);
        }
    }, {
        key: "resetGame",
        value: function resetGame() {
            this.state = "title";
            this.score_manager.resetScore();
            this.miss_manager.resetScore();
            this.entity_manager.resetGame();
            this.effect_manager.resetGame();
            this.effect_manager.title();
            this.emit("title");
            this.renderer.render(this.stage);
        }
    }]);

    return Game;
}(EventEmitter);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SevenSeg = exports.ScoreManager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pixi = __webpack_require__(0);

var PIXI = _interopRequireWildcard(_pixi);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScoreManager = exports.ScoreManager = function (_PIXI$Container) {
    _inherits(ScoreManager, _PIXI$Container);

    function ScoreManager(stage, x, y) {
        _classCallCheck(this, ScoreManager);

        var _this = _possibleConstructorReturn(this, (ScoreManager.__proto__ || Object.getPrototypeOf(ScoreManager)).call(this));

        _this.stage = stage;
        SevenSeg.initTextures();
        _this.score_sprites = [new SevenSeg(x, y, 8), new SevenSeg(x + 5, y, 8), new SevenSeg(x + 10, y, 8)];
        for (var i = 0; i < 3; i++) {
            _this.addChild(_this.score_sprites[i]);
        }_this.resetScore();
        stage.addChild(_this);
        return _this;
    }

    _createClass(ScoreManager, [{
        key: "addScore",
        value: function addScore() {
            if (this._score < 999) {
                this._score += 1;
                this.updateScore();
            }
        }
    }, {
        key: "resetScore",
        value: function resetScore() {
            this._score = 0;
            this.updateScore();
        }
    }, {
        key: "updateScore",
        value: function updateScore() {
            var score_numbers = [Math.floor(this.score / 100), Math.floor(this.score / 10 % 10), Math.floor(this.score % 10)];
            for (var i = 0; i < 3; i++) {
                this.score_sprites[i].setNumber(score_numbers[i]);
            }
        }
    }, {
        key: "score",
        get: function get() {
            return this._score;
        }
    }]);

    return ScoreManager;
}(PIXI.Container);

var SevenSeg = exports.SevenSeg = function (_PIXI$Sprite) {
    _inherits(SevenSeg, _PIXI$Sprite);

    function SevenSeg(x, y, n) {
        _classCallCheck(this, SevenSeg);

        var _this2 = _possibleConstructorReturn(this, (SevenSeg.__proto__ || Object.getPrototypeOf(SevenSeg)).call(this));

        _this2.x = x;
        _this2.y = y;
        _this2.setNumber(n);
        return _this2;
    }

    _createClass(SevenSeg, [{
        key: "setNumber",
        value: function setNumber(n) {
            if (n < 0) n *= -1;
            if (n > 9) n %= 10;
            this._num = Math.floor(n);
            this.texture = SevenSeg.textures[n];
        }
    }, {
        key: "num",
        get: function get() {
            return this._num;
        }
    }], [{
        key: "initTextures",
        value: function initTextures() {
            if (this.is_initialized) return;
            for (var i = 0; i <= 9; i++) {
                this.textures.push(new PIXI.Texture(PIXI.loader.resources["numbers"].texture.baseTexture, new PIXI.Rectangle(i * 5, 0, 4, 7)));
            }
            this.is_initialized = true;
        }
    }]);

    return SevenSeg;
}(PIXI.Sprite);

SevenSeg.textures = [];
SevenSeg.is_initialized = false;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EntityManager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pixi = __webpack_require__(0);

var PIXI = _interopRequireWildcard(_pixi);

var _entities = __webpack_require__(5);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = PIXI.utils.EventEmitter;

var EntityManager = exports.EntityManager = function (_EventEmitter) {
    _inherits(EntityManager, _EventEmitter);

    function EntityManager(stage, renderer) {
        _classCallCheck(this, EntityManager);

        var _this = _possibleConstructorReturn(this, (EntityManager.__proto__ || Object.getPrototypeOf(EntityManager)).call(this));

        _this.stage = stage;
        _this.init(renderer);
        return _this;
    }

    _createClass(EntityManager, [{
        key: "createHat",
        value: function createHat(n) {
            var _this2 = this;

            // Hat Factory
            var result = new _entities.Hat(n);
            // add some callback
            result.on("miss", function () {
                _this2.emit("miss", _this2.arai_san.getGridX());
            });
            return result;
        }
    }, {
        key: "init",
        value: function init(renderer) {
            var _this3 = this;

            // init entities
            _entities.AraiSan.initTextures();
            this.arai_san = new _entities.AraiSan();
            this.stage.addChild(this.arai_san);
            _entities.Fennec.initTextures();
            this.fennec = new _entities.Fennec();
            this.stage.addChild(this.fennec);
            _entities.Hat.initTextures();
            this.hats = new PIXI.Container();
            this.stage.addChild(this.hats);
            // set callbacks
            this.arai_san.on("check-catch", function () {
                return _this3.arai_san.checkCatch(_this3.hats);
            }); // hatsの参照を流し込む
            this.arai_san.on("catch", function (hat) {
                // x: アライさんの位置
                var x = hat.getGridX();
                if (x === 2) x = 1;else if (x === 4) x = 2;
                hat.caught();
                _this3.emit("catch", x);
            });
            this.arai_san.on("re-render", function () {
                return renderer.render(_this3.stage);
            }); // 再描画
            this.fennec.on("drop", function (n) {
                _this3.hats.addChild(_this3.createHat(n));
            });
        }
    }, {
        key: "update",
        value: function update() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.hats.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var hat = _step.value;

                    hat.update(); // downcast
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.arai_san.update();
            this.arai_san.checkCatch(this.hats);
            this.fennec.update();
            // remove dead hats
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.hats.children.slice()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _hat = _step2.value;

                    if (!_hat.isAlive()) {
                        this.hats.removeChild(_hat);
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }, {
        key: "resetGame",
        value: function resetGame() {
            this.arai_san.reset();
            this.fennec.reset();
            this.stage.removeChild(this.hats);
            this.hats.destroy();
            this.hats = new PIXI.Container();
            this.stage.addChild(this.hats);
        }
    }, {
        key: "player",
        get: function get() {
            return this.arai_san;
        }
    }]);

    return EntityManager;
}(EventEmitter);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Hat = exports.Fennec = exports.AraiSan = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pixi = __webpack_require__(0);

var PIXI = _interopRequireWildcard(_pixi);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
アライさん
gridx: 左の列から順に[0,2]
 */
var AraiSan = exports.AraiSan = function (_PIXI$Sprite) {
    _inherits(AraiSan, _PIXI$Sprite);

    function AraiSan() {
        _classCallCheck(this, AraiSan);

        var _this = _possibleConstructorReturn(this, (AraiSan.__proto__ || Object.getPrototypeOf(AraiSan)).call(this));

        _this.reset();
        return _this;
    }

    _createClass(AraiSan, [{
        key: "getGridX",
        value: function getGridX() {
            return this.gridx;
        }
    }, {
        key: "update",
        value: function update() {
            this.updateTexture();
            this.emit("update");
        }
    }, {
        key: "updateTexture",
        value: function updateTexture() {
            this.texture = AraiSan.textures[this.gridx];
            this.x = AraiSan.spritesheet_position[this.gridx][0];
            this.y = AraiSan.spritesheet_position[this.gridx][1];
        }
    }, {
        key: "reset",
        value: function reset() {
            this.gridx = 1;
            this.updateTexture();
        }
    }, {
        key: "moveLeft",
        value: function moveLeft() {
            this.gridx -= 1;
            if (this.gridx < 0) this.gridx = 0;
            this.updateTexture();
            this.emit("check-catch");
            this.emit("re-render");
        }
    }, {
        key: "moveRight",
        value: function moveRight() {
            this.gridx += 1;
            if (this.gridx > 2) this.gridx = 2;
            this.updateTexture();
            this.emit("check-catch");
            this.emit("re-render");
        }
    }, {
        key: "checkCatch",
        value: function checkCatch(hats) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = hats.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var hat = _step.value;

                    if (!(hat instanceof Hat)) continue;
                    var hx = hat.getGridX();
                    var hy = hat.getGridY();
                    if (hy === 8 && hx === 2 && this.gridx === 1 || hy === 9 && hx === 0 && this.gridx === 0 || hy === 9 && hx === 4 && this.gridx === 2) {
                        if (!hat.isCaught()) {
                            this.emit("catch", hat);
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }], [{
        key: "initTextures",
        value: function initTextures() {
            if (this.is_initialized) return;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.spritesheet_position[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var pos = _step2.value;

                    this.textures.push(new PIXI.Texture(PIXI.loader.resources["arai_san"].texture.baseTexture, new (Function.prototype.bind.apply(PIXI.Rectangle, [null].concat(_toConsumableArray(pos))))()));
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            this.is_initialized = true;
        }
    }]);

    return AraiSan;
}(PIXI.Sprite);

AraiSan.spritesheet_position = [[16, 97, 24, 30], [51, 97, 27, 30], [88, 97, 24, 30]];
AraiSan.textures = [];
AraiSan.is_initialized = false;
/*
フェネック
gridx: 左の列から順に[0,3]
 */

var Fennec = exports.Fennec = function (_PIXI$Sprite2) {
    _inherits(Fennec, _PIXI$Sprite2);

    function Fennec() {
        _classCallCheck(this, Fennec);

        var _this2 = _possibleConstructorReturn(this, (Fennec.__proto__ || Object.getPrototypeOf(Fennec)).call(this));

        _this2.reset();
        return _this2;
    }

    _createClass(Fennec, [{
        key: "update",
        value: function update() {
            // 動くか帽子を落とすか決める
            if (this.hat_wait > 0) {
                // 帽子を落としたばかりなら必ず移動
                this.hat_wait -= 1;
                this.move();
            } else {
                // 33%の確率で帽子を落とす
                if (Math.random() < 0.33) {
                    this.drop();
                    this.hat_wait = 3;
                } else {
                    this.move();
                }
            }
            this.updateTexture();
            this.emit("update");
        }
    }, {
        key: "updateTexture",
        value: function updateTexture() {
            this.texture = Fennec.textures[this.gridx];
            this.x = Fennec.spritesheet_position[this.gridx][0];
            this.y = Fennec.spritesheet_position[this.gridx][1];
        }
    }, {
        key: "move",
        value: function move() {
            if (this.gridx <= 0) this.gridx = 1;else if (this.gridx >= 3) this.gridx = 2;else {
                this.gridx += Math.random() < 0.5 ? -1 : 1;
            }
        }
    }, {
        key: "drop",
        value: function drop() {
            this.emit("drop", this.gridx);
        }
    }, {
        key: "reset",
        value: function reset() {
            this.gridx = 2;
            this.hat_wait = 0;
            this.updateTexture();
        }
    }], [{
        key: "initTextures",
        value: function initTextures() {
            if (this.is_initialized) return;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.spritesheet_position[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var pos = _step3.value;

                    this.textures.push(new PIXI.Texture(PIXI.loader.resources["fennec"].texture.baseTexture, new (Function.prototype.bind.apply(PIXI.Rectangle, [null].concat(_toConsumableArray(pos))))()));
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            this.is_initialized = true;
        }
    }]);

    return Fennec;
}(PIXI.Sprite);

Fennec.spritesheet_position = [[17, 1, 22, 23], [41, 1, 22, 23], [65, 1, 22, 23], [89, 1, 22, 23]];
Fennec.textures = [];
Fennec.is_initialized = false;
/*
アライさんに似合いそうなぼうし
gridx: 左の列から順に[0,4]
gridy: 上の列から順に[0,10]
ただし最下段中央については、左を(x,y)=(1,10), 右を(x,y)=(3,10)とする
*/

var Hat = exports.Hat = function (_PIXI$Sprite3) {
    _inherits(Hat, _PIXI$Sprite3);

    function Hat(fennec_x) {
        _classCallCheck(this, Hat);

        var _this3 = _possibleConstructorReturn(this, (Hat.__proto__ || Object.getPrototypeOf(Hat)).call(this));

        switch (fennec_x) {
            case 0:
                _this3.gridx = 0;
                _this3.direction = 1;
                break;
            case 1:
                _this3.gridx = 2;
                _this3.direction = 1;
                break;
            case 2:
                _this3.gridx = 2;
                _this3.direction = -1;
                break;
            case 3:
                _this3.gridx = 4;
                _this3.direction = -1;
        }
        _this3.gridy = 0;
        _this3.remove_count = 1;
        _this3.alive = true;
        _this3.updateTexture();
        return _this3;
    }

    _createClass(Hat, [{
        key: "getGridX",
        value: function getGridX() {
            return this.gridx;
        }
    }, {
        key: "getGridY",
        value: function getGridY() {
            return this.gridy;
        }
    }, {
        key: "isAlive",
        value: function isAlive() {
            return this.alive;
        }
    }, {
        key: "isCaught",
        value: function isCaught() {
            return this.is_caught;
        }
    }, {
        key: "update",
        value: function update() {
            if ((this.gridy > 9 || this.is_caught) && this.remove_count > 0) {
                this.remove_count -= 1;
            } else if (this.remove_count <= 0) {
                this.alive = false;
            }
            if (!this.is_caught) this.move();
            this.updateTexture();
            this.emit("update");
        }
    }, {
        key: "updateTexture",
        value: function updateTexture() {
            this.texture = Hat.textures[this.gridy][this.gridx];
            this.x = Hat.spritesheet_position[this.gridy][this.gridx][0];
            this.y = Hat.spritesheet_position[this.gridy][this.gridx][1];
        }
    }, {
        key: "move",
        value: function move() {
            if (this.gridy < 8) {
                // 斜めに落ちていく
                this.gridx += this.direction;
                if (this.direction === 1 && this.gridx >= 4 || this.direction === -1 && this.gridx <= 0) {
                    this.direction *= -1;
                }
                this.gridy += 1;
            } else if (this.gridy === 8) {
                if (this.gridx === 2) {
                    // center
                    this.gridx += this.direction;
                    this.gridy += 2;
                    this.emit("miss");
                } else {
                    this.gridy += 1;
                }
            } else if (this.gridy === 9) {
                this.gridy += 1;
                this.emit("miss");
            }
        }
    }, {
        key: "caught",
        value: function caught() {
            this.is_caught = true;
        }
    }], [{
        key: "initTextures",
        value: function initTextures() {
            if (this.is_initialized) return;
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this.spritesheet_position[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var line = _step4.value;

                    this.textures.push([]);
                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = line[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var pos = _step5.value;

                            if (pos === null) this.textures[this.textures.length - 1].push(null);else this.textures[this.textures.length - 1].push(new PIXI.Texture(PIXI.loader.resources["hats"].texture.baseTexture, new (Function.prototype.bind.apply(PIXI.Rectangle, [null].concat(_toConsumableArray(pos))))()));
                        }
                    } catch (err) {
                        _didIteratorError5 = true;
                        _iteratorError5 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                _iterator5.return();
                            }
                        } finally {
                            if (_didIteratorError5) {
                                throw _iteratorError5;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            this.is_initialized = true;
        }
    }]);

    return Hat;
}(PIXI.Sprite);

Hat.spritesheet_position = [[[1, 22, 15, 10], null, [56, 23, 16, 9], null, [112, 22, 15, 10]], [null, [28, 31, 16, 9], null, [84, 31, 16, 9], null], [[1, 38, 15, 10], null, [56, 39, 16, 9], null, [112, 39, 15, 10]], [null, [28, 47, 16, 9], null, [84, 47, 16, 9], null], [[1, 54, 15, 10], null, [56, 55, 16, 9], null, [112, 54, 15, 10]], [null, [28, 63, 16, 9], null, [84, 63, 16, 9], null], [[1, 70, 15, 10], null, [56, 71, 16, 9], null, [112, 70, 15, 10]], [null, [28, 79, 16, 9], null, [84, 79, 16, 9], null], [[1, 86, 15, 10], null, [56, 87, 16, 9], null, [112, 86, 15, 10]], [[1, 102, 15, 10], null, null, null, [112, 102, 15, 10]], [[3, 115, 16, 12], [39, 115, 16, 12], null, [74, 115, 16, 12], [110, 115, 16, 12]]];
Hat.textures = [];
Hat.is_initialized = false;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.InputController = undefined;

var _pixi = __webpack_require__(0);

var PIXI = _interopRequireWildcard(_pixi);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = PIXI.utils.EventEmitter;

var InputController = exports.InputController = function (_EventEmitter) {
    _inherits(InputController, _EventEmitter);

    function InputController() {
        _classCallCheck(this, InputController);

        var _this = _possibleConstructorReturn(this, (InputController.__proto__ || Object.getPrototypeOf(InputController)).call(this));

        _this.is_pressed_left = false;
        _this.is_pressed_right = false;
        _this.keycode_left = 37;
        _this.keycode_right = 39;
        window.addEventListener("keydown", function (event) {
            if (event.keyCode === 37) {
                _this.is_pressed_left = true;
            } else if (event.keyCode === 39) {
                _this.is_pressed_right = true;
            }
            if ([37, 39, 84].indexOf(event.keyCode) !== -1) {
                _this.emit("keydown", event.keyCode);
                event.preventDefault();
            }
        }, false);
        window.addEventListener("keyup", function (event) {
            if (event.keyCode === 37) {
                _this.is_pressed_left = false;
            } else if (event.keyCode === 39) {
                _this.is_pressed_right = false;
            }
            if (event.keyCode === 37 || event.keyCode === 39) {
                _this.emit("keyup", event.keyCode);
                event.preventDefault();
            }
        }, false);
        return _this;
    }

    return InputController;
}(EventEmitter);

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Effect = exports.EffectManager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pixi = __webpack_require__(0);

var PIXI = _interopRequireWildcard(_pixi);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EffectManager = exports.EffectManager = function (_PIXI$Container) {
    _inherits(EffectManager, _PIXI$Container);

    function EffectManager(stage) {
        _classCallCheck(this, EffectManager);

        var _this = _possibleConstructorReturn(this, (EffectManager.__proto__ || Object.getPrototypeOf(EffectManager)).call(this));

        _this.stage = stage;
        stage.addChild(_this);
        _this.init();
        _this.resetGame();
        return _this;
    }

    _createClass(EffectManager, [{
        key: "init",
        value: function init() {
            var bt = PIXI.loader.resources["misc"].texture.baseTexture;
            this.score_label = new PIXI.Sprite(new PIXI.Texture(bt, new PIXI.Rectangle(1, 1, 14, 5)));
            this.score_label.setTransform(1, 1);
            this.addChild(this.score_label);
            this.miss_label = new PIXI.Sprite(new PIXI.Texture(bt, new PIXI.Rectangle(113, 1, 14, 5)));
            this.miss_label.setTransform(113, 1);
            this.addChild(this.miss_label);
            this.game_start_label = new Effect(new PIXI.Texture(bt, new PIXI.Rectangle(25, 57, 81, 5)), 0);
            this.game_start_label.setTransform(25, 57);
            this.addChild(this.game_start_label);
            this.game_over_label = new Effect(new PIXI.Texture(bt, new PIXI.Rectangle(53, 49, 22, 21)), 0);
            this.game_over_label.setTransform(53, 49);
            this.addChild(this.game_over_label);
            this.arai_san_label = new Effect(new PIXI.Texture(bt, new PIXI.Rectangle(25, 72, 86, 6)), 0);
            this.arai_san_label.setTransform(25, 72);
            this.addChild(this.arai_san_label);
            this.fennec_label = new Effect(new PIXI.Texture(bt, new PIXI.Rectangle(27, 41, 76, 5)), 0);
            this.fennec_label.setTransform(27, 41);
            this.addChild(this.fennec_label);
            this.catch_effect = [new Effect(new PIXI.Texture(bt, new PIXI.Rectangle(31, 90, 13, 13)), 0), new Effect(new PIXI.Texture(bt, new PIXI.Rectangle(49, 90, 31, 13)), 0), new Effect(new PIXI.Texture(bt, new PIXI.Rectangle(84, 90, 13, 13)), 0)];
            this.catch_effect[0].setTransform(31, 90);
            this.catch_effect[1].setTransform(49, 90);
            this.catch_effect[2].setTransform(84, 90);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.catch_effect[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var ef = _step.value;

                    this.addChild(ef);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.miss_effect = [new Effect(new PIXI.Texture(bt, new PIXI.Rectangle(39, 104, 5, 6)), 0), new Effect(new PIXI.Texture(bt, new PIXI.Rectangle(49, 104, 31, 6)), 0), new Effect(new PIXI.Texture(bt, new PIXI.Rectangle(84, 104, 5, 6)), 0)];
            this.miss_effect[0].setTransform(39, 104);
            this.miss_effect[1].setTransform(49, 104);
            this.miss_effect[2].setTransform(84, 104);
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.miss_effect[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _ef = _step2.value;

                    this.addChild(_ef);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }, {
        key: "update",
        value: function update() {
            var _this2 = this;

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var sprite = _step3.value;

                    if (!(sprite instanceof Effect)) continue;
                    sprite.update();
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            if (this.title_animation_counter > 0) {
                this.title_animation_counter -= 1;
                if (this.title_animation_counter === 0) {
                    this.arai_san_label.setLife(2);
                    this.catch_effect[1].setLife(2);
                    this.arai_san_label.once("die", function () {
                        _this2.title_animation_counter = 2;
                    });
                }
            }
        }
    }, {
        key: "resetGame",
        value: function resetGame() {
            this.game_start_label.setLife(0);
            this.game_over_label.setLife(0);
            this.arai_san_label.setLife(0);
            this.fennec_label.setLife(0);
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this.catch_effect[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var ef = _step4.value;

                    ef.setLife(0);
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = this.miss_effect[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var _ef2 = _step5.value;

                    _ef2.setLife(0);
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            this.title_animation_counter = 2;
        }
    }, {
        key: "title",
        value: function title() {
            var _this3 = this;

            this.arai_san_label.setLife(2);
            this.arai_san_label.once("die", function () {
                _this3.title_animation_counter = 2;
            });
            this.catch_effect[1].setLife(2);
        }
    }, {
        key: "startGame",
        value: function startGame() {
            this.arai_san_label.removeAllListeners();
            this.arai_san_label.setLife(0);
            this.catch_effect[1].setLife(0);
            this.game_start_label.setLife(10);
            this.title_animation_counter = -1;
        }
    }, {
        key: "gameOver",
        value: function gameOver() {
            var _this4 = this;

            this.game_over_label.setLife(10);
            this.miss_effect[1].setLife(10);
            this.game_over_label.once("die", function () {
                _this4.emit("return-to-title");
            });
        }
    }, {
        key: "catchHat",
        value: function catchHat(x) {
            this.catch_effect[x].setLife(2);
        }
    }, {
        key: "miss",
        value: function miss(x) {
            this.miss_effect[x].setLife(2);
        }
    }, {
        key: "getCoolScore",
        value: function getCoolScore() {
            this.fennec_label.setLife(10);
        }
    }]);

    return EffectManager;
}(PIXI.Container);

var Effect = exports.Effect = function (_PIXI$Sprite) {
    _inherits(Effect, _PIXI$Sprite);

    function Effect(texture, life) {
        _classCallCheck(this, Effect);

        var _this5 = _possibleConstructorReturn(this, (Effect.__proto__ || Object.getPrototypeOf(Effect)).call(this, texture));

        _this5.life = life;
        _this5.setLife(life);
        return _this5;
    }

    _createClass(Effect, [{
        key: "setLife",
        value: function setLife(life) {
            this.life = life;
            if (this.life > 0) {
                this._state = "live";
                this.visible = true;
            } else if (this.life === 0) {
                this._state = "die";
                this.visible = false;
            } else {
                this._state = "immortal";
                this.visible = true;
            }
        }
    }, {
        key: "update",
        value: function update() {
            if (this.life > 0) {
                this.life -= 1;
                if (this.life <= 0) {
                    this._state = "die";
                    this.visible = false;
                    this.emit("die");
                }
            }
        }
    }, {
        key: "state",
        get: function get() {
            return this._state;
        }
    }]);

    return Effect;
}(PIXI.Sprite);

/***/ })
/******/ ]);