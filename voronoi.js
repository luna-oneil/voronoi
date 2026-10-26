"use strict";

class Point {
    constructor(x, y, red, green, blue) {
        this.position = new Vector2d(x, y);
        this.red = red;
        this.green = green;
        this.blue = blue;
    }
}

class Vector2d {
    // x and y are ints
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class ColorRange {
    // all variables are ints passed from ranges
    constructor(rMin, rMax, gMin, gMax, bMin, bMax) {
        this.rMin = rMin;
        this.rMax = rMax;
        this.gMin = gMin;
        this.gMax = gMax;
        this.bMin = bMin;
        this.bMax = bMax;
    }
}

function main() {
    const canvas = document.getElementById("world");
    const numPointsSlider = document.getElementById("num-points");
    const redMinSlider = document.getElementById("red-min");
    const redMaxSlider = document.getElementById("red-max");
    const greenMinSlider = document.getElementById("green-min");
    const greenMaxSlider = document.getElementById("green-max");
    const blueMinSlider = document.getElementById("blue-min");
    const blueMaxSlider = document.getElementById("blue-max");
    const generateButton = document.getElementById("generate-button");
    const colorRange = new ColorRange(Number(redMinSlider.value), Number(redMaxSlider.value),
        Number(greenMinSlider.value), Number(greenMaxSlider.value),
        Number(blueMinSlider.value), Number(blueMaxSlider.value));
    document.addEventListener("DOMContentLoaded", () => {
        generate(canvas, colorRange, numPointsSlider.value);
    });
    addSliderEventListeners(colorRange, redMinSlider, redMaxSlider, greenMinSlider, greenMaxSlider, blueMinSlider, blueMaxSlider);
    generateButton.addEventListener("click", function() {
        generate(canvas, colorRange, numPointsSlider.value);
    });
}

function generate(canvas, colorRange, numPoints) {
    const points = [];
    for (let i = 0; i < numPoints; i++) {
        points.push(makeRandomPoint(canvas.width, canvas.height, colorRange));
    }
    render(canvas, points);
}

// returns int
function getRandomNum(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

// returns Point (maxX and maxY are exclusive)
function makeRandomPoint(maxX, maxY, colorRange) {
    const x = getRandomNum(0, maxX - 1);
    const y = getRandomNum(0, maxY - 1);
    let red = getRandomNum(colorRange.rMin, colorRange.rMax);
    let green = getRandomNum(colorRange.gMin, colorRange.gMax);
    let blue = getRandomNum(colorRange.bMin, colorRange.bMax);
    return new Point(x, y, red, green, blue);
}

function addSliderEventListeners(colorRange, redMinSlider, redMaxSlider, greenMinSlider, greenMaxSlider, blueMinSlider, blueMaxSlider) {
    redMinSlider.addEventListener('change', () => {
        if (Number(redMinSlider.value) > Number(redMaxSlider.value)) {
            swapSliders(redMinSlider, redMaxSlider);
            colorRange.rMax = Number(redMaxSlider.value);
        }
        colorRange.rMin = Number(redMinSlider.value);
    });
    redMaxSlider.addEventListener('change', () => {
        if (Number(redMinSlider.value) > Number(redMaxSlider.value)) {
            swapSliders(redMinSlider, redMaxSlider);
            colorRange.rMin = Number(redMinSlider.value);
        }
        colorRange.rMax = Number(redMaxSlider.value);
    });
    greenMinSlider.addEventListener('change', () => {
        if (Number(greenMinSlider.value) > Number(greenMaxSlider.value)) {
            swapSliders(greenMinSlider, greenMaxSlider);
            colorRange.gMax = Number(greenMaxSlider.value);
        }
        colorRange.gMin = Number(greenMinSlider.value);
    });
    greenMaxSlider.addEventListener('change', () => {
        if (Number(greenMinSlider.value) > Number(greenMaxSlider.value)) {
            swapSliders(greenMinSlider, greenMaxSlider);
            colorRange.gMin = Number(greenMinSlider.value);
        }
        colorRange.gMax = Number(greenMaxSlider.value);
    });
    blueMinSlider.addEventListener('change', () => {
        if (Number(blueMinSlider.value) > Number(blueMaxSlider.value)) {
            swapSliders(blueMinSlider, blueMaxSlider);
            colorRange.bMax = Number(blueMaxSlider.value);
        }
        colorRange.bMin = Number(blueMinSlider.value);
    });
    blueMaxSlider.addEventListener('change', () => {
        if (Number(blueMinSlider.value) > Number(blueMaxSlider.value)) {
            swapSliders(blueMinSlider, blueMaxSlider);
            colorRange.bMin = Number(blueMinSlider.value);
        }
        colorRange.bMax = Number(blueMaxSlider.value);
    });
}

function render(canvas, points) {
    // for every pixel (this is O(whp) time complexity, with w
    // being width, h being height, and p being the number of points)
    const ctx = canvas.getContext("2d");
    const imageData = new ImageData(canvas.width, canvas.height);
    const imagePixels = imageData.data;
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            // find the closest point
            let closestPoint = points[0];
            for (let i = 1; i < points.length; i++) {
                if (findDistance(x, y, points[i].position.x, points[i].position.y) < 
                findDistance(x, y, closestPoint.position.x, closestPoint.position.y)) {
                    closestPoint = points[i];
                }
            }
            const index = 4 * (y * canvas.width + x)
            imagePixels[index] = closestPoint.red;
            imagePixels[index + 1] = closestPoint.green;
            imagePixels[index + 2] = closestPoint.blue;
            imagePixels[index + 3] = 255;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function swapSliders(slider1, slider2) {
    [slider1.value, slider2.value] = [slider2.value, slider1.value];
    slider1.dispatchEvent(new Event('input'));
    slider2.dispatchEvent(new Event('input'));
}

// NOT exact pixels, sqrt is avoided because this is only ever compared to other findDistance values in the codebase
function findDistance(x1, y1, x2, y2) {
    return ((x1 - x2) ** 2) + ((y1 - y2) ** 2);
}

main();
