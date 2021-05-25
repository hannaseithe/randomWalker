let x_init, y_init;
let counter = 0;
let canvas, ctx;
let noiseFreq = 0.05;
let p5;
let line = [];
let moveCash = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

var init = {
    frequency: 0.005,
    inc: 10,
    lineWidth: 1,
    lineOpacity: 0.3,
    fadeFrequency: 150,
    randomRatio: 10,
    pattern: "zipper"
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getNoiseInt(max) {
    return Math.floor(p5.noise(counter * noiseFreq) * max)
}



// returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
function intersects(a, b, c, d, p, q, r, s) {
    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
        return false;
    } else {
        lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
        gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
};

function crossLine(line1, line2) {
    return intersects(line1.x1, line1.y1, line1.x2, line1.y2,
        line2.x1, line2.y1, line2.x2, line2.y2)
}

function searchForArray(haystack, needle) {
    var i, j, current;
    for (i = 0; i < haystack.length; ++i) {
        if (needle.length === haystack[i].length) {
            current = haystack[i];
            for (j = 0; j < needle.length && needle[j] === current[j]; ++j);
            if (j === needle.length)
                return i;
        }
    }
    return -1;
}

function noCrossLine(x, y) {
    if (searchForArray(line, [x, y]) > 0) {
        return false;
    }
    if (line.length > 1) {
        var lastLine = {
            x1: line[line.length - 1][0],
            y1: line[line.length - 1][1],
            x2: x,
            y2: y
        }
        for (i = 0; i < line.length - 1; i++) {
            var curLine = {
                x1: line[i][0],
                y1: line[i][1],
                x2: line[i + 1][0],
                y2: line[i + 1][1]
            }
            if (crossLine(curLine, lastLine)) {
                return false
            }
        }
    }

    return true;
}

function insideCanvas(x, y) {
    return ((x > 0) && (x < canvas.width + 1) && (y > 0) && (y < canvas.height + 1))
}

function setUpBindings() {
    var myInputElement1 = document.getElementById("frequencyInput");
    var myInputElement2 = document.getElementById("incInput")
    var myInputElement3 = document.getElementById("fadeInput")
    var myInputElement4 = document.getElementById("widthInput")
    var myInputElement5 = document.getElementById("linOpInput")
    var myInputElement6 = document.getElementById("ranInput")



    new Binding({
        object: init,
        property: "frequency"
    })
        .addBinding(myInputElement1, "value", "keyup")

    new Binding({
        object: init,
        property: "inc"
    })
        .addBinding(myInputElement2, "value", "keyup")

    new Binding({
        object: init,
        property: "fadeFrequency"
    })
        .addBinding(myInputElement3, "value", "keyup")

    new Binding({
        object: init,
        property: "lineWidth"
    })
        .addBinding(myInputElement4, "value", "keyup")

    new Binding({
        object: init,
        property: "lineOpacity"
    })
        .addBinding(myInputElement5, "value", "keyup")

    new Binding({
        object: init,
        property: "randomRatio"
    })
        .addBinding(myInputElement6, "value", "keyup")

    var patternSelection = new Binding({
        object: init,
        property: "pattern"
    })

    var radios = document.getElementsByName("patternOptions");
    for (i = 0; i < radios.length; i++) {
        patternSelection.addRadioBinding(radios[i], "value", "change")
    }

}

function initialize() {
    canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
        var rect = canvas.getBoundingClientRect();
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - rect.y;
        x_init = Math.floor(canvas.width / 2);
        y_init = Math.floor(canvas.height / 2);
        line.push([x_init, y_init]);
        ctx.lineWidth = init.lineWidth;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //p5 = new window.p5();
        //window.requestAnimationFrame(drawWalker);
        setUpBindings();
        drawWalker();
    }

}

function pattern() {
    var rold = moveCash[moveCash.length - 1];
    switch (init.pattern) {
        case "circle":
            return ((rold + 7) % 8);
        case "square":
            return ((rold + 2) % 8);
        case "zipper":
            {
                switch (counter % 3) {
                    case 0:
                    case 2:
                        return ((rold + 2) % 8)
                    case 1:
                        return ((rold + 4) % 8)
                }
            }
        case "cross":
            {
                switch (counter % 3) {
                    case 0:
                        return ((rold + 2) % 8);
                    case 1:
                    case 2:
                        return ((rold + 6) % 8);
                }
            }


    }
}

function drawWalker() {
    // while (counter < 500000) {

    ctx.beginPath();
    var newX = line[line.length - 1][0];
    var newY = line[line.length - 1][1];
    ctx.moveTo(newX, newY);


    var prob = getRandomInt(100);

    var r = getRandomInt(8);
    r = prob > init.randomRatio ? pattern() : r;

    //var r = getNoiseInt(8);
    switch (r) {
        case 0: {
            newX += init.inc;
            break;
        }
        case 1: {
            newX += init.inc;
            newY += init.inc;
            break;
        }
        case 2: {
            newY += init.inc;
            break;
        }
        case 3: {
            newX += -init.inc;
            newY += init.inc;
            break;
        }
        case 4: {
            newX += -init.inc;
            break;
        }
        case 5: {
            newX += -init.inc;
            newY += -init.inc;
            break;
        }
        case 6: {
            newY += -init.inc;
            break
        }
        case 7: {
            newX += init.inc;
            newY += -init.inc;
            break;
        }


    }
    counter++;
    if (insideCanvas(newX, newY) /*&& noCrossLine(newX, newY)*/) {
        if (counter % init.fadeFrequency == 2) {
            ctx.fillStyle = "rgba(0,0,0,0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        moveCash.push(r);
        moveCash.shift();
        line.push([newX, newY]);
        ctx.lineTo(newX, newY);
        ctx.lineWidth = init.lineWidth;
        var red = Math.sin(init.frequency * counter + 0) * 127 + 128;
        var green = Math.sin(init.frequency * counter + 2) * 127 + 128;
        var blue = Math.sin(init.frequency * counter + 4) * 127 + 128;
        ctx.strokeStyle = "rgba(" + red + "," + green + "," + blue + "," + init.lineOpacity + ")"
        ctx.stroke();
    }

    //drawWalker();
    //}



    window.requestAnimationFrame(drawWalker);
}