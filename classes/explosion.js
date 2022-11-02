class Explosion {
	constructor(x, y, speed) {
		this.sprites = SPR_exp;
		this.x = x - this.sprites[0].width / 2;
		this.y = y - this.sprites[0].height / 2;
		this.speed = speed;
		this.index = 0.0;
	}

	draw() {
		image(this.sprites[floor(this.index) % this.sprites.length], this.x, this.y);
	}

	update() {
		this.index += this.speed;
	}

	reset() {
		this.index = 0.0;
	}

	isOver() {
		return this.index >= this.sprites.length;
	}
}