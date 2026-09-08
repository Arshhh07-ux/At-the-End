import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


/* =========================================================
   FINAL JOURNEY
   ORIGINAL 3D HORROR TRAIN GAME
   ========================================================= */


/* ================= DOM ================= */

const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");
const playerNameInput = document.getElementById("playerName");
const startError = document.getElementById("startError");

const game = document.getElementById("game");
const threeContainer = document.getElementById("threeContainer");

const healthEl = document.getElementById("health");
const fearEl = document.getElementById("fear");
const batteryEl = document.getElementById("battery");
const staminaEl = document.getElementById("stamina");

const clockEl = document.getElementById("clock");
const coachEl = document.getElementById("coach");
const playerDisplay = document.getElementById("playerDisplay");

const missionEl = document.getElementById("mission");

const messageBox = document.getElementById("messageBox");
const messageEl = document.getElementById("message");

const interactionEl = document.getElementById("interaction");

const damageFlash = document.getElementById("damageFlash");
const redOverlay = document.getElementById("redOverlay");
const staticEffect = document.getElementById("staticEffect");
const bloodOverlay = document.getElementById("bloodOverlay");

const phone = document.getElementById("phone");
const phoneTime = document.getElementById("phoneTime");
const phoneMessage = document.getElementById("phoneMessage");
const closePhone = document.getElementById("closePhone");

const storyScreen = document.getElementById("storyScreen");
const storyText = document.getElementById("storyText");

const climaxScreen = document.getElementById("climaxScreen");
const climaxCounter = document.getElementById("climaxCounter");

const endingScreen = document.getElementById("endingScreen");
const endingTitle = document.getElementById("endingTitle");
const endingText = document.getElementById("endingText");
const restartButton = document.getElementById("restartButton");


/* ================= GAME STATE ================= */

let playerName = "यात्री";

let scene;
let camera;
let renderer;

let flashlight;
let ambientLight;

let ghost;
let ghostLight;

let clock = new THREE.Clock();

let gameStarted = false;

let flashlightOn = true;

let health = 100;
let fear = 0;
let battery = 100;
let stamina = 100;

let trainPosition = 0;

let currentCoach = 1;

let elapsed = 0;

let eventTimer = 0;

let messageTimer = 0;

let climaxStarted = false;

let climaxTime = 30;

let ending = false;

let phoneOpen = false;

let canMove = true;

let shakePower = 0;

let horrorLevel = 0;

let doorObjects = [];

let interactObjects = [];

let flickerLights = [];

let trainObjects = [];

let footstepsTimer = 0;


/* ================= PLAYER ================= */

const player = {

    position: new THREE.Vector3(
        0,
        1.65,
        7
    ),

    velocity: new THREE.Vector3(),

    speed: 3.2,

    runSpeed: 5.5,

    rotationY: Math.PI,

    rotationX: 0

};


/* ================= KEYBOARD ================= */

const keys = {};

window.addEventListener("keydown", e => {

    keys[e.key.toLowerCase()] = true;

    if (e.key.toLowerCase() === "f") {

        toggleFlashlight();

    }

    if (e.key.toLowerCase() === "e") {

        interact();

    }

    if (e.key.toLowerCase() === "p") {

        togglePhone();

    }

});

window.addEventListener("keyup", e => {

    keys[e.key.toLowerCase()] = false;

});


/* =========================================================
   START GAME
   ========================================================= */

startButton.addEventListener("click", startGame);


function startGame() {

    playerName = playerNameInput.value.trim();

    if (!playerName) {

        startError.textContent =
            "पहले अपना नाम लिखो...";

        playerNameInput.focus();

        return;

    }

    startError.textContent = "";

    startScreen.style.display = "none";

    game.style.display = "block";

    gameStarted = true;

    playerDisplay.textContent = playerName;

    init3D();

    startAudio();

    showStory(

        `रात के 2:13 बजे...

        ${playerName}, तुमने अपनी आँखें खोलीं।

        ट्रेन चल रही थी।

        तुम्हें याद नहीं था कि तुम इसमें चढ़े कब।

        सामने की सीट खाली थी।

        लेकिन शीशे में...

        कोई तुम्हारे पीछे खड़ा था।`

    );

}


/* =========================================================
   THREE JS
   ========================================================= */

function init3D() {

    scene = new THREE.Scene();

    scene.background =
        new THREE.Color(0x020202);

    scene.fog =
        new THREE.FogExp2(
            0x020202,
            0.075
        );


    /* CAMERA */

    camera =
        new THREE.PerspectiveCamera(
            75,
            window.innerWidth /
            window.innerHeight,
            0.05,
            1000
        );

    camera.position.copy(
        player.position
    );


    /* RENDERER */

    renderer =
        new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: "high-performance"
        });

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            1.8
        )
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.shadowMap.enabled = true;

    renderer.shadowMap.type =
        THREE.PCFSoftShadowMap;

    threeContainer.appendChild(
        renderer.domElement
    );


    /* LIGHT */

    ambientLight =
        new THREE.AmbientLight(
            0x202020,
            1
        );

    scene.add(ambientLight);


    /* FLASHLIGHT */

    flashlight =
        new THREE.SpotLight(
            0xffffff,
            7,
            28,
            Math.PI / 7,
            0.55,
            1.2
        );

    flashlight.position.set(
        0,
        1.65,
        0
    );

    flashlight.castShadow = true;

    camera.add(flashlight);

    scene.add(camera);


    /* TRAIN */

    createTrain();


    /* GHOST */

    createGhost();


    /* EVENTS */

    createEventObjects();


    window.addEventListener(
        "resize",
        resize
    );


    /* MOUSE */

    setupMouse();


    /* TOUCH */

    setupTouch();


    /* START LOOP */

    renderer.setAnimationLoop(
        gameLoop
    );

}


/* =========================================================
   TRAIN
   ========================================================= */

function createTrain() {

    const floorMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x252525,
            roughness: 0.9
        });

    const wallMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x343434,
            roughness: 0.8
        });

    const ceilingMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 1
        });

    const metalMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x555555,
            metalness: .7,
            roughness: .35
        });


    /* FLOOR */

    const floor =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                8,
                .25,
                70
            ),
            floorMaterial
        );

    floor.position.y = -.15;

    floor.receiveShadow = true;

    scene.add(floor);


    /* CEILING */

    const ceiling =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                8,
                .25,
                70
            ),
            ceilingMaterial
        );

    ceiling.position.y = 3.8;

    scene.add(ceiling);


    /* LEFT WALL */

    const leftWall =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                .3,
                4,
                70
            ),
            wallMaterial
        );

    leftWall.position.set(
        -4,
        1.8,
        0
    );

    scene.add(leftWall);


    /* RIGHT WALL */

    const rightWall =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                .3,
                4,
                70
            ),
            wallMaterial
        );

    rightWall.position.set(
        4,
        1.8,
        0
    );

    scene.add(rightWall);


    /* WINDOWS */

    for (
        let z = -34;
        z <= 34;
        z += 4
    ) {

        createWindow(
            -3.82,
            2.3,
            z
        );

        createWindow(
            3.82,
            2.3,
            z
        );

    }


    /* SEATS */

    for (
        let z = -32;
        z <= 32;
        z += 4
    ) {

        createSeat(
            -2.5,
            z
        );

        createSeat(
            2.5,
            z
        );

    }


    /* BERTHS */

    for (
        let z = -32;
        z <= 32;
        z += 4
    ) {

        createBerths(
            -3.0,
            z
        );

        createBerths(
            3.0,
            z
        );

    }


    /* DOORS */

    for (
        let z = -35;
        z <= 35;
        z += 8
    ) {

        createDoor(
            0,
            z
        );

    }


    /* CEILING LIGHTS */

    for (
        let z = -32;
        z <= 32;
        z += 4
    ) {

        createCeilingLight(z);

    }


    /* PANTRY */

    createPantry();


    /* EXIT SIGN */

    createSign(
        0,
        3.2,
        -34,
        "EXIT"
    );

}


/* =========================================================
   WINDOW
   ========================================================= */

function createWindow(x, y, z) {

    const frame =
        new THREE.MeshStandardMaterial({
            color: 0x111111,
            metalness: .8
        });

    const glass =
        new THREE.MeshBasicMaterial({
            color: 0x02060a
        });

    const outer =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                .08,
                1.2,
                2.1
            ),
            glass
        );

    outer.position.set(
        x,
        y,
        z
    );

    scene.add(outer);


    const top =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                .2,
                .1,
                2.3
            ),
            frame
        );

    top.position.set(
        x,
        y + .65,
        z
    );

    scene.add(top);


    const bottom =
        top.clone();

    bottom.position.y =
        y - .65;

    scene.add(bottom);

}


/* =========================================================
   SEAT
   ========================================================= */

function createSeat(x, z) {

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x172020,
            roughness: 1
        });

    const seat =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.8,
                .45,
                1.5
            ),
            material
        );

    seat.position.set(
        x,
        .65,
        z
    );

    seat.castShadow = true;

    scene.add(seat);


    const back =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.8,
                1.4,
                .35
            ),
            material
        );

    back.position.set(
        x,
        1.35,
        z + (x < 0 ? .5 : -.5)
    );

    scene.add(back);

}


/* =========================================================
   BERTH
   ========================================================= */

function createBerths(x, z) {

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x303333,
            roughness: .95
        });


    for (
        let level = 0;
        level < 2;
        level++
    ) {

        const berth =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    .8,
                    .18,
                    2.7
                ),
                material
            );

        berth.position.set(
            x,
            1.2 + level * .9,
            z
        );

        berth.castShadow = true;

        scene.add(berth);

    }

}


/* =========================================================
   DOOR
   ========================================================= */

function createDoor(x, z) {

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x101010,
            metalness: .6,
            roughness: .7
        });

    const door =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.4,
                3.1,
                .18
            ),
            material
        );

    door.position.set(
        x,
        1.55,
        z
    );

    scene.add(door);

    doorObjects.push(door);

}


/* =========================================================
   CEILING LIGHT
   ========================================================= */

function createCeilingLight(z) {

    const lamp =
        new THREE.PointLight(
            0xffdca0,
            1.5,
            8
        );

    lamp.position.set(
        0,
        3.3,
        z
    );

    scene.add(lamp);

    flickerLights.push(lamp);


    const bulb =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.1,
                .08,
                .18
            ),
            new THREE.MeshBasicMaterial({
                color: 0xffffff
            })
        );

    bulb.position.copy(
        lamp.position
    );

    scene.add(bulb);

}


/* =========================================================
   PANTRY
   ========================================================= */

function createPantry() {

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x292929,
            metalness: .5,
            roughness: .8
        });

    const counter =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.8,
                1,
                2
            ),
            material
        );

    counter.position.set(
        0,
        .5,
        -28
    );

    scene.add(counter);


    const machine =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1,
                1.4,
                .7
            ),
            material
        );

    machine.position.set(
        0,
        1.7,
        -28
    );

    scene.add(machine);

}


/* =========================================================
   SIGN
   ========================================================= */

function createSign(
    x,
    y,
    z,
    text
) {

    const canvas =
        document.createElement("canvas");

    canvas.width = 256;
    canvas.height = 64;

    const ctx =
        canvas.getContext("2d");

    ctx.fillStyle = "#111";

    ctx.fillRect(
        0,
        0,
        256,
        64
    );

    ctx.fillStyle = "#ddd";

    ctx.font =
        "bold 32px Arial";

    ctx.textAlign =
        "center";

    ctx.fillText(
        text,
        128,
        42
    );

    const texture =
        new THREE.CanvasTexture(canvas);

    const material =
        new THREE.MeshBasicMaterial({
            map: texture
        });

    const mesh =
        new THREE.Mesh(
            new THREE.PlaneGeometry(
                2,
                .5
            ),
            material
        );

    mesh.position.set(
        x,
        y,
        z
    );

    mesh.rotation.y =
        Math.PI;

    scene.add(mesh);

}


/* =========================================================
   GHOST
   ========================================================= */

function createGhost() {

    const group =
        new THREE.Group();


    const bodyMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xcccccc,
            transparent: true,
            opacity: .12
        });


    const body =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                .55,
                .8,
                2,
                16
            ),
            bodyMaterial
        );

    body.position.y = 1.3;

    group.add(body);


    const head =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                .38,
                16,
                16
            ),
            bodyMaterial
        );

    head.position.y = 2.6;

    group.add(head);


    const eyeMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xff0000
        });


    const eye1 =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                .045,
                8,
                8
            ),
            eyeMaterial
        );

    eye1.position.set(
        -.13,
        2.65,
        -.34
    );

    group.add(eye1);


    const eye2 =
        eye1.clone();

    eye2.position.x = .13;

    group.add(eye2);


    group.position.set(
        0,
        -10,
        -20
    );


    ghostLight =
        new THREE.PointLight(
            0xff0000,
            2,
            5
        );

    group.add(
        ghostLight
    );


    scene.add(group);

    ghost = group;

}


/* =========================================================
   EVENT OBJECTS
   ========================================================= */

function createEventObjects() {

    const note =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                .6,
                .02,
                .8
            ),
            new THREE.MeshStandardMaterial({
                color: 0x999999
            })
        );

    note.position.set(
        2.5,
        1.2,
        -12
    );

    scene.add(note);

    interactObjects.push(note);


    const suitcase =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                .8,
                .7,
                1.3
            ),
            new THREE.MeshStandardMaterial({
                color: 0x151515
            })
        );

    suitcase.position.set(
        -2.5,
        .4,
        -20
    );

    scene.add(suitcase);

    interactObjects.push(
        suitcase
    );

}


/* =========================================================
   MOUSE LOOK
   ========================================================= */

function setupMouse() {

    let dragging = false;

    let lastX = 0;
    let lastY = 0;


    renderer.domElement.addEventListener(
        "pointerdown",
        e => {

            dragging = true;

            lastX = e.clientX;
            lastY = e.clientY;

        }
    );


    window.addEventListener(
        "pointerup",
        () => {

            dragging = false;

        }
    );


    window.addEventListener(
        "pointermove",
        e => {

            if (!dragging) return;

            const dx =
                e.clientX - lastX;

            const dy =
                e.clientY - lastY;

            lastX = e.clientX;
            lastY = e.clientY;


            player.rotationY -=
                dx * .004;

            player.rotationX -=
                dy * .003;

            player.rotationX =
                Math.max(
                    -.9,
                    Math.min(
                        .9,
                        player.rotationX
                    )
                );

        }
    );

}


/* =========================================================
   TOUCH LOOK
   ========================================================= */

function setupTouch() {

    const buttons = {

        upBtn: "w",
        downBtn: "s",
        leftBtn: "a",
        rightBtn: "d"

    };


    Object.entries(buttons)
        .forEach(([id,key]) => {

            const button =
                document.getElementById(id);

            button.addEventListener(
                "touchstart",
                e => {

               
