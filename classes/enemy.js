let ebullets = [];

// Wait Paramaters
let noEnemies = 0;
let maxEnemies;
let waveDefeated = 0;

// Wave Counters
let wave_counter = 0,
	wave_start = 0,
	phaseCtr = 0,
	movePhase = 0,
	altCtr = 0,
	altMove = 0,
	dir1 = 1,
	dir2 = 1;

// Misc
let ctr = 0;

class Enemy_Manager {

	enemySystem() {
		this.levels();
		if (enemies.length != 0) this.enemyAI();
		this.pauseEB();
	}

	levels() {

		if (wave_counter == 4) { //Restarts Game, buffs enemies
			wave_counter = 0;
			levelNumber++;
		}

		if (wave_counter == 0) this.enemy_wave0();
		if (wave_counter == 1) this.enemy_wave1();
		if (wave_counter == 2) this.enemy_wave2();
		if (wave_counter == 3) this.boss_wave0();
		
		if (waveDefeated) {
			this.resetWave();
			if (gameRestart != 1) wave_counter++;
			wave_start = 0;
			waveDefeated = 0;
		}
	}

	enemy_wave0() {

		maxEnemies = 5;
		if (wave_start == 0 && noEnemies == 0) {
			wave_start = 1;
			for (let i = 0; i < maxEnemies; i++) enemy(width / 2, -80, 0, i);
		}

		this.removeEnemies();
		if (noEnemies != 0 && enemies.length == maxEnemies) this.wave0em();

		if (noEnemies == 0 && enemies.length == 0) waveDefeated = 1;
		else waveDefeated = 0;

	}

	enemy_wave1() {

		maxEnemies = 5;
		if (wave_start == 0 && noEnemies == 0) {
			wave_start = 1;
			for (let i = 0; i < maxEnemies; i++) enemy(width / 2, -80, 1, i);
		}

		this.removeEnemies();
		if (noEnemies != 0 && enemies.length == maxEnemies) this.wave1em();

		if (noEnemies == 0 && enemies.length == 0) waveDefeated = 1;
		else waveDefeated = 0;

	}

	enemy_wave2() {

		maxEnemies = 5;
		if (wave_start == 0 && noEnemies == 0) {
			wave_start = 1;
			for (let i = 0; i < maxEnemies; i++) enemy(width / 2, -80, 2, i);
		}

		this.removeEnemies();
		if (noEnemies != 0 && enemies.length == maxEnemies) this.wave2em();

		if (noEnemies == 0 && enemies.length == 0) waveDefeated = 1;
		else waveDefeated = 0;

	}

	boss_wave0() {

		maxEnemies = 5;
		if (wave_start == 0 && noEnemies == 0) {
			wave_start = 1;
			for (let i = 0; i < maxEnemies; i++) enemy(width / 2, -80, 3, i);
		}

		this.removeEnemies();
		if (noEnemies != 0 && enemies.length == maxEnemies) this.wave3em();

		if (noEnemies == 0 && enemies.length == 0) waveDefeated = 1;
		else waveDefeated = 0;

	}

	enemyAI() {
		gameRestart = 0;
		this.removeEnemies();
		this.removeEBullets();

		let erate = 0;
		if (noEnemies >= 10) erate = int(40 / (1 + difficulty));
		if (noEnemies < 10) erate = int(60 / (1 + difficulty));

		if (enemies.length != 0 && noEnemies != 0) {
			let shooter = int(random(0, enemies.length));
			if (frameCount % erate == 0 && enemies[shooter].removed == false) {
				enemyBullet(enemies[shooter].position.x, enemies[shooter].position.y + 25);
			}
		}

		

	}

	removeEnemies() {
		if (noEnemies != 0) {
			for (let i = 0; i < enemies.length; i++) {
				for (let j = 0; j < pbullets.length; j++) {
					if (enemies[i].overlap(pbullets[j])) {
						if (shotUpgrade == 0) enemyHealth[i]--;
						if (shotUpgrade == 1) enemyHealth[i] -= 2; 
						if (shotUpgrade == 2) enemyHealth[i] -= 5;
						if (enemyHealth[i] <= 0) {
							let epos = enemies[i].position;
							explosions.push(new Explosion(epos.x, epos.y, 0.25));
							enemies[i].remove();
							AUD_exp.play();
							AUD_exp.setVolume(sfxV);
							player.addScore();
						}
						pbDir.splice(j, 1);
						pbullets[j].remove();
						pbullets.splice(j, 1);
					}
				}
			}
		}
		noEnemies = 0;
		for (let i = 0; i < enemies.length; i++) {
			if (enemies[i].removed == false) noEnemies += 1;
		}
		if (noEnemies == 0) {
			for (let i = 0; i < enemies.length; i++) {
				enemies.splice(i, 1);
				enemyHealth.splice(i, 1);
			}
			this.resetWave();
		}
	}

	removeEBullets() {
		for (let i = 0; i < ebullets.length; i++) {
			if (ebullets[i].overlap(G_Player)) player.loseHealth();
			if (ebullets[i].position.y > height || ebullets[i].collide(G_Player)) {
				ebullets[i].remove();
				ebullets.splice(i, 1);
			}
		}
	}

	wave0em() {

		if (movePhase == 0) {
			for (let i = 0; i < enemies.length; i++) {
				let spacing = (width / maxEnemies) * i + 75;
				if (enemies[i].position.x != spacing) {
					if (spacing < width / 2) enemies[i].position.x -= 5;
					else if (spacing >= width / 2) enemies[i].position.x += 5;
				}
				if (enemies[i].position.y <= 100) enemies[i].position.y += 2;
			}
		}

		if (phaseCtr > 100) movePhase = 1;
		else phaseCtr += 1;

		if (movePhase == 1) {

			if (altCtr > 100) altMove = 1;
			else altCtr += 1;

			for (let i = 0; i < enemies.length; i += 2) {
				enemies[i].position.y += 1 * dir1;
				if (enemies[i].position.y == 100) dir1 = dir1 * (-1);
				if (enemies[i].position.y == 200) dir1 = dir1 * (-1);
			}

			if (altMove == 1) {
				for (let i = 1; i < enemies.length; i += 2) {
					enemies[i].position.y += 1 * dir2;
					if (enemies[i].position.y == 200) dir2 = dir2 * (-1);
					if (enemies[i].position.y == 100) dir2 = dir2 * (-1);
				}
			}

		}

	}

	wave1em() {

		if (movePhase == 0) {
			for (let i = 0; i < enemies.length; i++) {
				let spacing = (width / maxEnemies) * i + 75;
				if (enemies[i].position.x != spacing) {
					if (spacing < width / 2) enemies[i].position.x -= 5;
					else if (spacing >= width / 2) enemies[i].position.x += 5;
				}
				if (enemies[i].position.y <= 100) enemies[i].position.y += 2;
			}
		}

		if (phaseCtr > 100) movePhase = 1;
		else phaseCtr += 1;

		if (movePhase == 1) {

			if (altCtr > 100) altMove = 1;
			else altCtr += 1;

			for (let i = 0; i < enemies.length; i += 2) {
				enemies[i].position.y += 1 * dir1;
				if (enemies[i].position.y == 100) dir1 = dir1 * (-1);
				if (enemies[i].position.y == 200) dir1 = dir1 * (-1);
			}

			if (altMove == 1) {
				for (let i = 1; i < enemies.length; i += 2) {
					enemies[i].position.y += 1 * dir2;
					if (enemies[i].position.y == 200) dir2 = dir2 * (-1);
					if (enemies[i].position.y == 100) dir2 = dir2 * (-1);
				}
			}

		}

	}

	wave2em() {

		if (movePhase == 0) {
			for (let i = 0; i < enemies.length; i++) {
				let spacing = (width / maxEnemies) * i + 75;
				if (enemies[i].position.x != spacing) {
					if (spacing < width / 2) enemies[i].position.x -= 5;
					else if (spacing >= width / 2) enemies[i].position.x += 5;
				}
				if (enemies[i].position.y <= 100) enemies[i].position.y += 2;
			}
		}

		if (phaseCtr > 100) movePhase = 1;
		else phaseCtr += 1;

		if (movePhase == 1) {

			if (altCtr > 100) altMove = 1;
			else altCtr += 1;

			for (let i = 0; i < enemies.length; i += 2) {
				enemies[i].position.y += 1 * dir1;
				if (enemies[i].position.y == 100) dir1 = dir1 * (-1);
				if (enemies[i].position.y == 200) dir1 = dir1 * (-1);
			}

			if (altMove == 1) {
				for (let i = 1; i < enemies.length; i += 2) {
					enemies[i].position.y += 1 * dir2;
					if (enemies[i].position.y == 200) dir2 = dir2 * (-1);
					if (enemies[i].position.y == 100) dir2 = dir2 * (-1);
				}
			}

		}

	}

	wave3em() {

		if (movePhase == 0) {
			for (let i = 0; i < enemies.length; i++) {
				let spacing = (width / maxEnemies) * i + 75;
				if (enemies[i].position.x != spacing) {
					if (spacing < width / 2) enemies[i].position.x -= 5;
					else if (spacing >= width / 2) enemies[i].position.x += 5;
				}
				if (enemies[i].position.y <= 100) enemies[i].position.y += 2;
			}
		}

		if (phaseCtr > 100) movePhase = 1;
		else phaseCtr += 1;

		if (movePhase == 1) {

			if (altCtr > 100) altMove = 1;
			else altCtr += 1;

			for (let i = 0; i < enemies.length; i += 2) {
				enemies[i].position.y += 1 * dir1;
				if (enemies[i].position.y == 100) dir1 = dir1 * (-1);
				if (enemies[i].position.y == 200) dir1 = dir1 * (-1);
			}

			if (altMove == 1) {
				for (let i = 1; i < enemies.length; i += 2) {
					enemies[i].position.y += 1 * dir2;
					if (enemies[i].position.y == 200) dir2 = dir2 * (-1);
					if (enemies[i].position.y == 100) dir2 = dir2 * (-1);
				}
			}

		}

	}

	resetWave() {

		if (noEnemies == 0) {
			phaseCtr = 0;
			movePhase = 0;
			dir1 = 1;
			dir2 = 1;
			altCtr = 0;
			altMove = 0;
		}

	}

	pauseEB() {

		if (scene == P_IG) {
			for (let i = 0; i < ebullets.length; i++) {
				ebullets[i].setVelocity(0, 0);
			}
		} else {
			for (let i = 0; i < ebullets.length; i++) {
				ebullets[i].setVelocity(0, 10);
			}
		}

	}

}

function enemy(x, y, lvl, idx) {

	enemies[idx] = createSprite(x, y, 25);
	enemies[idx].shapeColor = 'blue';
	// enemies[idx].debug = true;

	if (lvl == 0) {
		enemyHealth[idx] = 1 + difficulty + levelNumber;
		enemies[idx].addImage(SPR_enemies[0]);
	}
	if (lvl == 1) {
		enemyHealth[idx] = 2 + difficulty * 2 + levelNumber;
		enemies[idx].addImage(SPR_enemies[1]);
	}
	if (lvl == 2) {
		enemyHealth[idx] = 3 + difficulty * 2 + levelNumber;
		enemies[idx].addImage(SPR_enemies[2]);
	}
	if (lvl == 3) {
		enemyHealth[idx] = 10 + difficulty * 2 + levelNumber;
		enemies[idx].addImage(SPR_enemies[3]);
	}

	enemies[idx].scale = 0.7;
}

function enemyBullet(x, y) {

	ebullets[ebullets.length] = createSprite(x, y, 8);
	ebullets[ebullets.length - 1].shapeColor = [255, 150, 0];
	ebullets[ebullets.length - 1].setVelocity(0, 10);
	// ebullets[ebullets.length - 1].rotateToDirection = true;
	// ebullets[ebullets.length - 1].debug = true;
	ebullets[ebullets.length - 1].life = 500;
	ebullets[ebullets.length - 1].addImage(SPR_ebullet[0]);
	ebullets[ebullets.length - 1].scale = 0.7;

	AUD_eshoot.play();
	AUD_eshoot.setVolume(sfxV);
}