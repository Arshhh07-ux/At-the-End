import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


/* =========================
   GAME VARIABLES
========================= */

let scene;
let camera;
let renderer;

let player;

let clock;

let keys = {};

let flashlight;

let flashlightOn = true;

let health = 100;
let fear = 0;
let battery = 100;

let playerName = "";

let started = false;

let canInteract = false;


/* =========================
   DOM
========================= */

const startScreen =
    document.getElementById("startScreen");

const gameUI =
    document.getElementById("gameUI");

const startButton =
    document.getElementById("startButton");

const playerNameInput =
    document.getElementById("playerName");

const errorBox =
    document.getElementById("error");

const messageBox =
    document.getElementById("message");


/* =========================
   START BUTTON
========================= */

startButton.addEventListener(
    "click",
    startGame
);


function startGame() {

    const name =
        playerNameInput.value.trim();


    if (!name) {

        errorBox.textContent =
            "⚠️ पहले अपना नाम लिखें।";

        playerNameInput.focus();

        return;
    }


    playerName = name;

    document.getElementById(
        "nameDisplay"
    ).textContent = playerName;


    startScreen.classList.add(
        "hidden"
    );

    gameUI.classList.remove(
        "hidden"
    );


    init3D();

    started = true;


    showMessage(
        `स्वागत है ${playerName}... ट्रेन चलने वाली है।`
    );
}


/* =========================
   THREE.JS INITIALIZATION
========================= */

function init3D() {

    scene =
        new THREE.Scene();


    scene.background =
        new THREE.Color(0x020202);


    scene.fog =
        new THREE.Fog(
            0x020202,
            2,
            30
        );


    clock =
        new THREE.Clock();


    /* CAMERA */

    camera =
        new THREE.PerspectiveCamera(
            70,
            window.innerWidth /
            window.innerHeight,
            0.05,
            100
        );


    camera.position.set(
        0,
        1.7,
        7
    );


    /* RENDERER */

    renderer =
        new THREE.WebGLRenderer({
            antialias: true
        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );


    renderer.shadowMap.enabled =
        true;


    document.body.appendChild(
        renderer.domElement
    );


    /* PLAYER */

    player = {

        position:
            new THREE.Vector3(
                0,
                1.7,
                7
            ),

        rotation: 0,

        speed: 3

    };


    /* LIGHT */

    const ambient =
        new THREE.HemisphereLight(
            0x777777,
            0x050505,
            0.45
        );


    scene.add(ambient);


    /* TRAIN */

    createTrain();


    /* FLASHLIGHT */

    flashlight =
        new THREE.SpotLight(
            0xffffff,
            8,
            18,
            Math.PI / 8,
            0.5,
            1
        );


    flashlight.position.set(
        0,
        1.7,
        6.5
    );


    scene.add(flashlight);


    camera.add(
        flashlight
    );


    scene.add(camera);


    /* EVENTS */

    window.addEventListener(
        "resize",
        onResize
    );


    document.addEventListener(
        "keydown",
        keyDown
    );


    document.addEventListener(
        "keyup",
        keyUp
    );


    setupMobileControls();


    animate();
}


/* =========================
   CREATE TRAIN
========================= */

function createTrain() {

    /* FLOOR */

    const floorMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x252525,
            roughness: 0.9
        });


    const floor =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                5,
                0.2,
                30
            ),
            floorMaterial
        );


    floor.position.y =
        -0.1;


    floor.receiveShadow = true;

    scene.add(floor);


    /* CEILING */

    const ceiling =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                5,
                0.2,
                30
            ),
            new THREE.MeshStandardMaterial({
                color: 0x181818
            })
        );


    ceiling.position.y =
        3.6;


    scene.add(ceiling);


    /* WALLS */

    const wallMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x303030,
            roughness: 1
        });


    const leftWall =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.2,
                3.6,
                30
            ),
            wallMaterial
        );


    leftWall.position.set(
        -2.5,
        1.8,
        0
    );


    scene.add(leftWall);


    const rightWall =
        leftWall.clone();


    rightWall.position.x =
        2.5;


    scene.add(rightWall);


    /* WINDOWS */

    for (
        let z = -13;
        z <= 13;
        z += 3
    ) {

        createWindow(
            -2.38,
            z
        );

        createWindow(
            2.38,
            z
        );

    }


    /* BERTHS */

    for (
        let z = -12;
        z <= 12;
        z += 4
    ) {

        createBerth(
            -1.7,
            z
        );

        createBerth(
            1.7,
            z
        );

    }


    /* LIGHTS */

    for (
        let z = -12;
        z <= 12;
        z += 4
    ) {

        const light =
            new THREE.PointLight(
                0xffeeee,
                1.2,
                5
            );


        light.position.set(
            0,
            3.1,
            z
        );


        scene.add(light);

    }


    /* DOORS */

    createDoor(
        0,
        -14.7
    );


    createDoor(
        0,
        14.7
    );


    /* SEATS */

    for (
        let z = -11;
        z <= 11;
        z += 4
    ) {

        createSeat(
            -0.8,
            z
        );

        createSeat(
            0.8,
            z
        );

    }

}


/* =========================
   WINDOW
========================= */

function createWindow(
    x,
    z
) {

    const window =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.08,
                1.3,
                1.7
            ),
            new THREE.MeshBasicMaterial({
                color: 0x02040a
            })
        );


    window.position.set(
        x,
        2.15,
        z
    );


    scene.add(window);

}


/* =========================
   BERTH
========================= */

function createBerth(
    x,
    z
) {

    for (
        let y = 1.1;
        y <= 2.7;
        y += 0.75
    ) {

        const bed =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    1.3,
                    0.15,
                    2.5
                ),
                new THREE.MeshStandardMaterial({
                    color: 0x555555
                })
            );


        bed.position.set(
            x,
            y,
            z
        );


        scene.add(bed);

    }

}


/* =========================
   SEAT
========================= */

function createSeat(
    x,
    z
) {

    const seat =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.9,
                0.7,
                1.2
            ),
            new THREE.MeshStandardMaterial({
                color: 0x292929
            })
        );


    seat.position.set(
        x,
        0.35,
        z
    );


    scene.add(seat);

}


/* =========================
   DOOR
========================= */

function createDoor(
    x,
    z
) {

    const door =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.5,
                2.8,
                0.15
            ),
            new THREE.MeshStandardMaterial({
                color: 0x111111
            })
        );


    door.position.set(
        x,
        1.4,
        z
    );


    scene.add(door);

}


/* =========================
   KEYBOARD
========================= */

function keyDown(event) {

    keys[
        event.key.toLowerCase()
    ] = true;


    if (
        event.key.toLowerCase() === "e"
    ) {

        interact();

    }


    if (
        event.key.toLowerCase() === "f"
    ) {

        toggleFlashlight();

    }

}


function keyUp(event) {

    keys[
        event.key.toLowerCase()
    ] = false;

}


/* =========================
   MOVEMENT
========================= */

function updateMovement(
    delta
) {

    if (!started) return;


    const speed =
        player.speed * delta;


    if (keys["w"]) {

        camera.translateZ(
            -speed
        );

    }


    if (keys["s"]) {

        camera.translateZ(
            speed
        );

    }


    if (keys["a"]) {

        camera.translateX(
            -speed
        );

    }


    if (keys["d"]) {

        camera.translateX(
            speed
        );

    }


    /* KEEP PLAYER INSIDE TRAIN */

    camera.position.x =
        THREE.MathUtils.clamp(
            camera.position.x,
            -1.7,
            1.7
        );


    camera.position.z =
        THREE.MathUtils.clamp(
            camera.position.z,
            -13.5,
            13.5
        );


    camera.position.y =
        1.7;

}


/* =========================
   INTERACTION
========================= */

function interact() {

    if (!started) return;


    const distance =
        camera.position.z;


    if (
        Math.abs(distance) > 12
    ) {

        showMessage(
            "दरवाज़ा बहुत पास है… लेकिन अभी बंद है।"
        );

        fear += 3;

        updateStats();

        return;
    }


    fear += 2;


    showMessage(
        "तुमने आसपास देखा… कुछ अजीब महसूस हो रहा है।"
    );


    updateStats();

}


/* =========================
   FLASHLIGHT
========================= */

function toggleFlashlight() {

    if (battery <= 0) {

        showMessage(
            "🔦 टॉर्च की battery खत्म हो गई!"
        );

        return;
    }


    flashlightOn =
        !flashlightOn;


    flashlight.visible =
        flashlightOn;


    showMessage(
        flashlightOn
            ? "🔦 टॉर्च ON"
            : "🔦 टॉर्च OFF"
    );

}


/* =========================
   RANDOM HORROR
========================= */

let horrorTimer = 0;


function horrorEvents(
    delta
) {

    horrorTimer += delta;


    if (
        horrorTimer < 12
    ) return;


    horrorTimer = 0;


    const chance =
        Math.random();


    if (chance < 0.45) {

        fear += 8;


        showMessage(
            `तुम्हें लगा किसी ने ${playerName} नाम से पुकारा…`
        );


        flashLights();

    }


    else if (chance < 0.75) {

        fear += 12;


        showMessage(
            "👻 खिड़की के बाहर कुछ बहुत तेज़ी से गुज़रा…"
        );

    }


    else {

        fear += 15;


        showMessage(
            "⚠️ पीछे से कदमों की आवाज़ आ रही है…"
        );

    }


    updateStats();


    if (fear >= 100) {

        showMessage(
            "😨 तुम्हारा डर बहुत बढ़ गया है..."
        );

    }

}


/* =========================
   LIGHT FLICKER
========================= */

function flashLights() {

    scene.traverse(
        function (object) {

            if (
                object.isPointLight
            ) {

                object.visible = false;

            }

        }
    );


    setTimeout(
        function () {

            scene.traverse(
                function (object) {

                    if (
                        object.isPointLight
                    ) {

                        object.visible = true;

                    }

                }
            );

        },
        350
    );

}


/* =========================
   STATS
========================= */

function updateStats() {

    fear =
        Math.min(
            100,
            Math.max(0, fear)
        );


    health =
        Math.min(
            100,
            Math.max(0, health)
        );


    battery =
        Math.min(
            100,
            Math.max(0, battery)
        );


    document.getElementById(
        "health"
    ).textContent = health;


    document.getElementById(
        "fear"
    ).textContent = fear;


    document.getElementById(
        "battery"
    ).textContent = battery;

}


/* =========================
   MESSAGE
========================= */

let messageTimer;


function showMessage(text) {

    messageBox.textContent =
        text;


    clearTimeout(
        messageTimer
    );


    messageTimer =
        setTimeout(
            function () {

                messageBox.textContent =
                    "";

            },
            5000
        );

}


/* =========================
   MOBILE
========================= */

function setupMobileControls() {

    holdButton(
        "forward",
        "w"
    );

    holdButton(
        "backward",
        "s"
    );

    holdButton(
        "left",
        "a"
    );

    holdButton(
        "right",
        "d"
    );


    document.getElementById(
        "interact"
    ).addEventListener(
        "click",
        interact
    );


    document.getElementById(
        "flashlight"
    ).addEventListener(
        "click",
        toggleFlashlight
    );

}


function holdButton(
    id,
    key
) {

    const button =
        document.getElementById(id);


    button.addEventListener(
        "touchstart",
        function (event) {

            event.preventDefault();

            keys[key] = true;

        }
    );


    button.addEventListener(
        "touchend",
        function (event) {

            event.preventDefault();

            keys[key] = false;

        }
    );


    button.addEventListener(
        "mousedown",
        function () {

            keys[key] = true;

        }
    );


    button.addEventListener(
        "mouseup",
        function () {

            keys[key] = false;

        }
    );


    button.addEventListener(
        "mouseleave",
        function () {

            keys[key] = false;

        }
    );

}


/* =========================
   RESIZE
========================= */

function onResize() {

    if (!camera || !renderer) {
        return;
    }


    camera.aspect =
        window.innerWidth /
        window.innerHeight;


    camera.updateProjectionMatrix();


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

}


/* =========================
   GAME LOOP
========================= */

function animate() {

    requestAnimationFrame(
        animate
    );


    const delta =
        Math.min(
            clock.getDelta(),
            0.05
        );


    updateMovement(delta);


    horrorEvents(delta);


    if (
        flashlightOn &&
        battery > 0
    ) {

        battery -=
            delta * 0.15;

    }


    updateStats();


    renderer.render(
        scene,
        camera
    );

}
