// Declare global variables
let cam;              // Webcam capture
let canvasElement;    // Canvas element
let w = 0, h = 0;    // Width and height of the camera feed
let bg;               // Graphics buffer for drawing
let prevBgW = 0, prevBgH = 0; // Track last buffer dimensions to avoid recreation

// Noise parameters
const ns = 60;        // Noise scale for spatial variation
const nss = 150;      // Noise scale for temporal variation
const ni = 6;         // Noise intensity multiplier

/**
 * Setup function runs once when the program starts
 * Initializes the webcam and canvas
 */
function setup() {
    // Create and hide the webcam capture
    cam = createCapture(VIDEO);
    cam.hide();

    // Create a canvas that fills the window
    canvasElement = createCanvas(windowWidth, windowHeight);

    // Disable high-DPI scaling — halves the pixel work on retina/high-res displays
    pixelDensity(1);

    // Cap frame rate to keep rendering stable and reduce CPU/GPU load on Windows
    frameRate(30);

    // Set initial background to black
    background(0);
}

/**
 * Draw function runs continuously in a loop
 * Processes the webcam feed with visual effects
 */
function draw() {
    // Create a semi-transparent black background for trail effect
    background(0, 25);

    // Wait until camera is loaded
    if (cam.width > 0) {
        w = cam.width;
        h = cam.height;
    }

    // Skip rendering until the camera has a valid size
    if (w === 0) return;

    // Set parameters based on camera orientation
    let sz, space, walk, spd;
    if (w > h) {
        // Landscape orientation
        sz = 5;        // Size of particles
        space = 1;     // Space between particles
        walk = 30;     // Orbital distance
        spd = 35;      // Animation speed
    } else {
        // Portrait orientation
        sz = 5;
        space = 5;
        walk = 15;
        spd = 5;
    }

    // Recreate the graphics buffer only when camera dimensions change, not every frame
    let bgW = w - (walk * 2);
    let bgH = h - (walk * 2);
    if (!bg || bgW !== prevBgW || bgH !== prevBgH) {
        if (bg) bg.remove();
        bg = createGraphics(bgW, bgH);
        bg.noStroke();
        prevBgW = bgW;
        prevBgH = bgH;
    }

    // Clear the buffer for this frame (instead of recreating it)
    bg.clear();

    // Calculate dimensions for maintaining aspect ratio
    let nW, nH, oX, oY;
    if (width / height >= w / h) {
        // Window is wider than camera aspect ratio
        nW = width;
        nH = width / (w / h);
        oX = 0;
        oY = (height - nH) / 2;
    } else {
        // Window is taller than camera aspect ratio
        nW = height * (w / h);
        nH = height;
        oX = (width - nW) / 2;
        oY = 0;
    }

    // Pre-calculate per-frame values that are constant across all pixels
    let timeNoise = noise(frameCount / nss);
    let orbitX = sin(frameCount / spd) * walk;
    let orbitY = cos(frameCount / spd) * walk;

    // Load pixel data from webcam
    cam.loadPixels();

    // Loop through pixels at intervals to create particles
    for (let x = 0; x < w; x += sz + space) {
        for (let y = 0; y < h; y += sz + space) {
            // Calculate pixel index and get RGB values
            let idx = ((y * w) + x) * 4;
            let r = cam.pixels[idx];
            let g = cam.pixels[idx + 1];
            let b = cam.pixels[idx + 2];

            // Set fill color based on pixel color
            bg.fill(r, g, b);

            // Add noise-based displacement (timeNoise is shared for the whole frame)
            let nx = noise(x / ns, y / ns) * timeNoise * ni;
            let ny = noise(y / ns, x / ns) * timeNoise * ni;

            // Draw the particle (ellipse)
            bg.ellipse((x - walk) + (orbitX * nx), (y - walk) + (orbitY * ny), sz, sz);
        }
    }

    // Draw the processed image to the canvas
    // Use push/pop to apply transformations only to this image
    push();
    // Flip horizontally to create mirror effect
    translate(width, 0);
    scale(-1, 1);
    // Draw the graphics buffer to screen
    image(bg, oX, oY, nW, nH);
    pop();
}

/**
 * Handle window resizing
 * Resizes the canvas to match the new window dimensions
 */
function windowResized() {
    canvasElement = createCanvas(windowWidth, windowHeight);
}

/**
 * Handle mouse clicks
 * Toggles fullscreen mode when the user clicks
 */
function mousePressed() {
    if (mouseX > 0 && mouseX < windowWidth && mouseY > 0 && mouseY < windowHeight) {
        let fs = fullscreen();
        fullscreen(!fs);
    }
}
