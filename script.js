document.addEventListener("DOMContentLoaded", function () {
    const startBtn = document.getElementById("startBtn");

    startBtn.addEventListener("click", function () {
        startGame();
    });
});
document.addEventListener("DOMContentLoaded", function () {

    const startBtn = document.getElementById("startBtn");

    startBtn.addEventListener("click", function () {

        const nameInput = document.getElementById("nameInput");
        const name = nameInput.value.trim();

        if (name === "") {
            alert("पहले अपना नाम लिखो!");
            nameInput.focus();
            return;
        }

        game.name = name;

        document.getElementById("storyText").innerText =
        `तुम, ${name}, रात की आख़िरी ट्रेन पकड़ते हो।

टिकट पर लिखा है कि ट्रेन तुम्हें एक ऐसे स्टेशन पर ले जाएगी जिसका नाम तुमने कभी नहीं सुना।

ट्रेन चलने से पहले एक बूढ़ा आदमी तुम्हें देखकर कहता है:

“अगर घंटी तीन बार बजे… पीछे मत देखना।”

कुछ ही सेकंड बाद ट्रेन चल पड़ती है।`;

        document.getElementById("startScreen").classList.add("hidden");
        document.getElementById("storyScreen").classList.remove("hidden");

    });

});
/* =====================================================
   अंतिम सफ़र
   Original Hindi Horror Train Game
===================================================== */


/* ---------- GAME STATE ---------- */

let game = {

    name:"",

    coach:1,

    health:100,

    fear:0,

    battery:100,

    events:0,

    choices:0,

    difficulty:"normal",

    flags:{},

    inventory:[

        {
            id:"ticket",
            name:"पुराना टिकट 🎫",
            desc:"इस पर तुम्हारा नाम लिखा है।"
        },

        {
            id:"phone",
            name:"फोन 📱",
            desc:"Network नहीं है।"
        },

        {
            id:"flashlight",
            name:"टॉर्च 🔦",
            desc:"अंधेरे में रास्ता दिखाती है।"
        }

    ],

    messages:[

        {
            who:"सिस्टम",
            text:"Network उपलब्ध नहीं है।"
        }

    ]

};


/* ---------- COACHES ---------- */

const coaches = {

1:{
    name:"Coach 1 — Sleeper",
    description:"कुछ यात्री सो रहे हैं। सब सामान्य लगता है।",
    mission:"Coach 3 तक पहुँचो।"
},

2:{
    name:"Coach 2 — Sleeper",
    description:"यह coach बाकी ट्रेन से बहुत शांत है।",
    mission:"दीवार पर लिखे संदेश को पढ़ो।"
},

3:{
    name:"Coach 3 — Sleeper",
    description:"सीट के नीचे कुछ दिखाई दे रहा है।",
    mission:"पुराना टिकट जाँचो।"
},

4:{
    name:"Coach 4 — खाली",
    description:"इस coach में एक भी passenger नहीं है।",
    mission:"आवाज़ का पीछा करो।"
},

5:{
    name:"Coach 5 — Pantry",
    description:"बंद pantry से बर्तनों की आवाज़ आ रही है।",
    mission:"Pantry का दरवाज़ा जाँचो।"
},

6:{
    name:"Coach 6 — अजनबी",
    description:"एक बूढ़ा आदमी तुम्हें लगातार देख रहा है।",
    mission:"उससे बात करो।"
},

7:{
    name:"Coach 7 — अँधेरा",
    description:"Emergency lights बार-बार बंद हो रही हैं।",
    mission:"टॉर्च जलाकर आगे बढ़ो।"
},

8:{
    name:"Coach 8 — ???",
    description:"यह coach train के नक्शे में है ही नहीं।",
    mission:"अंतिम निर्णय लो।"
}

};


/* ---------- HORROR EVENTS ---------- */

const events = [

{
title:"आईने में कोई",

text:
"खिड़की के शीशे में तुम्हारे पीछे एक आदमी दिखाई देता है। तुम मुड़ते हो… वहाँ कोई नहीं है।",

fear:12,

visual:"eyes"
},

{
title:"दरवाज़े पर दस्तक",

text:
"ठक… ठक… ठक… दरवाज़े के दूसरी तरफ से कोई तुम्हारा नाम पुकार रहा है।",

fear:10,

visual:"ghost"
},

{
title:"अजीब Announcement",

text:
`स्पीकर अचानक चालू होता है — “यात्री {name}, कृपया Coach 13 में आएँ।” लेकिन ट्रेन में Coach 13 है ही नहीं।`,

fear:15,

visual:"none"
},

{
title:"पुरानी तस्वीर",

text:
"सीट के नीचे एक तस्वीर मिली। उसमें यही ट्रेन है। पीछे खड़ा आदमी बिल्कुल तुम्हारे जैसा दिखता है।",

fear:14,

visual:"ghost"
},

{
title:"गीले पदचिह्न",

text:
"फर्श पर गीले पदचिह्न हैं। वे तुम्हारी तरफ आ रहे हैं… फिर अचानक गायब हो जाते हैं।",

fear:8,

visual:"none"
},

{
title:"घड़ी 2:17 पर रुक गई",

text:
"ट्रेन की घड़ी 2:17 पर रुक गई। कुछ सेकंड के लिए train की सारी आवाज़ें बंद हो गईं।",

fear:16,

visual:"none"
},

{
title:"Unknown Message",

text:
"तुम्हारा फोन vibrate करता है। Message आया है: “पीछे मत देखना, {name}।”",

fear:18,

visual:"none"
},

{
title:"खिड़की के बाहर",

text:
"एक काली परछाईं train के साथ दौड़ रही है। अचानक वह तुम्हारी खिड़की के सामने रुक जाती है।",

fear:20,

visual:"ghost"
},

{
title:"खाली सीट",

text:
"एक passenger अभी यहाँ बैठा था। अब सीट खाली है। सिर्फ एक गर्म चाय का कप बचा है।",

fear:9,

visual:"none"
},

{
title:"पुरानी Recording",

text:
"स्पीकर से बहुत पुरानी recording चलती है। उसमें accident से पहले की चीखें सुनाई देती हैं।",

fear:17,

visual:"eyes"
}

];


/* ---------- BASIC FUNCTIONS ---------- */

function id(x){
    return document.getElementById(x);
}


function clamp(value,min,max){
    return Math.max(min,Math.min(max,value));
}


function startGame(){

    let name =
        id("nameInput").value.trim();

    if(!name){

        id("nameInput").focus();

        return;
    }

    game.name=name;

    id("storyText").innerText=

    `तुम, ${name}, रात की आख़िरी ट्रेन पकड़ते हो।

टिकट पर लिखा है कि ट्रेन तुम्हें एक ऐसे स्टेशन पर ले जाएगी जिसका नाम तुमने कभी नहीं सुना।

ट्रेन चलने से पहले एक बूढ़ा आदमी तुम्हें देखकर कहता है:

“अगर घंटी तीन बार बजे… पीछे मत देखना।”

कुछ ही सेकंड बाद ट्रेन चल पड़ती है।`;

    id("startScreen").classList.add("hidden");

    id("storyScreen").classList.remove("hidden");
}


function beginJourney(){

    id("storyScreen").classList.add("hidden");

    id("gameScreen").classList.remove("hidden");

    updateUI();

    setEvent(

        "ट्रेन चल पड़ी…",

        "बाहर बारिश हो रही है। कुछ यात्री सो रहे हैं। लेकिन तुम्हें महसूस होता है कि कोई तुम्हें देख रहा है।",

        "रात का सफ़र"

    );

    setTimeout(randomEvent,5000);
}


/* ---------- UI ---------- */

function updateUI(){

    id("playerName").innerText=game.name;

    id("coachName").innerText=
        " • "+coaches[game.coach].name;

    id("health").innerText=
        Math.round(game.health);

    id("fear").innerText=
        Math.round(game.fear);

    id("battery").innerText=
        Math.round(game.battery);

    id("doorText").innerText=
        "COACH "+game.coach;

    id("missionText").innerText=
        coaches[game.coach].mission;

    renderInventory();
}


/* ---------- EVENT DISPLAY ---------- */

function setEvent(title,text,tag="घटना",choices=[]){

    id("eventTitle").innerText=title;

    id("eventText").innerText=
        text.replaceAll("{name}",game.name);

    id("eventTag").innerText=tag;

    id("choices").innerHTML="";

    choices.forEach(choice=>{

        let button=
            document.createElement("button");

        button.className="choice";

        button.innerText=choice.text;

        button.onclick=()=>{

            game.choices++;

            choice.action();

            updateUI();

        };

        id("choices").appendChild(button);

    });

}


/* ---------- VISUAL HORROR ---------- */

function visual(type){

    id("ghost").classList.remove("show");

    id("eyes").classList.remove("show");

    if(type==="ghost"){

        id("ghost").classList.add("show");

    }

    if(type==="eyes"){

        id("eyes").classList.add("show");

    }

    id("visual").classList.remove("shake");

    void id("visual").offsetWidth;

    if(type!=="none"){

        id("visual").classList.add("shake");

    }
}


/* ---------- RANDOM HORROR ---------- */

function randomEvent(){

    if(id("endingScreen").classList.contains("hidden")===false){

        return;

    }

    game.events++;

    let event=
        events[
            Math.floor(
                Math.random()*events.length
            )
        ];

    let multiplier=
        game.difficulty==="nightmare"
        ?1.4
        :1;

    game.fear=
        clamp(
            game.fear+(event.fear*multiplier),
            0,
            100
        );

    visual(event.visual);

    setEvent(

        event.title,

        event.text,

        "असामान्य घटना",

        [

            {
                text:"🔦 टॉर्च से देखो",

                action:()=>{

                    if(game.battery>0){

                        game.battery=
                            clamp(
                                game.battery-12,
                                0,
                                100
                            );

                        setEvent(

                            "कुछ नहीं…",

                            "टॉर्च की रोशनी घूमती है। वहाँ कुछ भी नहीं है। फिर पीछे से बहुत धीमी हँसी सुनाई देती है।",

                            "जाँच"

                        );

                    }else{

                        setEvent(

                            "बैटरी खत्म",

                            "टॉर्च नहीं जल रही। अंधेरे में कोई धीरे से तुम्हारा नाम बोलता है।",

                            "अँधेरा"

                        );

                    }

                }

            },

            {

                text:"🚪 आगे बढ़ो",

                action:()=>{

                    game.fear=
                        clamp(
                            game.fear-3,
                            0,
                            100
                        );

                    setEvent(

                        "तुम आगे बढ़ते हो…",

                        "तुमने पीछे नहीं देखा। शायद यही सही फैसला था।",

                        "सफ़र"

                    );

                }

            }

        ]

    );

    updateUI();

}


/* ---------- MOVE ---------- */

function moveCoach(direction){

    game.coach=
        clamp(
            game.coach+direction,
            1,
            8
        );

    game.fear=
        clamp(
            game.fear+2,
            0,
            100
        );

    updateUI();


    /* COACH 3 */

    if(
        game.coach===3 &&
        !game.flags.ticket
    ){

        game.flags.ticket=true;

        setEvent(

            "Coach 3",

            `सीट के नीचे एक पुराना टिकट है।

उस पर नाम लिखा है:

“${game.name}”

लेकिन सबसे नीचे लिखा है:

“समय: 2:17 AM”`,

            "मुख्य सुराग",

            [

                {

                    text:"🎫 टिकट उठाओ",

                    action:()=>{

                        game.inventory.push({

                            id:"oldPhoto",

                            name:"पुरानी तस्वीर 📷",

                            desc:"पीछे लिखा है: Coach 8 तक मत जाना।"

                        });

                        setEvent(

                            "टिकट के पीछे…",

                            "पीछे लिखा है: “जिसने यह पढ़ लिया, वह पहले ही इस ट्रेन का हिस्सा बन चुका है।”",

                            "रहस्य"

                        );

                    }

                },

                {

                    text:"इसे छोड़ दो",

                    action:()=>{

                        game.fear=
                            clamp(
                                game.fear+10,
                                0,
                                100
                            );

                        setEvent(

                            "पीछे से आवाज़",

                            "तुम जाने लगते हो। कोई फुसफुसाता है — “उठा लो…”",

                            "चेतावनी"

                        );

                    }

                }

            ]

        );

        return;
    }


    /* COACH 2 */

    if(game.coach===2){

        setEvent(

            "दीवार पर लिखा है",

            `${game.name}, अगर तुम यह पढ़ रहे हो तो समय बहुत कम है।

नीचे तीन छोटे निशान बने हैं।

घंटी।

दरवाज़ा।

और एक आँख।`,

            "गुप्त संदेश"

        );

        return;
    }


    /* COACH 5 */

    if(
        game.coach===5 &&
        !game.flags.pantry
    ){

        game.flags.pantry=true;

        game.inventory.push({

            id:"blackKey",

            name:"काली चाबी 🔑",

            desc:"इस पर 13 नंबर खुदा है।"

        });

        setEvent(

            "Pantry के अंदर",

            "बर्तनों की आवाज़ अचानक बंद हो गई। फर्श पर एक काली चाबी पड़ी है।",

            "आइटम मिला"

        );

        return;
    }


    /* COACH 6 */

    if(
        game.coach===6 &&
        !game.flags.oldMan
    ){

        game.flags.oldMan=true;

        setEvent(

            "बूढ़ा यात्री",

            "वह आदमी तुम्हें देखकर मुस्कुराता है।

“तुम हर बार देर से आते हो, बेटा।”",

            "अजनबी",

            [

                {

                    text:"“आप मुझे जानते हैं?”",

                    action:()=>{

                        game.flags.accident=true;

                        setEvent(

                            "उसका जवाब",

                            "“मैं तुम्हें नहीं… तुम्हारे पहले सफ़र को जानता हूँ।”",

                            "रहस्य"

                        );

                    }

                },

                {

                    text:"चुपचाप आगे बढ़ो",

                    action:()=>{

                        game.fear+=12;

                        setEvent(

                            "खाली सीट",

                            "तुम पीछे मुड़ते हो। बूढ़ा आदमी गायब है।",

                            "डर"

                        );

                    }

                }

            ]

        );

        return;
    }


    /* COACH 7 */

    if(game.coach===7){

        game.fear=
            clamp(
                game.fear+15,
                0,
                100
            );

        setEvent(

            "अँधेरा",

            "Emergency lights बंद हो गईं। सिर्फ तुम्हारी टॉर्च जल रही है। दूर किसी के कदमों की आवाज़ आ रही है।",

            "खतरा"

        );

        return;
    }


    /* COACH 8 */

    if(game.coach===8){

        setEvent(

            "Coach 8",

            "यह coach बाकी ट्रेन जैसा नहीं है।

खिड़की के बाहर एक स्टेशन दिखाई दे रहा है।

लेकिन ट्रेन अभी भी चल रही है।",

            "अंतिम निर्णय",

            [

                {

                    text:"🔔 घंटी तीन बार बजाओ",

                    action:()=>ending("true")

                },

                {

                    text:"🚪 दरवाज़ा खोलो",

                    action:()=>ending("lost")

                },

                {

                    text:"📱 Emergency Call करो",

                    action:()=>ending("escape")

                }

            ]

        );

        return;
    }


    setEvent(

        coaches[game.coach].name,

        coaches[game.coach].description,

        "सफ़र"

    );

    if(Math.random()<.7){

        setTimeout(randomEvent,3500);

    }

}


/* ---------- INTERACT ---------- */

function interact(){

    if(game.battery>0){

        game.battery=
            clamp(
                game.battery-4,
                0,
                100
            );
    }


    if(game.coach===4){

        setEvent(

            "आवाज़",

            "तुमने दरवाज़े के पास जाकर सुना।

कोई अंदर से कह रहा है:

“क्या तुम मुझे बाहर निकालोगे?”",

            "रहस्य",

            [

                {

                    text:"दरवाज़ा खोलो",

                    action:()=>{

                        game.fear+=20;

                        setEvent(

                            "खाली कमरा",

                            "दरवाज़ा खुलता है। अंदर कोई नहीं है। लेकिन तुम्हारे पीछे किसी के कदमों की आवाज़ आती है।",

                            "डर"

                        );

                    }

                },

                {

                    text:"दरवाज़ा मत खोलो",

                    action:()=>{

                        game.fear-=5;

                        setEvent(

                            "सन्नाटा",

                            "आवाज़ बंद हो गई। शायद तुमने सही किया।",

                            "सुरक्षित"

                        );

                    }

                }

            ]

        );

    }

    else{

        randomEvent();

    }

    updateUI();

}


/* ---------- INVENTORY ---------- */

function renderInventory(){

    let box=
        id("inventoryItems");

    box.innerHTML="";

    game.inventory.forEach(item=>{

        let div=
            document.createElement("div");

        div.className="item";

        div.innerHTML=
            `<b>${item.name}</b>
             <span>${item.desc}</span>`;

        box.appendChild(div);

    });

}


/* ---------- PHONE ---------- */

function addMessage(text,who="Unknown"){

    game.messages.push({

        who:who,

        text:text.replaceAll(
            "{name}",
            game.name
        )

    });

    renderMessages();

}


function renderMessages(){

    let box=id("messages");

    box.innerHTML="";

    game.messages
        .slice(-10)
        .forEach(message=>{

            let div=
                document.createElement("div");

            div.className=
                "msg "+
                (message.who==="तुम"
                ?"you"
                :"");

            div.innerHTML=
                `<b>${message.who}</b><br>
                ${message.text}`;

            box.appendChild(div);

        });

}


/* ---------- ENDINGS ---------- */

function ending(type){

    let titles={

        true:"सच्चा सफ़र",

        lost:"ट्रेन ने तुम्हें रख लिया",

        escape:"आख़िरी कॉल"

    };


    let texts={

        true:

        `घंटी तीन बार बजती है।

पूरी ट्रेन शांत हो जाती है।

बूढ़े आदमी की आवाज़ आती है:

“अब तुम जा सकते हो।”

सुबह एक खाली ट्रेन स्टेशन पर मिलती है।

तुम्हारा टिकट प्लेटफ़ॉर्म पर पड़ा है।

लेकिन passenger list से तुम्हारा नाम गायब है।`,



        lost:

        `दरवाज़ा खुलता है।

बाहर स्टेशन नहीं है।

वहाँ वही ट्रेन खड़ी है।

तुम अंदर कदम रखते हो।

दरवाज़ा बंद हो जाता है।

Announcement आती है:

“नए यात्री ${game.name} का स्वागत है।”`,



        escape:

        `फोन में अचानक Network आ जाता है।

तुम Emergency Call करते हो।

दूसरी तरफ तुम्हारी ही आवाज़ आती है:

“फोन मत उठाना।”

Call कट जाती है।

सुबह ट्रेन रुकती है।

तुम अकेले प्लेटफ़ॉर्म पर खड़े हो।`

    };


    id("gameScreen").classList.add("hidden");

    id("endingScreen").classList.remove("hidden");

    id("endingTitle").innerText=
        titles[type];

    id("endingText").innerText=
        texts[type];

    id("endingStats").innerText=

        `यात्री: ${game.name}
        • घटनाएँ: ${game.events}
        • डर: ${Math.round(game.fear)}/100
        • अंतिम Coach: ${game.coach}`;

}


/* ---------- POPUPS ---------- */

function openPopup(name){

    id(name).classList.remove("hidden");

}

function closePopup(name){

    id(name).classList.add("hidden");

}

function openInventory(){

    renderInventory();

    openPopup("inventory");

}

function openPhone(){

    addMessage(

        "अगर तुम यह message पढ़ रहे हो… पीछे मत देखना।",

        "Unknown"

    );

    openPopup("phone");

}


/* ---------- SAVE ---------- */

function saveGame(){

    game.difficulty=
        id("difficulty").value;

    localStorage.setItem(

        "antimSafarSave",

        JSON.stringify(game)

    );

    setEvent(

        "गेम सेव हो गया",

        "तुम्हारी यात्रा इसी browser में save हो गई है।",

        "सिस्टम"

    );

}


function loadGame(){

    let saved=
        localStorage.getItem(
            "antimSafarSave"
        );

    if(!saved){

        setEvent(

            "Save नहीं मिला",

            "अभी कोई saved game उपलब्ध नहीं है।",

            "सिस्टम"

        );

        return;

    }


    game=
        JSON.parse(saved);

    updateUI();

    id("gameScreen").classList.remove("hidden");

    setEvent(

        "गेम Load हो गया",

        `स्वागत है, ${game.name}। सफ़र फिर शुरू हो गया।`,

        "सिस्टम"

    );

}


function newGame(){

    localStorage.removeItem(
        "antimSafarSave"
    );

    location.reload();

}


/* ---------- SETTINGS ---------- */

id("difficulty").onchange=

function(){

    game.difficulty=
        this.value;

};


/* ---------- KEYBOARD ---------- */

document.addEventListener(

"keydown",

function(event){

    if(
        document.activeElement.tagName==="INPUT"
    ){

        return;

    }


    let key=
        event.key.toLowerCase();


    if(
        key==="a" ||
        event.key==="ArrowLeft"
    ){

        moveCoach(-1);

    }


    if(
        key==="d" ||
        event.key==="ArrowRight"
    ){

        moveCoach(1);

    }


    if(key==="e"){

        interact();

    }


    if(key==="i"){

        openInventory();

    }


    if(key==="p"){

        openPhone();

    }

});


/* ---------- RANDOM PHONE MESSAGES ---------- */

setInterval(

function(){

    if(
        id("gameScreen").classList.contains(
            "hidden"
        )
    ){

        return;

    }


    if(Math.random()<.08){

        let messages=[

            "मैं Coach 4 में हूँ। तुम कहाँ हो?",

            "तुम्हारा टिकट मेरे पास क्यों है?",

            "घंटी सुनते ही नीचे झुक जाना।",

            "{name}, क्या तुम अभी भी ट्रेन में हो?",

            "Coach 8 मत जाना।",

            "वह आदमी passenger नहीं है।"

        ];


        addMessage(

            messages[
                Math.floor(
                  
