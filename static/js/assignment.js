import CardMaps from "./CardMaps.js";
import CodeManager from "./CodeManager.js";

const loadingOverlay = elID("loading-overlay");

const documents = [
    {name: "standard_inertia", buttonText: "Standard solution", editable: false, description: "The causalities and successor state axioms expressed in the standard way."},
    {name: "new_inertia", buttonText: "Generalized solution", editable: false, description: "In this example, causalities are defined with a delay and successor state axioms are having an immediate effect."},
];


function elID(id) {
    return document.getElementById(id);
}

// Get inner height of an elemnt
function getInnerHeight(elm){
    var computed = getComputedStyle(elm),
        padding = parseInt(computed.paddingTop) + parseInt(computed.paddingBottom);
  
    return elm.clientHeight - padding
}

// Function adjusting size of elements
function handleResize() {
    if(window.innerWidth < 769){
        // elID("b1-mid").style.height = "350px";
        // elID("table").style.height = "350px";
        // elID("b3-bot").style.height = "350px";
    }else{
        elID("container").style.height = getInnerHeight(document.body) - getInnerHeight(elID("menu-bar")) + "px";
        // elID("b1-mid").style.height = (getInnerHeight(elID("b1")) - getInnerHeight(elID("b1-top")) - getInnerHeight(elID("b1-bot"))) + "px";
        // elID("b2-mid").style.height = elID("table").style.height = (getInnerHeight(elID("b2")) - getInnerHeight(elID("b2-top")) - getInnerHeight(elID("b2-bot"))) + "px";
        // elID("b3-bot").style.height = (getInnerHeight(elID("b3")) - getInnerHeight(elID("b3-top")) - getInnerHeight(elID("b3-mid"))) + "px";
    }
}

function rnd3(){
    return Math.floor(Math.random() * 3);
}

function rndCard(){
    const n = CardMaps.abbreviations[0][rnd3()];
    const c = CardMaps.abbreviations[3][rnd3()];
    const d = CardMaps.abbreviations[2][rnd3()];
    const s = CardMaps.abbreviations[1][rnd3()];

    return [n, c, d, s]
}

function checkIsSetProcedural(selectedCards) {
    let sc = selectedCards;
    if(sc.length != 3){
        return false;
    }else{
        let isSet = true;
        for (let index = 0; index < 4; index++) {
            let same = sc[0][index] === sc[1][index] && sc[1][index] === sc[2][index];
            let diff = sc[0][index] !== sc[1][index] && sc[1][index] !== sc[2][index] && sc[0][index] !== sc[2][index];
            isSet = isSet && (same || diff);
        };

        return isSet;
    }
}

function randomCard(){
    const card = document.getElementById('card');
    const cardInfo = document.getElementById('card-info');

    let [n,c,d,s] = rndCard();

    card.src = "./static/deck/deck-stat/" + n + s + d + c + ".svg";
    cardInfo.innerHTML = CardMaps.mappings[0][n] + " " + CardMaps.mappings[1][s] + " " + CardMaps.mappings[2][d] + " " + CardMaps.mappings[3][c];
}

function randomNonSet(){
    const card1 = document.getElementById('card-1');
    const card2 = document.getElementById('card-2');
    const card3 = document.getElementById('card-3');

    let [n1,c1,d1,s1] = rndCard();
    let [n2,c2,d2,s2] = rndCard();
    let [n3,c3,d3,s3] = rndCard();

    while(checkIsSetProcedural([n1+c1+d1+s1, n2+c2+d2+s2, n3+c3+d3+s3]) || (n1 == n2 && c1 == c2 && d1 == d2 && s1 == s2) || (n1 == n3 && c1 == c3 && d1 == d3 && s1 == s3) || (n2 == n3 && c2 == c3 && d2 == d3 && s2 == s3 )){
        [n1,c1,d1,s1] = rndCard();
        [n2,c2,d2,s2] = rndCard();
        [n3,c3,d3,s3] = rndCard();
    }

    card1.src = "./static/deck/deck-stat/" + n1 + s1 + d1 + c1 + ".svg";
    card2.src = "./static/deck/deck-stat/" + n2 + s2 + d2 + c2 + ".svg";
    card3.src = "./static/deck/deck-stat/" + n3 + s3 + d3 + c3 + ".svg";
}

function randomSet(){
    let ns = Math.floor(Math.random() * 2);
    let cs = Math.floor(Math.random() * 2);
    let ds = Math.floor(Math.random() * 2);
    let ss = Math.floor(Math.random() * 2);

    let n1,n2,n3, c1,c2,c3, d1,d2,d3, s1,s2,s3 = "";

    if (ns + cs + ds + ss == 4){
        ns = 0;
    }

    if(ns == 1){
        n1 = n2 = n3 = CardMaps.abbreviations[0][rnd3()];
    }else{
        n1 = "1"; n2 = "2"; n3 = "3";
    }

    if(cs == 1){
        c1 = c2 = c3 = CardMaps.abbreviations[3][rnd3()];
    }else{
        c1 = "r"; c2 = "g"; c3 = "b";
    }

    if(ds == 1){
        d1 = d2 = d3 = CardMaps.abbreviations[2][rnd3()];
    }else{
        d1 = "e"; d2 = "s"; d3 = "f";
    }

    if(ss == 1){
        s1 = s2 = s3 = CardMaps.abbreviations[1][rnd3()];
    }else{
        s1 = "d"; s2 = "s"; s3 = "o";
    }

    const card1 = document.getElementById('cards-1');
    const card2 = document.getElementById('cards-2');
    const card3 = document.getElementById('cards-3');
    card1.src = "./static/deck/deck-stat/" + n1 + s1 + d1 + c1 + ".svg";
    card2.src = "./static/deck/deck-stat/" + n2 + s2 + d2 + c2 + ".svg";
    card3.src = "./static/deck/deck-stat/" + n3 + s3 + d3 + c3 + ".svg";
}

elID("randomCard").onclick = (event) => { randomCard(); };
elID("randomNonSet").onclick = (event) => { randomNonSet(); };
elID("randomSet").onclick = (event) => { randomSet(); };

const cm = new CodeManager("theory-buttons", "theory-description", "theory-editor", "explanation/", documents, loadingOverlay);

// Resize event listener
window.addEventListener('resize', handleResize);
handleResize();