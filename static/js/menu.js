import CardMaps from "./CardMaps.js";

function rnd3(){
    return Math.floor(Math.random() * 3);
}

function randomImage(item){
    const elements = document.querySelectorAll('.menu-card');
    elements[item].src = "./static/deck/deck-stat/" + CardMaps.abbreviations[0][rnd3()] + CardMaps.abbreviations[1][rnd3()] + CardMaps.abbreviations[2][rnd3()] + CardMaps.abbreviations[3][rnd3()] + ".svg";
}

function spin(){
    const elements = document.querySelectorAll('.menu-card');

    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove('menu-spin');
    }

    let r = rnd3();

    elements[r].classList.add('menu-spin');

    setTimeout(()=>{
        randomImage(r);
    }, 200);

    setTimeout(()=>{
        elements[r].classList.remove('menu-spin');
    }, 500);
}

randomImage(0);
randomImage(1);
randomImage(2);

setInterval(() => {
    spin();
}, 2000);
