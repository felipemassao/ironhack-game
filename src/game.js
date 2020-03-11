let canvas = document.querySelector('canvas');

document.getElementById('start-button').addEventListener('click', (event) => {
	let gameManager = new GameManager(canvas);
	gameManager.start();
});
