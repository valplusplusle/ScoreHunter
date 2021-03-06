var p1 = document.getElementById('player');
keyCodes = { left: 'KeyA', up: 'KeyW', right: 'KeyD', down: 'KeyS', space: 'Space' };
keys = [];
lastKeys = [];
let mapVariable = '1';
let blockedCoords = JSON.parse(map2);
let velocity = 0.0;
let velocityMax = 2.0;
let velocityMin = 0.0;
let acceleration = 0.1;
let lastKey = '';
let neverZeroVelocity;
let speedUsed = 0;

// read JSON object from file
function start() {
    // parse JSON object
    
    function canMove(testIfCanMove) {
        if (window.gameMap != mapVariable) {
            mapVariable = window.gameMap;
            if (window.gameMap == '1') {
                blockedCoords = JSON.parse(map2);
            }
            if (window.gameMap == '2') {
                blockedCoords = JSON.parse(map3);
            }
            if (window.gameMap == '3') {
                blockedCoords = JSON.parse(map5);
            }
        }
        let blockedValue = true;
        blockedCoords.forEach(coords => {
            if(coords.left == testIfCanMove.left && coords.top == testIfCanMove.top) {
                blockedValue = false;
            }    
        });
        if (blockedValue) {
            return true;
        } else {
            return false;
        }
    }

    // position Loop
    setInterval(function () {

        let p1 = document.getElementById('player');
        let world = document.getElementById('gameArea');
        // get position of div
        let x = p1.offsetLeft + 10;
        let y = p1.offsetTop + 40;
        let xWorld = world.offsetLeft;
        let yWorld = world.offsetTop;

        // velocity calculation
        if (keys[keyCodes.left] || keys[keyCodes.right] || keys[keyCodes.up] || keys[keyCodes.down] || keys[keyCodes.space]) {
            velocity += acceleration;
            lastKeys[keyCodes.left] = keys[keyCodes.left];
            lastKeys[keyCodes.right] = keys[keyCodes.right];
            lastKeys[keyCodes.up] = keys[keyCodes.up];
            lastKeys[keyCodes.down] = keys[keyCodes.down];
            lastKeys[keyCodes.space] = keys[keyCodes.space];
        } else {
            velocity -= acceleration;
        }

        if (velocity > velocityMax) {
            velocity = velocityMax;
        }
        if (velocity < velocityMin) {
            velocity = velocityMin;
        }

        let xRounded = Math.round(x);
        let yRounded = Math.round(y);

        if (seekerStatus == false) {
            document.getElementById('speedmeter').style.visibility = 'visible';
        } else {
            document.getElementById('speedmeter').style.visibility = 'hidden';
        }
        // update position
        // left/right
        if(velocity > 0.0){
            if(velocity < 1.0){
                neverZeroVelocity = 1;
            }
            else{
                neverZeroVelocity = 2;
            }

            if (lastKeys[keyCodes.space] && speedUsed < 100 && seekerStatus == false) {
                neverZeroVelocity = 4;
                speedUsed = speedUsed + 4;
                document.getElementById('inner-speedmeter').style.height = speedUsed.toString() + '%';
            } else {
                if(speedUsed >= 0) {
                    speedUsed = speedUsed - 0.5;
                    document.getElementById('inner-speedmeter').style.height = speedUsed.toString() + '%';
                }
            }

            if (lastKeys[keyCodes.left]) {
                const testIfCanMove = {left: xRounded-velocityMax, top: yRounded}
                if (canMove(testIfCanMove)) { 
                    x -= neverZeroVelocity;
                    xWorld += neverZeroVelocity;
                }
            }
            if (lastKeys[keyCodes.right]) {
                const testIfCanMove = {left: xRounded+velocityMax, top: yRounded}
                if (canMove(testIfCanMove)) { 
                    x += neverZeroVelocity;
                    xWorld -= neverZeroVelocity;
                }
            }
            // up/down
            if (lastKeys[keyCodes.up]) {
                const testIfCanMove = {left: xRounded, top: yRounded-velocityMax}
                if (canMove(testIfCanMove)) { 
                    y -= neverZeroVelocity;
                    yWorld += neverZeroVelocity;
                }
            }
            if (lastKeys[keyCodes.down]) {
                const testIfCanMove = {left: xRounded, top: yRounded+velocityMax}
                if (canMove(testIfCanMove)) { 
                    y += neverZeroVelocity;
                    yWorld -= neverZeroVelocity;
                }
            }
        }

        // set div position
        p1.style.left = x-10 + 'px';
        p1.style.top = y-40 + 'px';
    
        world.style.left = xWorld + 'px';
        world.style.top = yWorld + 'px';
    }, 15);
}

// keyboard Eventlistener
window.addEventListener('keydown', function (evt) {
    keys[evt.code] = true;
});

window.addEventListener('keyup', function (evt) {
    keys[evt.code] = false;
});

start();