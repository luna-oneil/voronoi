"use strict";

class Point {
    constructor(x, y, red, green, blue) {
        this.x = x;
        this.y = y;
        this.red = red;
        this.green = green;
        this.blue = blue;
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
    addSliderEventListeners(colorRange, redMinSlider, redMaxSlider, greenMinSlider, greenMaxSlider, blueMinSlider, blueMaxSlider);
    generateButton.addEventListener("click", function() {
        generate(canvas, colorRange, Number(numPointsSlider.value));
    });
    generate(canvas, colorRange, Number(numPointsSlider.value));
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

// precondition: points contains at least one point, canvas is a valid canvas within DOM
// for every pixel (this is O(whp) time complexity, with w
// being width, h being height, and p being the number of points)
function render(canvas, points) {
    // returns if points is empty
    if (points.length <= 0) {
        return;
    }
    const ctx = canvas.getContext("2d");
    const imageData = new ImageData(canvas.width, canvas.height);
    const imagePixels = imageData.data;
    let index = 0;
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {            
            // find the closest point
            let closestPoint = points[0];
            let minDistance = findDistance(x, y, closestPoint.x, closestPoint.y);
            for (let i = 1; i < points.length; i++) {
                const dist = findDistance(x, y, points[i].x, points[i].y);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestPoint = points[i];
                }
            }
            imagePixels[index++] = closestPoint.red;
            imagePixels[index++] = closestPoint.green;
            imagePixels[index++] = closestPoint.blue;
            imagePixels[index++] = 255;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function swapSliders(slider1, slider2) {
    [slider1.value, slider2.value] = [slider2.value, slider1.value];
}

// NOT exact pixels, sqrt is avoided because this is only ever compared to other findDistance values in the codebase
function findDistance(x1, y1, x2, y2) {
    return ((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2));
}

main();
