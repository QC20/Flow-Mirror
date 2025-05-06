let cam;
ns = 60;
nss = 150;
ni = 8;

function setup() {

	cam = createCapture(VIDEO);
	cam.hide();

	canvasElement = createCanvas(windowWidth, windowHeight);

	background(0);

}

let i, r, g, b;

function draw() {

	background(0, 25);

	if (cam.width > 0) {
		w = cam.width;
		h = cam.height;
	}

	if (w > h) {
		sz = 5;
		space = 1;
		walk = 30;
		spd = 35;
	} else {
		sz = 5;
		space = 5;
		walk = 15;
		spd = 5;
	}

	bg = createGraphics(w - (walk * 2), h - (walk * 2));

	bg.noStroke();

	if (width / height >= w / h) {

		nW = width;
		nH = width / (w / h);
		oX = 0;
		oY = (height - nH) / 2;

	} else {

		nW = height * (w / h);
		nH = height;
		oX = (width - nW) / 2;
		oY = 0;

	}

	cam.loadPixels();

	for (let x = 0; x < w; x += sz + space) {
		for (let y = 0; y < h; y += sz + space) {
			i = ((y * w) + x) * 4;
			r = cam.pixels[i];
			g = cam.pixels[i + 1];
			b = cam.pixels[i + 2];
			bg.fill(r, g, b);
			orbitX = sin(frameCount / spd) * walk;
			orbitY = cos(frameCount / spd) * walk;
			nx = noise(x / ns, y / ns) * noise(frameCount / nss) * ni;
			ny = noise(y / ns, x / ns) * noise(frameCount / nss) * ni;
			bg.ellipse((x - walk) + (orbitX * nx), (y - walk) + (orbitY * ny), sz, sz);
		}
	}

	push();
	translate(width, 0);
	scale(-1, 1);
	image(bg, oX, oY, nW, nH);
	pop();

}

function windowResized() {

	canvasElement = createCanvas(windowWidth, windowHeight);

}

function mousePressed() {
	if (mouseX > 0 && mouseX < windowWidth && mouseY > 0 && mouseY < windowHeight) {
		let fs = fullscreen();
		fullscreen(!fs);
	}
}