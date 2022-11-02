const LEFT = 37;
const RIGHT = 39;
const UP = 38;
const DOWN = 40;
const SPACE = 32;

const healthUp = 0;
const shieldUp = 1;
const incFireRate = 2;
const upgradeFire = 3;

let up, left, down, right;
let px = 0,
	py = 0;

let p;
let pbullets = [];
let pbDir = [];
let sc = [100, 200, 0];
let speed = 1.7;

let pos, w;
let shootCD = 0;
let maxCD = 30;

let noDmg = 0;
let lostHealth = 0;
let healthy = 1;
let shieldTimer = 0;

let spin = 0;
let createPowerUps = 0;
let powerUpLaunched = 0;
let powerUpPicked = 0;

class Player {

	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		p = createSprite(this.x, this.y, this.w, this.h);
		p.shapeColor = sc;
		p.friction = 0.1;

		// p.debug = true;
		p.addImage('normal', SPR_player[0]);
		p.addAnimation('hurt', p_anim[0], p_anim[1], p_anim[2], p_anim[3], p_anim[4], p_anim[5], p_anim[6], p_anim[p_anim.length - 1]);

		p.scale = 0.7;
		p.visible = false;
		p.addToGroup(G_Player);

	}

	playerSystem() {
		if (scene == IG || scene == P_IG) p.visible = true;
		else p.visible = false;
		if (createPowerUps == 0) initPowerUps();

		if (healthy) {
			if (cheats == true) this.testmove();
			else this.move();
			this.updateScore();
			this.updateHealth();
			this.randomItem();
			this.collectItem();
			this.resetPowerUp();
			this.shoot();
			this.removePBullets();
		}
		this.pausePB();
		if (playerHealth == 0) this.gameOver();

	}

	move() {

		if (px <= 0.2 && px >= -0.2) {
			px = 0;
		} else {
			if (px > 0) px -= 0.15;
			if (px < 0) px += 0.15;
		}
		if (py <= 0.2 && py >= -0.2) {
			py = 0;
		} else {
			if (py > 0) py -= 0.15;
			if (py < 0) py += 0.15;
		}

		pos = p.position;
		w = this.w;

		// Statememts
		if (keyIsDown(UP) == true) up = true;
		else up = false;
		if (keyIsDown(DOWN) == true) down = true;
		else down = false;
		if (keyIsDown(LEFT) == true) left = true;
		else left = false;
		if (keyIsDown(RIGHT) == true) right = true;
		else right = false;

		if (up && py > -speed * 2) py -= speed;
		if (down && py < speed * 2) py += speed;
		if (left && px > -speed * 2) px -= speed;
		if (right && px < speed * 2) px += speed;

		p.setVelocity(px, py);

		// Player Out of Bounds
		if (pos.x < w) pos.x = w;
		if (pos.x > width - w) pos.x = width - w;
		if (pos.y < w) pos.y = w;
		if (pos.y > height - w) pos.y = height - w;

	}

	shoot() {
		if (keyIsDown(SPACE) && shootCD <= 0) {
			this.straightShoot()
			if (shotUpgrade == 1) this.sideShoot(4);
			if (shotUpgrade == 2) this.sideShoot(2);
			shootCD = maxCD - fireRate;
			AUD_pshoot.play();
			AUD_pshoot.setVolume(sfxV);
		}
		shootCD -= 1;
	}

	straightShoot() {
		playerBullet(pos.x, pos.y - 15, 0, 15 + fireRate / 2);
	}

	sideShoot(spread) {
		playerBullet(pos.x, pos.y - 15, -spread, 15 + fireRate / 2);
		playerBullet(pos.x, pos.y - 15, spread, 15 + fireRate / 2);
	}

	removePBullets() {
		for (let i = 0; i < pbullets.length; i++) {
			if (pbullets[i].position.y < -10) {
				pbDir.splice(i, 1);
				pbullets[i].remove();
				pbullets.splice(i, 1);
			}
		}
	}

	collectItem() {
		for (let i = 0; i < powerUpItem.length; i++) {
			if (G_Player.overlap(powerUpItem[i])) {
				this.resetAllPowerUps();
				powerUpLaunched = 0;
				if (i == healthUp) this.gainHealth();
				if (i == shieldUp && speed <= 2) {
					AUD_healthUp.play();
					AUD_healthUp.setVolume(sfxV);
					speed += 0.05;
				}
				if (i == incFireRate && fireRate <= 18) {
					fireRate += 3;
					AUD_upgrade.play();
					AUD_upgrade.setVolume(sfxV);
				}
				if (i == upgradeFire) {
					if (shotUpgrade != 2) shotUpgrade++;
					else if (fireRate <= 18) fireRate += 2;
					AUD_upgrade.play();
					AUD_upgrade.setVolume(sfxV);
				}
			}
		}
	}

	randomItem() {

		let pickItem = 0,
			chance = 0;

		if (frameCount % (60 * 20) == 0 && powerUpLaunched == 0) {
			chance = random(1, 100);
			if (chance < 10) pickItem = healthUp;
			if (chance >= 10 && chance < 20) pickItem = upgradeFire;
			if (chance >= 20 && chance < 60) pickItem = incFireRate;
			if (chance >= 60 && chance < 100) pickItem = shieldUp;
			powerUpItem[pickItem].position.x = random(20, width - 20);
			powerUpItem[pickItem].position.y = -20;
			powerUpItem[pickItem].setVelocity(0, 3);
			if (spin) powerUpItem[pickItem].rotationSpeed = .5;
			else powerUpItem[pickItem].rotationSpeed -= .5;
			spin = ~spin;
			powerUpItem[pickItem].removed = false;
			powerUpLaunched = 1;
		}

	}

	resetPowerUp() {
		for (let i = 0; i < powerUpItem.length; i++) {
			if (powerUpItem[i].position.y > height) {
				this.resetAllPowerUps();
				powerUpLaunched = 0;
			}
		}
	}

	resetAllPowerUps() {
		for (let i = 0; i < powerUpItem.length; i++) {
			powerUpItem[i].position.x = width / 2;
			powerUpItem[i].position.y = -10;
			powerUpItem[i].setVelocity(0, 0);
			powerUpItem[i].removed = true;
		}
	}

	addScore() {

		playerScore += 5 * (difficulty + 1) * (wave_counter + 1) * (levelNumber + 1);

	}

	updateScore() {

		let str = "SCORE \n" + playerScore;
		push();
		fill(255);
		textFont(gamefont);
		textSize(20);
		text(str, 10, 25);
		pop();

	}

	temp_noDmg() {
		if (lostHealth >= 100) {
			noDmg = 0;
			lostHealth = 0;
			p.shapeColor = sc;
			p.changeAnimation('normal');
			// console.log("not invincible");
		} else {
			p.changeAnimation('hurt');
			p.shapeColor = 'red';
			lostHealth += 1;
			// console.log("invincible");
		}

	}

	gainHealth() {

		playerHealth++;
		AUD_healthUp.play();
		AUD_healthUp.setVolume(sfxV);

	}

	loseHealth() {

		if (noDmg == 0) {
			playerHealth -= 1;
			if (shotUpgrade != 0) shotUpgrade--;
			if (speed != 1.7) speed -= 0.1;
			if (playerHealth != 0) {
				AUD_pdmg.play();
				AUD_pdmg.setVolume(sfxV + 0.5);
			}
			noDmg = 1;
		}

	}

	updateHealth() {

		if (noDmg == 1) this.temp_noDmg();
		if (playerHealth < 0) playerHealth = 0;

		let str = "Health\n" + playerHealth;
		push();
		fill(255);
		textFont(gamefont);
		textSize(20);
		textAlign(RIGHT);
		text(str, width - 110, 25);
		pop();

	}

	gameOver() {

		scene = ST;

		if (healthy) explosions.push(new Explosion(pos.x, pos.y, 0.25));

		AUD_exp.play();
		AUD_exp.setVolume(sfxV);

		AUD_gameover.play();
		AUD_gameover.setVolume(sfxV / 2);

		healthy = 0;

		p.position.x = this.x;
		p.position.y = this.y;
		p.setVelocity(0, 0);

		fireRate = 0;
		shotUpgrade = 0;
		createPowerUps = 0;

		this.clearScreen();
	}

	clearScreen() {
		for (let i = 0; i < enemies.length; i++) {
			if (enemies[i].removed == false) explosions.push(new Explosion(enemies[i].position.x, enemies[i].position.y, 0.25));
			enemyHealth.splice(i, 1);
			enemies[i].remove();
			enemies.splice(i, 1);
		}
		for (let i = 0; i < ebullets.length; i++) {
			ebullets[i].remove();
			ebullets.splice(i, 1);
		}
		for (let i = 0; i < pbullets.length; i++) {
			pbDir.splice(i, 1);
			pbullets[i].remove();
			pbullets.splice(i, 1);
		}
		for (let i = 0; i < powerUpItem.length; i++) {
			powerUp.splice(i, 1);
			powerUpItem[i].remove();
			powerUpItem.splice(i, 1);
		}

		this.resetAllPowerUps();

		if (enemies.length != 0 || pbullets.length != 0 || ebullets.length != 0 || powerUpItem.length != 0) {
			this.clearScreen();
		}

		p.visible = false;
		waveDefeated = 0;
		enemy_manager.resetWave();
		wave_counter = 0;
		levelNumber = 0;
	}

	pausePB() {

		if (scene == P_IG) {
			for (let i = 0; i < pbullets.length; i++) {
				pbullets[i].setVelocity(0, 0);
			}
			for (let i = 0; i < powerUpItem.length; i++) {
				powerUpItem[i].setVelocity(0, 0);
			}
		} else {
			for (let i = 0; i < pbullets.length; i++) {
				pbullets[i].setVelocity(pbDir[i], -(15 + fireRate / 2));
			}

			for (let i = 0; i < powerUpItem.length; i++) {
				powerUpItem[i].setVelocity(0, 3);
			}
		}


	}

	testmove() {

		pos = p.position;
		w = this.w;

		pos.x = mouseX;
		pos.y = mouseY;

		// Player Out of Bounds
		if (pos.x < w) pos.x = w;
		if (pos.x > width - w) pos.x = width - w;
		if (pos.y < w) pos.y = w;
		if (pos.y > height - w) pos.y = height - w;

		if (mouseIsPressed == true && shootCD <= 0) {
			playerBullet(pos.x, pos.y - 15, 0, 30);
			playerBullet(pos.x, pos.y - 15, -1, 30);
			playerBullet(pos.x, pos.y - 15, 1, 30);
			shootCD = 10;
		}

		shootCD -= 1;

	}

}

function playerBullet(x, y, sx, sy) {

	pbullets[pbullets.length] = createSprite(x, y, 8);
	pbullets[pbullets.length - 1].shapeColor = [255, 208, 0];
	pbullets[pbullets.length - 1].setVelocity(sx, -sy);
	// pbullets[pbullets.length - 1].life = 300;
	// pbullets[pbullets.length - 1].debug = true;
	if (shotUpgrade == 0) pbullets[pbullets.length - 1].addImage(SPR_pbullet[0]);
	if (shotUpgrade == 1) pbullets[pbullets.length - 1].addImage(SPR_pbullet[1]);
	if (shotUpgrade == 2) pbullets[pbullets.length - 1].addImage(SPR_pbullet[2]);
	pbullets[pbullets.length - 1].scale = 0.7;


	pbDir.push(sx);

}

function initPowerUps() {

	for (let i = 0; i < 4; i++) {
		powerUpItem[i] = createSprite(width / 2, -40, 10);
		powerUpItem[i].setVelocity(0, 0);
		powerUpItem[i].addImage(SPR_item[i]);
		powerUpItem[i].removed = true;
		// powerUpItem[i].debug = true;
	}

	createPowerUps = 1;
}
