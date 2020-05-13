var marker = document.getElementById('terrain');
var brush = document.getElementById('brush');
var img1;
var img2;
var img3;
var img4;
var t_demand = [];
var si;
var t_potential = [];
var lcolor;

function preload() {
	//img1 = loadImage('./chennai1990_1.png');
	img1 = loadImage('./chennai2000_2.png');
	img2 = loadImage('./chennai2008_2.png');
	img3 = loadImage('./chennai2016_1.png');
	img4 = img3;
}

function setup() {
	createCanvas(1920, 944);
	lcolor = color("#ffdd00");
	img1.loadPixels();
	img2.loadPixels();
	img3.loadPixels();
	img4.loadPixels();
	img4.pixels = img3.pixels;
	si = img3.pixels.length / 4;
	console.log(si);
	img1.updatePixels();
	//image(img4, 0, 0, 1920, 944);
	generate(2040);

}

function generate(n) {
	var y1 = 2000;
	var y2 = 2008;
	var y3 = 2016;
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
	var td_water = ((s3_3 - s3_1)) / (step1 + step2);
	console.log(td_builtup, td_green, td_water);

	var req_builtup = td_builtup*step3;
	var req_green = td_green*step3;
	var req_water = td_water*step3;
	let l = 0;
	let l1 = 0;
	let g = 0;
	let w = 0; 
	console.log("in");
	for (let i = 0; i < si; i++) {
		t_potential[i] = 0;
	}
	while(step3--) {
		let w_l = 0;
		let g_l = 0;
		for (let i = 0; i < img4.pixels.length - 5; i+=4) {
			// Growing land masses
			if (img3.pixels[i + 1] > 210) {
				t_potential[i/4] += 0;
				let x = int(i/4) % width;
				let y = int((i/4) / width);
				// Used to be green, recently became built-up hence influencing the green around it.
				if (img2.pixels[i + 1] < 210 && img2.pixels[i + 1] > 130) {
					if ((i/4 > 1) && img3.pixels[i - 3] < 210 && img3.pixels[i - 3] > 130)
						t_potential[(i/4) - 1] += 1;
					if (img3.pixels[i + 5] < 210 && img3.pixels[i + 5] > 130)
						t_potential[(i/4) + 1] += 1;
					if ((i/4) > width && img3.get(x, y- 1)[1] < 210 && img3.get(x, y-1)[1] > 130)
						t_potential[(i/4) - width] += 1;
					if ((i/4) + width < t_potential.length && img3.get(x, y+1)[1] < 210 && img3.get(x, y+1)[1] > 130)
						t_potential[(i/4) + width] += 1;
				}
				// Used to be water, recently became built-up hence influencing the water around it.
				if (img2.pixels[i + 2] > 210) {
					console.log('reached water');
					if ((i/4 > 1) && img3.get(x-1, y)[2] > 210)
						t_potential[(i/4) - 1] -= 1;
					if (img3.get(x+1, y)[2] > 210)
						t_potential[(i/4) + 1] -= 1;
					if ((i/4) > width && img3.get(x, y-1)[2] > 210)
						t_potential[(i/4) - width] -= 1;
					if ((i/4) + width < t_potential.length && img3.get(x, y+1)[2] > 210)
						t_potential[(i/4) + width] -= 1;
				}
				continue;
			}
		}
		console.log('out');
		for(let j = 0; j < t_potential.length; ++j) {
			if(t_potential[j] != 0) {
				g_l++;
			}
		}
		
		if (req_builtup - g_l < 0) {
			step3 = 0;
		}
		
		for(let k = 0; k < t_potential.length; ++k) {
			if(t_potential[k] != 0) {				
				img3.set(k % width, k / width, lcolor);
			}			
		}
		img3.updatePixels();
		image(img3, 0, 0, 1920, 944);
	}
	for (let j = 0; j < t_potential.length; ++j) {
		if(t_potential[j] > 0) {
			g--;
			l++;
			if (t_potential[j] > 1) {
				l1++;
			}
		}
		if (t_potential[j] < -1) {
			w--;
			l++;
		}
	}
	s1_3 = s2_3 = s3_3 = 0;
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
	console.log(s1_3, s2_3, s3_3);
	image(img3, 0, 0, 1920, 944);
	console.log(l, l1, g, w, t_potential.length);
}

function mark() {
	let x = mouseX;
	let y = mouseY;
	let b = parseInt(brush.value);
	let i1 = x + b;
	let j1 = y + b;
	for (let i = x - b; i < i1; i++) {
		for (let j = y - b; j < j1; j++) {
			img3.set(i, j, color(marker.value));		
		}
	}
	img3.updatePixels();
	image(img3, 0, 0, 1920, 944);
}



function mouseClicked() {
	mark();
}

function mouseDragged() {
	mark();
}