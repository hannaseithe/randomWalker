let x_init, y_init;
let counter = 0;
let canvas, ctx;
let noiseFreq = 0.05;
let p5;
let rold = 0;
let line = []

var init = {
    frequency: 0.00005,
    inc: 3,
    lineWidth: 1,
    opacity: 0.1
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

}

function initialize() {
    canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        x_init = Math.floor(canvas.width / 2);
        y_init = Math.floor(canvas.height / 2);
        line.push([x_init, y_init]);
        ctx.lineWidth = 1;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //p5 = new window.p5();
        //window.requestAnimationFrame(drawWalker);
        setUpBindings();
        drawWalker();
    }

}

function drawWalker() {
    // while (counter < 500000) {

    ctx.beginPath();
    var newX = line[line.length - 1][0];
    var newY = line[line.length - 1][1];
    ctx.moveTo(newX, newY);

    var r = getRandomInt(100);
    r = r > 7 ? /*(r > 15 ? (rold + 1) % 8 :*/ ((rold + 7) % 8) : r;

    //var r = getNoiseInt(8);
    switch (r) {
        case 0: {
            newX += init.inc;
            break;
        }
        case 2: {
            newY += init.inc;
            break;
        }
        case 4: {
            newX += -init.inc;
            break;
        }
        case 6: {
            newY += -init.inc;
            break
        }
        case 1: {
            newX += init.inc;
            newY += init.inc;
            break;
        }
        case 7: {
            newX += init.inc;
            newY += -init.inc;
            break;
        }
        case 5: {
            newX += -init.inc;
            newY += -init.inc;
            break;
        }
        case 3: {
            newX += -init.inc;
            newY += init.inc;
            break;
        }
    }
    counter++;
    if (insideCanvas(newX, newY) /*&& noCrossLine(newX, newY)*/) {
        rold = r;
        line.push([newX, newY]);
        ctx.lineTo(newX, newY);
        var red = Math.sin(init.frequency * counter + 0) * 127 + 128;
        var green = Math.sin(init.frequency * counter + 2) * 127 + 128;
        var blue = Math.sin(init.frequency * counter + 4) * 127 + 128;
        ctx.strokeStyle = "rgba(" + red + "," + green + "," + blue + ",0.5)"
        ctx.stroke();
    }

    //drawWalker();
    //}



    window.requestAnimationFrame(drawWalker);
}