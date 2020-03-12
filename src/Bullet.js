class Bullet {
    constructor(anchorX, anchorY, radius, angle, side, speed){
		this.transform = new RadialTransform2D(anchorX, anchorY, radius, angle);
		this.side = side;
		this.speed = speed;
	}

	moveFoward(){
		const { speed } = this;
		this.transform.radius += 1 * speed;
	}

	draw(ctx){
		const { side } = this;
		const { x, y } = this.transform;

		ctx.beginPath();
		ctx.fillStyle = 'yellow';
		ctx.arc(x, y, side / 4, 0, Math.PI * 2, true);
		ctx.fill();
		ctx.closePath();
	}
}