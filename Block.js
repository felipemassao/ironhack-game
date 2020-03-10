// Blocks the player must avoid
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
		let { side } = this;
		let { x, y } = this.transform;

		ctx.save();

		ctx.beginPath();
		ctx.fillStyle = 'red';
		ctx.arc(x, y, side / 2, 0, Math.PI * 2, true);
		ctx.fill();
		ctx.closePath();

		ctx.restore();
	}
}
