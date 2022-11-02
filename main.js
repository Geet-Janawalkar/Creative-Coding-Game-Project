// Game made by Geet Janawalkar
// Spritesheet credit "Kenney.nl" "https://www.kenney.nl/assets/space-shooter-redux" as of 3 October 2022
// Music credit "https://pixabay.com/" no licensing, credit to author or royalties as of 3 October 2022
// Sound Effect credit "https://mixkit.co/free-sound-effects/" used under the Mixkit License as of 3 October 2022

// Hacks
let cheats = false;

// Score / Health
let playerScore = 0,
	maxHealth = 5,
	playerHealth = maxHealth,
	levelNumber = 0,
	enemyHealth = [];

// Powerups
let powerUp = [];
let powerUpItem = [];
let shotUpgrade = 0;
let fireRate = 0;

// Classes
let player,
	enemy_manager,
	enemies = [],
	bg_manager,
	bg_ctr = 255,
	explosions = [];

// Groups
let G_Player;

// Text
let gamefont;

// Scene Handling
let scene;
const ST = 0;
const IG = 1;
const P_IG = 2;
const GO = 3;
const LB = 4;
const LD = 5;

// Menu
let opt = [];
opt[0] = "PLAY";
opt[1] = "LEADERBOARD";
opt[2] = "SETINGS";
opt[3] = "QUIT";
opt[4] = "RESUME";
opt[5] = "END GAME";
opt[6] = "BACK";

// Buttons and Sliders
let playButton,
	resumeButton,
	lbButton,
	stButton,
	endButton,
	quitButton,
	backButton,
	sfxSlider,
	musSlider,
	difSlider,
	showSettings = 0,
	UI_Height = 400;

// Button Interaction
let col = [];
let bw = [],
	bh = [],
	bx = [],
	by = [];
let btns = [];

// Difficulty
const EASY = 0;
const HARD = 1;
const INSANE = 2;
let difficulty = HARD;

// Sprite Images
let SPR_player = [],
	p_anim = [],
	SPR_enemies = [],
	SPR_pbullet = [],
	SPR_ebullet = [],
	SPR_exp = [],
	SPR_star = [],
	SPR_item = [];

// SFX
let AUD_pshoot,
	AUD_eshoot,
	AUD_exp,
	AUD_pdmg,
	AUD_gameover,
	AUD_healthUp,
	AUD_upgrade;

// Video
let VID_loadingScreen,
	VLS;

// Image
let IMG_gamelogo,
	IGL;

// Volume
let sfxV,
	musV;

// Files
let gameFile;

// Leaderboard
let lbfile = [];

// Restart Check
let gameRestart = 0;

// Misc
let testctr = 0;

function preload() {
	soundFormats("wav", "ogg");

	gamefont = loadFont("fonts/kenvector_future.ttf");
	SPR_player[0] = loadImage("sprites/playerShip1_green.png");
	SPR_player[1] = loadImage("sprites/playerShip1_red.png");
	SPR_pbullet[0] = loadImage("sprites/Lasers/laserGreen02.png");
	SPR_pbullet[1] = loadImage("sprites/Lasers/laserGreen01.png");
	SPR_pbullet[2] = loadImage("sprites/Lasers/laserGreen14.png");
	SPR_ebullet[0] = loadImage("sprites/Lasers/laserRed02.png");
	SPR_enemies[0] = loadImage("sprites/Enemies/enemyRed1.png");
	SPR_enemies[1] = loadImage("sprites/Enemies/enemyBlack2.png");
	SPR_enemies[2] = loadImage("sprites/Enemies/enemyBlue3.png");
	SPR_enemies[3] = loadImage("sprites/Enemies/enemyBlack4.png");
	SPR_exp[0] = loadImage('sprites/explosion/0.png');
	SPR_exp[1] = loadImage('sprites/explosion/1.png');
	SPR_exp[2] = loadImage('sprites/explosion/2.png');
	SPR_exp[3] = loadImage('sprites/explosion/3.png');
	SPR_exp[4] = loadImage('sprites/explosion/4.png');
	SPR_exp[5] = loadImage('sprites/explosion/5.png');
	SPR_exp[6] = loadImage('sprites/explosion/6.png');
	SPR_exp[7] = loadImage('sprites/explosion/7.png');
	SPR_exp[8] = loadImage('sprites/explosion/8.png');
	SPR_exp[9] = loadImage('sprites/explosion/9.png');
	SPR_exp[10] = loadImage('sprites/explosion/10.png');
	SPR_exp[11] = loadImage('sprites/explosion/11.png');
	SPR_star[0] = loadImage("sprites/Effects/star1.png");
	SPR_star[1] = loadImage("sprites/Effects/star2.png");
	SPR_star[2] = loadImage("sprites/Effects/star3.png");
	SPR_item[0] = loadImage("sprites/Power-ups/pill_green.png");
	SPR_item[1] = loadImage("sprites/Power-ups/powerupGreen_shield.png");
	SPR_item[2] = loadImage("sprites/Power-ups/powerupGreen_bolt.png");
	SPR_item[3] = loadImage("sprites/Power-ups/powerupGreen_star.png");

	AUD_pshoot = loadSound("audio/sfx_laser1.ogg");
	AUD_eshoot = loadSound("audio/sfx_laser2.ogg");
	AUD_exp = loadSound("audio/explosion.ogg");
	AUD_healthUp = loadSound("audio/sfx_shieldUp.ogg");
	AUD_upgrade = loadSound("audio/sfx_twoTone.ogg");
	AUD_pdmg = loadSound("audio/playerdamage.ogg")
	AUD_IGMusic = loadSound("audio/bg_music.mp3");
	AUD_gameover = loadSound("audio/gameover.wav");

	gameFile = loadJSON("setup.json");

	IMG_gamelogo = loadImage("image/gamelogo1.png");

}

function setup() {
	createCanvas(800, 1200);

	loadAnimations();

	VID_loadingScreen = "video/loadingscreen.mp4";
	VLS = createVideo(VID_loadingScreen);
	VLS.size(800, 450);
	VLS.volume(0);
	VLS.play();
	VLS.noLoop();
	VLS.hide();
	VLS.position(0, 300);

	scene = LD;

	G_Player = new Group();

	player = new Player(width / 2, height - 100, 40, 40);
	enemy_manager = new Enemy_Manager;
	bg_manager = new BG;

	allTheButtons();

}

function draw() {

	background(8, 0, 28);
	
	if (scene == LD) loadingScreen();

	bg_manager.bg_system();

	if (scene != LD) {
		push();
		fill(0, 0, 0, bg_ctr);
		rect(0, 0, width, height);
		pop();
	}

	if (scene == IG) {
		enemy_manager.enemySystem();
		player.playerSystem();
	}

	drawSprites();

	if (scene == ST) {
		startMenu();
	}

	if (scene == LB) {
		leaderboard();
	}

	if (scene == P_IG) {
		pauseMenu();
	}

	drawExplosions();

	if (AUD_IGMusic.isPlaying() == 0) {
		AUD_IGMusic.play();
	} else {
		AUD_IGMusic.setVolume(musV);
		AUD_IGMusic.rate(1 + 1 * levelNumber / 25);
	}
	volumeSet();
	
}	

function loadingScreen() {

	background(0, 0, 0, bg_ctr);
	if (bg_ctr <= 0) bg_ctr -= 0.1;
	let v = VLS.get();
	if (VLS.time() >= 8) {
		VLS.hide();
		scene = ST;
	} else {
		image(v, 0, 300);
		image(IMG_gamelogo, 500 / 2 - width / 8, -60);
	}

	push();
	fill(255);
	textFont(gamefont);
	textSize(50);
	textAlign(CENTER);
	textSize(20);
	text("Made by Geet Janawalkar", width / 2, height - 25)
	pop();
}

function startMenu() {

	playButton.show();
	lbButton.show();
	stButton.show();
	quitButton.show();

	push();
	fill(255);
	textFont(gamefont);
	textSize(50);
	textAlign(CENTER);

	image(IMG_gamelogo, 500 / 2 - width / 8, -60);

	textSize(20);
	if (showSettings) {
		text("Sound Effects", width / 2, UI_Height + 100 * 3 + 30);
		text("Music", width / 2, UI_Height + 100 * 4 + 30);
		text("EASY", width / 2 - 145, UI_Height + 100 * 5 + 30);
		text("HARD", width / 2, UI_Height + 100 * 5 + 30);
		text("INSANE", width / 2 + 150, UI_Height + 100 * 5 + 30);
		textSize(15);
		if (difficulty == EASY) text("Starting player health\nis 5, with easier enemies\n\n`This will be a breeze`", width / 2, UI_Height + 100 * 6 + 10);
		if (difficulty == HARD) text("Starting player health\nis 3, with standard enemies\n\n`This should make\nthings interesting`", width / 2, UI_Height + 100 * 6 + 10);
		if (difficulty == INSANE) text("Starting player health\nis 1, with difficult enemies\n\n`Time for a real\nchallenge`", width / 2, UI_Height + 100 * 6 + 10);
	}

	textSize(20);
	text("Made by Geet Janawalkar", width / 2, height - 25)

	pop();

	difficulty = difSlider.value();

}

function pauseMenu() {

	resumeButton.show();
	stButton.show();
	endButton.show();

	push();
	fill(0, 0, 0, 70);
	rect(0, 0, width, height);
	pop();

	push();
	fill(255);
	textFont(gamefont);
	textAlign(CENTER);
	textSize(50);
	text("Game\nPaused", width / 2, UI_Height - 180);

	textSize(25);
	if (showSettings) {
		text("Sound Effects", width / 2, UI_Height + 100 * 3 + 30);
		text("Music", width / 2, UI_Height + 100 * 4 + 30);
	}
	textSize(20);
	text("Made by Geet Janawalkar", width / 2, height - 25)

	pop();

	player.pausePB();
	enemy_manager.pauseEB();

}

function leaderboard() {

	playButton.hide();
	lbButton.hide();
	stButton.hide();
	quitButton.hide();
	backButton.show();

	image(IMG_gamelogo, 500 / 2 - width / 8, -60);

	push();
	fill(255);
	textFont(gamefont);
	textSize(25);
	textAlign(CENTER);
	text("PLACE", width / 2 - 200, 400);
	text("NAME", width / 2, 400);
	text("SCORE", width / 2 + 200, 400);

	for (let i = 0; i < gameFile.LEADERBOARD.length; i++) {
		let temp = [];
		temp = gameFile.LEADERBOARD[i].PLACE;
		text(temp, width / 2 - 200, 450 + i * 50);
	}
	for (let i = 0; i < gameFile.LEADERBOARD.length; i++) {
		let temp = [];
		temp = gameFile.LEADERBOARD[i].NAME;
		text(temp, width / 2, 450 + i * 50);
	}
	for (let i = 0; i < gameFile.LEADERBOARD.length; i++) {
		let temp = [];
		temp = gameFile.LEADERBOARD[i].SCORE;
		text(temp, width / 2 + 200, 450 + i * 50);
	}

	textSize(20);
	text("Made by Geet Janawalkar", width / 2, height - 25)
	pop();
}

function keyPressed() {

	if (key == 'p' && scene == IG) scene = P_IG;

}

function volumeSet() {

	sfxV = sfxSlider.value() / 100;
	musV = musSlider.value() / 100;

}

function allTheButtons() {

	let col = color(210, 200, 70);

	for (i = 0; i < 7; i++) {
		bw[i] = 330;
		bh[i] = 60;
	}

	for (i = 0; i < 7; i++) {
		if (i < 4) {
			by[i] = UI_Height + 75 * i;
		} else {
			by[4] = UI_Height + 75 * 1;
			by[5] = UI_Height + 75 * 3;
			by[6] = UI_Height + 75 * 8;
		}

		bx[i] = width / 2 - 330 / 2;
	}

	playButton = createButton(opt[0]);
	playButton.position(bx[0], by[0]);
	playButton.style("font-family", "kenvector_future");
	playButton.style('background-color', col);
	playButton.style('color', "white");
	playButton.size(bw[0], bh[0]);
	playButton.style('padding', '10px');
	playButton.style('border', '0px');
	playButton.style('font-size', '35px');
	playButton.mouseOver(hover0);
	playButton.mouseOut(updateButtons);
	playButton.mousePressed(playPressed);
	playButton.hide();

	lbButton = createButton(opt[1]);
	lbButton.position(bx[1], by[1]);
	lbButton.style("font-family", "kenvector_future");
	lbButton.style('background-color', col);
	lbButton.style('color', "white");
	lbButton.size(bw[1], bh[1]);
	lbButton.style('padding', '10px');
	lbButton.style('border', '0px');
	lbButton.style('font-size', '35px');
	lbButton.mouseOver(hover1);
	lbButton.mouseOut(updateButtons);
	lbButton.mousePressed(lbPressed);
	lbButton.hide();

	stButton = createButton(opt[2]);
	stButton.position(bx[2], by[2]);
	stButton.style("font-family", "kenvector_future");
	stButton.style('background-color', col);
	stButton.style('color', "white");
	stButton.size(bw[2], bh[2]);
	stButton.style('padding', '10px');
	stButton.style('border', '0px');
	stButton.style('font-size', '35px');
	stButton.mouseOver(hover2);
	stButton.mouseOut(updateButtons);
	stButton.mousePressed(settingPressed);
	stButton.hide();

	quitButton = createButton(opt[3]);
	quitButton.position(bx[3], by[3]);
	quitButton.style("font-family", "kenvector_future");
	quitButton.style('background-color', col);
	quitButton.style('color', "white");
	quitButton.size(bw[3], bh[3]);
	quitButton.style('padding', '10px');
	quitButton.style('border', '0px');
	quitButton.style('font-size', '35px');
	quitButton.mouseOver(hover3);
	quitButton.mouseOut(updateButtons);
	quitButton.mousePressed(quitPressed);
	quitButton.hide();

	resumeButton = createButton(opt[4]);
	resumeButton.position(bx[4], by[4]);
	resumeButton.style("font-family", "kenvector_future");
	resumeButton.style('background-color', col);
	resumeButton.style('color', "white");
	resumeButton.size(bw[4], bh[4]);
	resumeButton.style('padding', '10px');
	resumeButton.style('border', '0px');
	resumeButton.style('font-size', '35px');
	resumeButton.mouseOver(hover4);
	resumeButton.mouseOut(updateButtons);
	resumeButton.mousePressed(resumePressed);
	resumeButton.hide();

	endButton = createButton(opt[5]);
	endButton.position(bx[5], by[5]);
	endButton.style("font-family", "kenvector_future");
	endButton.style('background-color', col);
	endButton.style('color', "white");
	endButton.size(bw[5], bh[5]);
	endButton.style('padding', '10px');
	endButton.style('border', '0px');
	endButton.style('font-size', '35px');
	endButton.mouseOver(hover5);
	endButton.mouseOut(updateButtons);
	endButton.mousePressed(endgamePressed);
	endButton.hide();

	backButton = createButton(opt[6]);
	backButton.position(bx[6], by[6]);
	backButton.style("font-family", "kenvector_future");
	backButton.style('background-color', col);
	backButton.style('color', "white");
	backButton.size(bw[6], bh[6]);
	backButton.style('padding', '10px');
	backButton.style('border', '0px');
	backButton.style('font-size', '35px');
	backButton.mouseOver(hover6);
	backButton.mouseOut(updateButtons);
	backButton.mousePressed(backPressed);
	backButton.hide();

	sfxSlider = createSlider(0, 100, gameFile.SETTINGS[0].SFX * gameFile.SETTINGS[0].MUTESFX, 5);
	sfxSlider.position(width / 2 - 300 / 2, UI_Height + 100 * 4 - 50);
	sfxSlider.size(300, 10);
	sfxSlider.hide();

	musSlider = createSlider(0, 100, gameFile.SETTINGS[0].MUSIC * gameFile.SETTINGS[0].MUTEMUS, 5);
	musSlider.position(width / 2 - 300 / 2, UI_Height + 100 * 5 - 50);
	musSlider.size(300, 10);
	musSlider.hide();

	difSlider = createSlider(0, 2, gameFile.SETTINGS[0].DIFFICULTY, 1);
	difSlider.position(width / 2 - 300 / 2, UI_Height + 100 * 6 - 50);
	difSlider.size(300, 10);
	difSlider.hide();


}

function updateButtons() {

	for (i = 0; i < 7; i++) {
		bw[i] = 330;
		bh[i] = 60;
	}

	for (i = 0; i < 7; i++) {
		if (i < 4) {
			by[i] = UI_Height + 75 * i;
		} else {
			by[4] = UI_Height + 75 * 1;
			by[5] = UI_Height + 75 * 3;
			by[6] = UI_Height + 75 * 8;
		}

		bx[i] = width / 2 - 330 / 2;
	}

	let col = color(210, 200, 70);

	playButton.style('background-color', col);
	playButton.size(bw[0], bh[0]);
	playButton.position(bx[0], by[0]);

	lbButton.style('background-color', col);
	lbButton.size(bw[1], bh[1]);
	lbButton.position(bx[1], by[1]);

	stButton.style('background-color', col);
	stButton.size(bw[2], bh[2]);
	stButton.position(bx[2], by[2]);

	quitButton.style('background-color', col);
	quitButton.size(bw[3], bh[3]);
	quitButton.position(bx[3], by[3]);

	resumeButton.style('background-color', col);
	resumeButton.size(bw[4], bh[4]);
	resumeButton.position(bx[4], by[4]);

	endButton.style('background-color', col);
	endButton.size(bw[5], bh[5]);
	endButton.position(bx[5], by[5]);

	backButton.style('background-color', col);
	backButton.size(bw[6], bh[6]);
	backButton.position(bx[6], by[6]);
}

function hover0() {
	bw[0] += 20;
	bh[0] += 5;
	bx[0] -= 10;
	by[0] -= 2.5;

	col[0] = color(171, 159, 7);
	playButton.style('background-color', col[0]);
	playButton.size(bw[0], bh[0]);
	playButton.position(bx[0], by[0]);
}

function hover1() {
	bw[1] += 20;
	bh[1] += 5;
	bx[1] -= 10;
	by[1] -= 2.5;
	col[1] = color(171, 159, 7);
	lbButton.style('background-color', col[1]);
	lbButton.size(bw[1], bh[1]);
	lbButton.position(bx[1], by[1]);
}

function hover2() {
	bw[2] += 20;
	bh[2] += 5;
	bx[2] -= 10;
	by[2] -= 2.5;
	col[2] = color(171, 159, 7);
	stButton.style('background-color', col[2]);
	stButton.size(bw[2], bh[2]);
	stButton.position(bx[2], by[2]);
}

function hover3() {
	bw[3] += 20;
	bh[3] += 5;
	bx[3] -= 10;
	by[3] -= 2.5;
	col[3] = color(171, 159, 7);
	quitButton.style('background-color', col[3]);
	quitButton.size(bw[3], bh[3]);
	quitButton.position(bx[3], by[3]);
}

function hover4() {
	bw[4] += 20;
	bh[4] += 5;
	bx[4] -= 10;
	by[4] -= 2.5;
	col[4] = color(171, 159, 7);
	resumeButton.style('background-color', col[4]);
	resumeButton.size(bw[4], bh[4]);
	resumeButton.position(bx[4], by[4]);
}

function hover5() {
	bw[5] += 20;
	bh[5] += 5;
	bx[5] -= 10;
	by[5] -= 2.5;
	col[5] = color(171, 159, 7);
	endButton.style('background-color', col[5]);
	endButton.size(bw[5], bh[5]);
	endButton.position(bx[5], by[5]);
}

function hover6() {
	bw[6] += 20;
	bh[6] += 5;
	bx[6] -= 10;
	by[6] -= 2.5;
	col[6] = color(171, 159, 7);
	backButton.style('background-color', col[6]);
	backButton.size(bw[6], bh[6]);
	backButton.position(bx[6], by[6]);
}

function playPressed() {
	player.clearScreen();

	playButton.hide();
	lbButton.hide();
	stButton.hide();
	quitButton.hide();

	showSettings = 1;
	settingPressed();

	healthy = 1;
	levelNumber = 0;
	wave_counter = 0;

	scene = IG;
	if (difficulty == EASY) playerHealth = maxHealth;
	else if (difficulty == HARD) playerHealth = maxHealth - 2;
	else if (difficulty == INSANE) playerHealth = maxHealth - 4;

	gameRestart = 1;

}

function lbPressed() {
	scene = LB;
	showSettings = 1;
	settingPressed();
}

function backPressed() {
	scene = ST;
	backButton.hide();
}

function settingPressed() {
	showSettings = !showSettings;

	if (showSettings) {
		sfxSlider.show();
		musSlider.show();
		if (scene == ST) difSlider.show();
	} else {
		sfxSlider.hide();
		musSlider.hide();
		difSlider.hide();
	}
}

function quitPressed() {
	saveScore();
	window.close();
}

function resumePressed() {
	resumeButton.hide();
	stButton.hide();
	endButton.hide();
	sfxSlider.hide();
	musSlider.hide();
	showSettings = 0;
	scene = IG;
}

function endgamePressed() {
	player.gameOver();
	resumeButton.hide();
	stButton.hide();
	endButton.hide();
	sfxSlider.hide();
	musSlider.hide();
	showSettings = 0;
}

function loadAnimations() {
	p_anim.push(SPR_player[1]);
	p_anim.push(SPR_player[1]);
	p_anim.push(SPR_player[1]);
	p_anim.push(SPR_player[0]);
	p_anim.push(SPR_player[0]);
	p_anim.push(SPR_player[1]);
	p_anim.push(SPR_player[1]);
	p_anim.push(SPR_player[1]);
}

function drawExplosions() {
	explosions.forEach(explosion => {
		explosion.draw();
		explosion.update();
	});

	explosions = explosions.filter(explosion => !explosion.isOver());
}

function saveScore() {
	// save highscores and close .json file

}