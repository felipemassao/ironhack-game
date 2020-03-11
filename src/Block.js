// Blocks the player must avoid **obs: now it is a circle collision and a meteor
class Block {
	constructor(anchorX, anchorY, radius, angle, side, speed){
		this.transform = new RadialTransform2D(anchorX, anchorY, radius, angle);
		this.side = side;
		this.speed = speed;
	}

	moveTowardsCenter(){
		let { speed } = this;
		if(this.transform.radius <= 2) {
			this.transform.radius = 2;
		} else {
			this.transform.radius -= 1 * speed;
		}
	}

	draw(ctx){
		const { side } = this;
		let { x, y } = this.transform;

		const img = new Image();
		img.src = 'src/New Piskel.gif';
		ctx.drawImage(img, x - side / 2, y - side / 2, side, side);
	}
}
