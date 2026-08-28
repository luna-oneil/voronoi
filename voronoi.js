"use strict";

const RESIZE_TIME_BEFORE_GENERATION = 20;
const CANVAS_HEIGHT_SCALAR = 0.82;
const CANVAS_WIDTH_SCALAR = 0.79

// object Point (color is a string)
function Point(x, y, color) {
    this.position = new Vector2d(x, y);
    this.color = color;
}

// object Vector2d
function Vector2d(x, y) {
    this.x = x;
    this.y = y;
}

// object colorRange
function ColorRange(rMin, rMax, gMin, gMax, bMin, bMax) {
    this.rMin = rMin;
    this.rMax = rMax;
    this.gMin = gMin;
    this.gMax = gMax;
    this.bMin = bMin;
    this.bMax = bMax;
}

function main() {
    let timer = null;
    let windowHeight = window.innerHeight;
    let windowWidth = window.innerWidth;
    const canvas = document.getElementById("world");
    const numPointsSlider = document.getElementById("num-points");
    const redMinSlider = document.getElementById("red-min");
    const redMaxSlider = document.getElementById("red-max");
    const greenMinSlider = document.getElementById("green-min");
    const greenMaxSlider = document.getElementById("green-max");
    const blueMinSlider = document.getElementById("blue-min");
    const blueMaxSlider = document.getElementById("blue-max");
    const colorRange = new ColorRange();
    canvas.width = Math.floor(windowWidth * CANVAS_WIDTH_SCALAR);
    canvas.height = Math.floor(windowHeight * CANVAS_HEIGHT_SCALAR);
    getColorRangeFromSliders(colorRange, redMinSlider, redMaxSlider, greenMinSlider, greenMaxSlider, blueMinSlider, blueMaxSlider);
    generate(canvas, colorRange, numPointsSlider.value);
    window.addEventListener('resize', () => {
        if (windowWidth == window.innerWidth) {
            return;
        }
        windowHeight = window.innerHeight;
        windowWidth = window.innerWidth;
        canvas.width = Math.floor(windowWidth * CANVAS_WIDTH_SCALAR);
        canvas.height = Math.floor(windowHeight * CANVAS_HEIGHT_SCALAR);
        if (typeof(timer) != null) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            generate(canvas, colorRange, numPointsSlider.value);
        }, RESIZE_TIME_BEFORE_GENERATION);
    })
    numPointsSlider.addEventListener('change', () => {
        generate(canvas, colorRange, numPointsSlider.value);
    });
    redMinSlider.addEventListener('change', () => {
        colorRange.rMin = Number(redMinSlider.value);
        generate(canvas, colorRange, numPointsSlider.value);
    });
    redMaxSlider.addEventListener('change', () => {
        colorRange.rMax = Number(redMaxSlider.value);
        generate(canvas, colorRange, numPointsSlider.value);
    });
    greenMinSlider.addEventListener('change', () => {
        colorRange.gMin = Number(greenMinSlider.value);
        generate(canvas, colorRange, numPointsSlider.value);
    });
    greenMaxSlider.addEventListener('change', () => {
        colorRange.gMax = Number(greenMaxSlider.value);
        generate(canvas, colorRange, numPointsSlider.value);
    });
    blueMinSlider.addEventListener('change', () => {
        colorRange.bMin = Number(blueMinSlider.value);
        generate(canvas, colorRange, numPointsSlider.value);
    });
    blueMaxSlider.addEventListener('change', () => {
        colorRange.bMax = Number(blueMaxSlider.value);
        generate(canvas, colorRange, numPointsSlider.value);
    });
    canvas.addEventListener("click", function() {
        generate(canvas, colorRange, numPointsSlider.value);
    });
}

function getColorRangeFromSliders(colorRange, redMin, redMax, greenMin, greenMax, blueMin, blueMax) {
    colorRange.rMin = Number(redMin.value);
    colorRange.rMax = Number(redMax.value);
    colorRange.gMin = Number(greenMin.value);
    colorRange.gMax = Number(greenMax.value);
    colorRange.bMin = Number(blueMin.value);
    colorRange.bMax = Number(blueMax.value);
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

// returns string
function getRandomColor(colorRange) {
    let red = getRandomNum(colorRange.rMin, colorRange.rMax);
    let green = getRandomNum(colorRange.gMin, colorRange.gMax);
    let blue = getRandomNum(colorRange.bMin, colorRange.bMax);
    return "rgb(" + String(red) + " " + String(green) + " " + String(blue) + ")";
}

// returns Point (maxX and maxY are exclusive)
function makeRandomPoint(maxX, maxY, colorRange) {
    const x = getRandomNum(0, maxX);
    const y = getRandomNum(0, maxY);
    const color = getRandomColor(colorRange);
    return new Point(x, y, color);
}

function render(canvas, points) {
    // for every pixel (this is O(whp) time complexity, with w
    // being width, h being height, and p being the number of points)
    const ctx = canvas.getContext("2d");
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
            ctx.fillStyle = closestPoint.color;
            ctx.fillRect(x, y, 1, 1);
        }
    }
}

function findDistance(x1, y1, x2, y2) {
    return Math.sqrt(((x1 - x2) ** 2) + ((y1 - y2) ** 2))
}

main();
