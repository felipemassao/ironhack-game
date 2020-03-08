let canvas = document.querySelector('canvas');
let gameManager = new GameManager(canvas);

document.getElementById('start').addEventListener('click', (event) => {
	gameManager.gameStart();
});
