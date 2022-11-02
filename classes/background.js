let stars = [];
let maxStars = 0;

class BG {

	bg_system() {
		if (scene != P_IG) {
			if (maxStars == 0) this.createStarfield();
			this.move();
		}
	}

	createStarfield() {

		if (frameCount % 55 == 0) {
			createStar(random(20, width - 20), random(-10, 0));
		}

	}

	move() {
		for (let i = 0; i < stars.length; i++) {
			if (stars[i].position.y > height) {
				stars[i].position.y = random(-10, 0);
				stars[i].position.x = random(20, width - 20);
				maxStars = 1;
			} else stars[i].position.y += 3 + 1.1 * levelNumber;
		}
	}

}

function createStar(x, y) {

	stars[stars.length] = createSprite(x, y, 5);
	stars[stars.length - 1].addImage(SPR_star[int(random(0, 2))]);
	stars[stars.length - 1].scale = 0.5;
	// stars[stars.length - 1].debug = true; 

}