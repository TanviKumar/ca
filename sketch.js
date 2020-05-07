var marker = document.getElementById('terrain');
var brush = document.getElementById('brush');
var img;

function preload() {
	img = loadImage('./chennai1992.jpg');
}

function setup() {
	createCanvas(1280, 720);
	img.loadPixels();
	img.updatePixels();
	image(img, 0, 0, 1280, 720);

}

function mark() {
	let x = mouseX;
	let y = mouseY;
	let b = parseInt(brush.value);
	let i1 = x + b;
	let j1 = y + b;
	for (let i = x - b; i < i1; i++) {
		for (let j = y - b; j < j1; j++) {
			img.set(i, j, color(marker.value));		
		}
	}
	img.updatePixels();
	image(img, 0, 0, 1280, 720);
}



function mouseClicked() {
	mark();
}

function mouseDragged() {
	mark();
}