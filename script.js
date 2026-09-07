"use strict";

/* =========================
   GAME DATA
========================= */

let game = {
    playerName: "",
    coach: 1,
    health: 100,
    fear: 0,
    battery: 100,
    stamina: 100,

    difficulty: "normal",

    items: [
        "📱 पुराना फोन",
        "🔦 टॉर्च",
        "🎫 ट्रेन टिकट"
    ],

    clues: 0,
    events: 0,
    playedMinutes: 0,

    messages: [
        "अज्ञात नंबर: अभी मत सोना।",
        "अज्ञात नंबर: तुम जिस ट्रेन में हो… वह सामान्य ट्रेन नहीं है।"
    ]
};


/* =========================
   HELPER
========================= */

function $(id) {
    return document.getElementById(id);
}


function show(id) {
    $(id).classList.remove("hidden");
}


function hide(id) {
    $(id).classList.add("hidden");
}


/* =========================
   START GAME
========================= */

document.addEventListener("DOMContentLoaded", function () {

    const startBtn = $("startBtn");

    if (startBtn) {
        startBtn.addEventListener("click", startGame);
    }


    const boardBtn = $("boardBtn");

    if (boardBtn) {
        boardBtn.addEventListener("click", beginJourney);
    }


    $("leftBtn").addEventListener("click", function () {
        moveCoach(-1);
    });


    $("rightBtn").addEventListener("click", function () {
        moveCoach(1);
    });


    $("interactBtn").addEventListener("click", interact);


    $("inventoryBtn").addEventListener(
        "click",
        openInventory
    );


    $("phoneBtn").addEventListener(
        "click",
        openPhone
    );


    $("settingsBtn").addEventListener(
        "click",
        function () {
            openPopup("settings");
        }
    );


    $("saveBtn").addEventListener(
        "click",
        saveGame
    );


    $("loadBtn").addEventListener(
        "click",
        loadGame
    );


    $("newGameBtn").addEventListener(
        "click",
        newGame
    );


    $("restartBtn").addEventListener(
        "click",
        function () {
            location.reload();
        }
    );


    document.querySelectorAll(".close").forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const popup =
                        button.getAttribute("data-close");

                    closePopup(popup);
                }
            );

        }
    );


    $("difficulty").addEventListener(
        "change",
        function () {

            game.difficulty =
                this.value;

        }
    );


    /* KEYBOARD */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "ArrowLeft" ||
                event.key.toLowerCase() === "a"
            ) {
                moveCoach(-1);
            }

            if (
                event.key === "ArrowRight" ||
                event.key.toLowerCase() === "d"
            ) {
                moveCoach(1);
            }

            if (event.key.toLowerCase() === "e") {
                interact();
            }

            if (event.key.toLowerCase() === "i") {
                openInventory();
            }

            if (event.key.toLowerCase() === "p") {
                openPhone();
            }

        }
    );

});


/* =========================
   START
========================= */

function startGame() {

    const name =
        $("nameInput").value.trim();


    if (name.length === 0) {

        $("startError").textContent =
            "⚠️ पहले अपना नाम लिखें।";

        $("nameInput").focus();

        return;
    }


    game.playerName = name;


    $("playerName").textContent =
        name;


    $("storyText").textContent =
        `रात के 11:47 बजे ${name} प्लेटफ़ॉर्म 6 पर अकेला खड़ा था। बारिश तेज़ थी। स्टेशन लगभग खाली था। अचानक एक पुरानी ट्रेन बिना किसी घोषणा के प्लेटफ़ॉर्म पर आकर रुकी। ट्रेन के दरवाज़े अपने आप खुल गए। अंदर से किसी ने धीरे से कहा — “चढ़ो…”`;


    hide("startScreen");

    show("storyScreen");


    $("startError").textContent = "";
}


/* =========================
   BOARD TRAIN
========================= */

function beginJourney() {

    hide("storyScreen");

    show("gameScreen");


    updateUI();


    setEvent(
        "पहली रात",
        "ट्रेन चल पड़ी…",
        `तुम ट्रेन में चढ़ चुके हो। ${game.playerName}, बाहर अब स्टेशन दिखाई नहीं दे रहा। खिड़की के बाहर सिर्फ अंधेरा और बारिश है।`
    );


    setMission(
        "Coach 3 तक पहुँचो।"
    );


    setTimeout(
        randomEvent,
        5000
    );
}


/* =========================
   UI
========================= */

function updateUI() {

    $("playerName").textContent =
        game.playerName || "यात्री";


    $("coachName").textContent =
        " • Coach " + game.coach;


    $("health").textContent =
        Math.max(0, game.health);


    $("fear").textContent =
        Math.min(100, game.fear);


    $("battery").textContent =
        Math.max(0, game.battery);


    $("doorText").textContent =
        "COACH " + game.coach;


    renderInventory();

    renderMessages();
}


function setEvent(tag, title, text) {

    $("eventTag").textContent = tag;

    $("eventTitle").textContent = title;

    $("eventText").textContent = text;

    $("choices").innerHTML = "";

    hideGhost();
}


function setMission(text) {

    $("missionText").textContent =
        text;
}


/* =========================
   COACH MOVEMENT
========================= */

function moveCoach(direction) {

    if (!$("gameScreen") ||
        $("gameScreen").classList.contains("hidden")) {
        return;
    }


    const newCoach =
        game.coach + direction;


    if (newCoach < 1) {

        setEvent(
            "दरवाज़ा",
            "आगे नहीं जा सकते",
            "तुम ट्रेन की शुरुआत पर हो। पीछे जाने का कोई रास्ता नहीं है।"
        );

        return;
    }


    if (newCoach > 8) {

        setEvent(
            "आख़िरी डिब्बा",
            "रास्ता खत्म हो गया",
            "इसके आगे कोई Coach नहीं है। लेकिन दूर से किसी के चलने की आवाज़ आ रही है…"
        );

        game.fear += 5;

        updateUI();

        return;
    }


    game.coach = newCoach;

    game.playedMinutes += 2;

    game.battery =
        Math.max(0, game.battery - 2);


    updateUI();


    if (game.coach === 3) {

        setMission(
            "Coach 5 में छुपा हुआ टिकट खोजो।"
        );

    }


    if (game.coach === 5) {

        setMission(
            "पुराना टिकट खोजने के लिए Interact दबाओ।"
        );

    }


    if (game.coach === 8) {

        setMission(
            "आख़िरी दरवाज़े तक पहुँचो।"
        );

    }


    setEvent(
        "Coach " + game.coach,
        "तुम आगे बढ़ गए…",
        getCoachDescription(game.coach)
    );


    if (Math.random() < .45) {

        setTimeout(
            randomEvent,
            1500
        );

    }
}


/* =========================
   COACH DESCRIPTIONS
========================= */

function getCoachDescription(coach) {

    const descriptions = {

        1:
            "कुछ यात्री चुपचाप बैठे हैं। एक बूढ़ा आदमी तुम्हें लगातार देख रहा है।",

        2:
            "यह डिब्बा लगभग खाली है। ऊपर वाली berth से किसी के साँस लेने की आवाज़ आ रही है।",

        3:
            "एक बच्चा खिड़की के पास बैठा है। वह बाहर नहीं, बल्कि काले शीशे में तुम्हारा प्रतिबिंब देख रहा है।",

        4:
            "लाइट बार-बार झपक रही है। हर बार अंधेरा होने पर सीटों की संख्या बदल जाती है।",

        5:
            "यहाँ हवा बहुत ठंडी है। एक सीट पर पुराना टिकट पड़ा हुआ दिखाई देता है।",

        6:
            "पूरा डिब्बा खाली है। लेकिन ऊपर की berth धीरे-धीरे हिल रही है।",

        7:
            "फोन में अचानक network की एक line दिखाई देती है… फिर गायब हो जाती है।",

        8:
            "आख़िरी डिब्बा। सामने एक दरवाज़ा है जिस पर लिखा है — 'वापस मत जाना।'"
    };


    return descriptions[coach] ||
        "डिब्बे में अजीब सन्नाटा है।";
}


/* =========================
   INTERACT
========================= */

function interact() {

    if ($("gameScreen").classList.contains("hidden")) {
        return;
    }


    game.events++;


    /* Coach 5 clue */

    if (game.coach === 5 &&
        !game.items.includes("🎫 पुराना टिकट")) {

        game.items.push(
            "🎫 पुराना टिकट"
        );

        game.clues++;


        setEvent(
            "रहस्य",
            "पुराना टिकट मिला",
            "टिकट पर आज की तारीख नहीं है। उस पर 1998 लिखा है। लेकिन ट्रेन के बाहर अभी 2026 चल रहा है।"
        );


        setMission(
            "अब Coach 7 में फोन चालू करो।"
        );


        updateUI();

        return;
    }


    /* Coach 7 */

    if (game.coach === 7) {

        game.battery =
            Math.max(0, game.battery - 5);

        game.fear += 10;


        showGhost();


        setEvent(
            "फोन",
            "अज्ञात संदेश",
            "फोन की स्क्रीन अपने आप जलती है। संदेश आता है: “तुम्हारा नाम मुझे पता है, " +
            game.playerName +
            "…”"
        );


        if (
            !game.messages.includes(
                "अज्ञात नंबर: तुम्हारा नाम मुझे पता है।"
            )
        ) {

            game.messages.push(
                "अज्ञात नंबर: तुम्हारा नाम मुझे पता है।"
            );

        }


        setMission(
            "Coach 8 के आख़िरी दरवाज़े तक जाओ।"
        );


        updateUI();

        return;
    }


    /* Coach 8 ending */

    if (game.coach === 8) {

        if (game.clues >= 1) {

            trueEnding();

        } else {

            lostEnding();

        }

        return;
    }


    /* Normal interaction */

    const actions = [

        "तुमने सीट के नीचे देखा… वहाँ कुछ नहीं था।",

        "खिड़की पर किसी ने अंदर से हाथ रखा था। तुमने हाथ हटाया तो निशान गायब हो गया।",

        "ऊपर की berth खाली थी। फिर भी चादर किसी के लेटे होने की तरह दब रही थी।",

        "दरवाज़े के पीछे से किसी बच्चे की हँसी सुनाई दी।",

        "तुम्हें लगा किसी ने तुम्हारा नाम पुकारा।",

        "ट्रेन अचानक धीमी हुई… फिर सामान्य गति से चलने लगी।"

    ];


    const text =
        actions[
            Math.floor(
                Math.random() * actions.length
            )
        ];


    game.fear += 4;


    if (Math.random() < .25) {
        game.health -= 5;
    }


    setEvent(
        "जाँच",
        "तुमने ध्यान से देखा…",
        text
    );


    updateUI();


    checkHealth();
}


/* =========================
   RANDOM HORROR
========================= */

function randomEvent() {

    if (
        $("gameScreen").classList.contains("hidden")
    ) {
        return;
    }


    const events = [

        {
            title: "किसी ने पीछे से पुकारा",
            text:
                `“${game.playerName}…” आवाज़ तुम्हारे ठीक पीछे से आई। लेकिन वहाँ कोई नहीं था।`
        },

        {
            title: "लाइट बंद हो गई",
            text:
                "पूरा Coach पाँच सेकंड के लिए अंधेरे में डूब गया। अंधेरे में किसी के चलने की आवाज़ आई।"
        },

        {
            title: "खिड़की",
            text:
                "बारिश के बीच खिड़की पर एक चेहरा दिखाई दिया। ट्रेन पूरी गति से चल रही है… फिर वह चेहरा गायब हो गया।"
        },

        {
            title: "घोषणा",
            text:
                "स्पीकर से आवाज़ आई — “अगला स्टेशन… अंतिम स्टेशन…” फिर speaker बंद हो गया।"
        },

        {
            title: "खाली सीट",
            text:
                "तुमने सामने वाली सीट देखी। वह खाली थी। एक पल बाद वहाँ कोई बैठा था।"
        }

    ];


    const event =
        events[
            Math.floor(
                Math.random() * events.length
            )
        ];


    game.fear +=
        game.difficulty === "nightmare"
            ? 15
            : 8;


    showGhost();


    setEvent(
        "⚠️ अजीब घटना",
        event.title,
        event.text
    );


    updateUI();


    setTimeout(
        hideGhost,
        3000
    );


    checkHealth();
}


/* =========================
   GHOST
========================= */

function showGhost() {

    $("ghost").classList.add("show");

    $("eyes").classList.add("show");
}


function hideGhost() {

    $("ghost").classList.remove("show");

    $("eyes").classList.remove("show");
}


/* =========================
   INVENTORY
========================= */

function openInventory() {

    $("inventory").classList.remove(
        "hidden"
    );

    renderInventory();
}


function renderInventory() {

    const container =
        $("inventoryItems");


    if (!container) return;


    container.innerHTML = "";


    game.items.forEach(
        function (item) {

            const div =
                document.createElement("div");


            div.className = "item";

            div.textContent = item;


            container.appendChild(div);

        }
    );

}


/* =========================
   PHONE
========================= */

function openPhone() {

    $("phone").classList.remove(
        "hidden"
    );

    renderMessages();
}


function renderMessages() {

    const container =
        $("messages");


    if (!container) return;


    container.innerHTML = "";


    game.messages.forEach(
        function (message) {

            const div =
                document.createElement("div");


            div.className = "message";

            div.textContent = message;


            container.appendChild(div);

        }
    );

}


/* =========================
   POPUPS
========================= */

function openPopup(id) {

    $(id).classList.remove(
        "hidden"
    );
}


function closePopup(id) {

    if ($(id)) {

        $(id).classList.add(
            "hidden"
        );

    }
}


/* =========================
   SAVE
========================= */

function saveGame() {

    localStorage.setItem(
        "antimSafarSave",
        JSON.stringify(game)
    );


    alert(
        "💾 Game Save हो गया!"
    );
}


/* =========================
   LOAD
========================= */

function loadGame() {

    const saved =
        localStorage.getItem(
            "antimSafarSave"
        );


    if (!saved) {

        alert(
            "कोई Save Game नहीं मिला।"
        );

        return;
    }


    try {

        game =
            JSON.parse(saved);


        updateUI();


        hide("startScreen");

        hide("storyScreen");

        show("gameScreen");


        setEvent(
            "Game Loaded",
            "सफ़र वापस शुरू हो गया",
            "तुम उसी Coach में वापस आ गए हो जहाँ तुमने game save किया था।"
        );


        closePopup("settings");


    } catch (error) {

        alert(
            "Save file खराब है।"
        );

    }
}


/* =========================
   NEW GAME
========================= */

function newGame() {

    const answer =
        confirm(
            "क्या तुम नई शुरुआत करना चाहते हो?"
        );


    if (!answer) return;


    localStorage.removeItem(
        "antimSafarSave"
    );


    location.reload();
}


/* =========================
   HEALTH
========================= */

function checkHealth() {

    if (game.health <= 0) {

        lostEnding();

        return;
    }


    if (game.fear >= 100) {

        fearEnding();

    }
}


/* =========================
   ENDINGS
========================= */

function trueEnding() {

    hide("gameScreen");

    show("endingScreen");


    $("endingTitle").textContent =
        "🌅 तुम बच गए";


    $("endingText").textContent =
        `${game.playerName}, तुमने पुराना टिकट खोज लिया और आख़िरी दरवाज़े का रहस्य समझ लिया। ट्रेन सुबह एक सुनसान स्टेशन पर रुकी। दरवाज़ा खुला… और तुम बाहर निकल गए। पीछे मुड़कर देखा तो ट्रेन गायब थी।`;


    $("endingStats").textContent =
        `Coach: ${game.coach} • Clues: ${game.clues} • Fear: ${game.fear}`;

}


function lostEnding() {

    hide("gameScreen");

    show("endingScreen");


    $("endingTitle").textContent =
        "👻 तुम खो गए";


    $("endingText").textContent =
        `${game.playerName}, ट्रेन रुक गई। जब दरवाज़े खुले तो बाहर कोई स्टेशन नहीं था। सिर्फ धुंध थी। तुमने एक कदम बाहर रखा… और फिर ट्रेन हमेशा के लिए गायब हो गई।`;


    $("endingStats").textContent =
        `Coach: ${game.coach} • Fear: ${game.fear}`;

}


function fearEnding() {

    hide("gameScreen");

    show("endingScreen");


    $("endingTitle").textContent =
        "😨 डर ने जीत लिया";


    $("endingText").textContent =
        "तुम्हारा डर इतना बढ़ गया कि तुम्हें ट्रेन में मौजूद चीज़ें वास्तविक और भ्रम के बीच अलग दिखाई देना बंद हो गईं।";


    $("endingStats").textContent =
        `Fear: ${game.fear} • Health: ${game.health}`;

}


/* =========================
   AUTO BATTERY
========================= */

setInterval(
    function () {

        if (
            $("gameScreen") &&
            !$("gameScreen").classList.contains("hidden")
        ) {

            if (game.battery > 0) {

                game.battery--;

                updateUI();

            }

        }

    },
    30000
);
