var marker = document.getElementById('terrain');
var brush = document.getElementById('brush');
var img1;
var img2;
var img3;
var img4;
var t_demand = [];
var t_potential = [];

function preload() {
	img1 = loadImage('./chennai1990_1.png');
	img2 = loadImage('./chennai2000_2.png');
	img3 = loadImage('./chennai2008_2.png');
	img4 = createImage(1920, 944);
}

function setup() {
	createCanvas(1920, 944);
	img1.loadPixels();
	img2.loadPixels();
	img3.loadPixels();
	img4.loadPixels();
	img4.pixels = img3.pixels;
	img1.updatePixels();
	image(img3, 0, 0, 1920, 944);
	generate(2016);

}

function generate(n) {
	var y1 = 1990;
	var y2 = 2000;
	var y3 = 2008;
	// s1 = built up, s2 = greenery, s3 = water
	let s1_1 = 0;
	let s2_1 = 0;
	let s3_1 = 0;
	let s1_2 = 0;
	let s2_2 = 0;
	let s3_2 = 0;
	let s1_3 = 0;
	let s2_3 = 0;
	let s3_3 = 0;
	var step1 = y2 - y1;
	var step2 = y3 - y2;
	var step3 = n - y3;
	// (j, i)
	var j = 0;
	// Pic 3
	for(let i = 0; i < img3.pixels.length; i+=4) {
		if (img3.pixels[i + 1] > 210) {
			s1_3++;
		} else if (img3.pixels[i+1] > 130) {
			s2_3++;
		} else if (img3.pixels[i] > 100) {
			s1_3++;
		} else {
			s3_3++;
		}
	}
	// Pic 2
	for(let i = 0; i < img2.pixels.length; i+=4) {
		if (img2.pixels[i + 1] > 210) {
			s1_2++;
		} else if (img2.pixels[i+1] > 130) {
			s2_2++;
		} else if (img2.pixels[i] > 100) {
			s1_2++;
		} else {
			s3_2++;
		}
	}

	// Pic 1
	for(let i = 0; i < img1.pixels.length; i+=4) {
		if (img1.pixels[i + 1] > 210) {
			s1_1++;
		} else if (img1.pixels[i+1] > 130) {
			s2_1++;
		} else if (img1.pixels[i] > 100) {
			s1_1++;
		} else {
			s3_1++;
		}
	}
	console.log(s1_3, s2_3, s3_3);
	console.log(s1_2, s2_2, s3_2);
	console.log(s1_1, s2_1, s3_1);
	var td_builtup = ((s1_3 - s1_2) + 0.5*(s1_2 - s1_1)) / (step1*0.5 + step2);
	var td_green = ((s2_3 - s2_2) + 0.5*(s2_2 - s2_1)) / (step1*0.5 + step2);
	var td_water = ((s3_3 - s3_2) + 0.5*(s3_2 - s3_1)) / (step1*0.5 + step2);
	console.log(td_builtup, td_green, td_water);
}

function mark() {
	let x = mouseX;
	let y = mouseY;
	let b = parseInt(brush.value);
	let i1 = x + b;
	let j1 = y + b;
	for (let i = x - b; i < i1; i++) {
		for (let j = y - b; j < j1; j++) {
			img1.set(i, j, color(marker.value));		
		}
	}
	img1.updatePixels();
	image(img1, 0, 0, 1920, 944);
}



function mouseClicked() {
	mark();
}

function mouseDragged() {
	mark();
}