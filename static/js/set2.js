import GameState from "./GameState.js";
import Deck from "./Deck.js";
import EngineCom from "./EngineCom.js";
import MSG from "./MSG.js";
import CodeManager from "./CodeManager.js";

function elID(id) {
    return document.getElementById(id);
}

const loadingOverlay = elID("loading-overlay");

const documents = [
    {name: "voc-fixed", buttonText: "Voc fixed", editable: false, description: "Here you will find three vocabularies with the fixed content. The base vocabulary declares main concepts that are not temporal. The time vocabulary declares essential concepts for modeling of dynamic systems. The fixed vocabulary declares temporal concepts (actions and fluents) specific for the set game that are required for visualization."},
    {name: "theory-fixed", buttonText: "Thy fixed", editable: false, description: "This theory provides the definition of the card properties function (from the first part of the project) and the constraints the deck function to be injective."},
    {name: "voc-student", buttonText: "1. Voc", editable: true, description: "In the following vocabulary you can introduce new static or temporal symbols (predicates and functions) that will felp you in correctly modeling the set game. You can find some hints along the comments."},
    {name: "theory-player", buttonText: "2. Player", editable: true, description: "In this theory, you should formalize the mechanism of changing player turns as actions are taking place. Initially, player 1 is at the move, and with each action, the player at move changes to the next player (if there are 3 players in total, player 1 is next of player 3) except for the deal action when player remains the same. There are some hints in the comments."},
    {name: "theory-table", buttonText: "3. Table", editable: true, description: "In this theory, you should formalize the mechanism of changing cards on the table. Initially, there are 9 cards, if a player correctly guesses a set, the corresponding 3 cards are removed, and if someone deals, the next 3 cards from the deck are added to the table."},
    {name: "theory-score", buttonText: "4. Score", editable: true, description: "In this theory, you should formalize the mechanism of changing the score of players. At the beginning, everyone has a score of 0. Guessing correct set adds 3 points plus 1 point for each player in a chain immediately before them that claimed there is no set at the table (this resets if cards are added to the table). If a player guessed wrongly, their score gets reduced by 1 point."},
    {name: "theory-actions", buttonText: "5. Actions", editable: true, description: "In this theory, you should specify the set of possible actions per time point. This will serve to restrict the options in the UI."},
    {name: "theory-constraints", buttonText: "6. Constraints", editable: true, description: "In this theory, you can add additional constraints. These constraints are perhaps not necessary, but adding them will increase chances for achieving the correct solution. See the comments for some hints."}
];

// Get inner height of an elemnt
function getInnerHeight(elm){
    var computed = getComputedStyle(elm),
        padding = parseInt(computed.paddingTop) + parseInt(computed.paddingBottom);
  
    return elm.clientHeight - padding
}
  
// Function adjusting size of elements
function handleResize() {
    if(window.innerWidth < 769){
        elID("b1-mid").style.height = "350px";
        elID("table").style.height = "350px";
        elID("b3-bot").style.height = "350px";
    }else{
        elID("container").style.height = getInnerHeight(document.body) - getInnerHeight(elID("menu-bar")) + "px";

        // Left pannel
        // 6 for border
        let b1m = getInnerHeight(elID("b1")) - getInnerHeight(elID("b1-top")) - getInnerHeight(elID("b1-bot")) - 6;
        elID("b1-mid").style.height = b1m + "px";
        elID("theory-editor").style.height = b1m - getInnerHeight(elID("code-header")) + "px";

        // Mid pannel
        // 6 for border
        // 3 for margine
        let b2H = getInnerHeight(elID("b2")) - getInnerHeight(elID("b2-top")) - 6 - 3;
        // 10 for padding
        let b2HInner = b2H - getInnerHeight(elID("b2-mid-header")) - getInnerHeight(elID("b2-mid-paragraph")) - 10 ;
        elID("b2-mid").style.height =  b2H + "px";
        elID("table").style.height = b2HInner + "px";
        document.querySelectorAll('.set-card').forEach(element => {
            element.style.height = ((b2HInner - 30) / 3 ) + 'px';
        });

        // Right pannel
        let b3H = (getInnerHeight(elID("b3")) - getInnerHeight(elID("b3-top")) - getInnerHeight(elID("b3-mid")));
        elID("b3-bot").style.height = b3H + "px";
        elID("msg").style.height = (b3H - getInnerHeight(elID("b3-bot-header")) - getInnerHeight(elID("b3-bot-paragraph"))) + "px";
    }
}


// Create a deck, engine, and game state objects
const ms = new MSG(elID('console'), elID('msg'));
const dc = new Deck();
const ec = new EngineCom(loadingOverlay, ms);
const gs = new GameState(elID("deck"), elID("table"), elID("players"), elID("structure"), ms, handleResize);
const cm = new CodeManager("theory-buttons", "theory-description", "theory-editor", "set2/", documents, loadingOverlay, ms, handleResize);

function hideElements(){
    elID("msg-1").style.display = "grid";
    elID("msg-2").style.display = "grid";

    document.querySelectorAll(".init-hide").forEach(el => {
        el.style.visibility = "hidden";
    });
}

function showElements(){
    elID("msg-1").style.display = "none";
    elID("msg-2").style.display = "none";

    document.querySelectorAll(".init-hide").forEach(el => {
        el.style.visibility = "visible";
    });
}

// Proggress function call
async function makeStep(){
    let { status, data } = await ec.progressGame(gs.structure);
    
    gs.handleStep(status, data);
}

async function reset(){
    // Get parameters
    const n = Number(elID("nplayer").value);
    const s = elID("shuffle").checked;

    // Reset the deck
    dc.setSfuffled(s);
    dc.initateTheDeck();

    // Get initial structure for such a deck
    hideElements();
    let { status, data } = await ec.initiateGame(n, dc.getOrderDeckStructure());
    showElements();

    // Set the initial Game State and visualize it
    gs.handleReset(status, data);
}

// Binding progress and reset function to the button
elID("makestep").onclick = (event) => { makeStep(); };
elID("reset").onclick = (event) => { reset(); };

hideElements();

// Resize event listener
window.addEventListener('resize', handleResize);
handleResize();

// Bind the download link
elID("download").onclick = async (event) => {
    event.preventDefault(); // Prevent the default link action

    let userInput = prompt("You can use the downloaded file for submission. Make sure to enter your correct r/s/u number (with the starting letter):");
    if (userInput) {
        // Ensure the filename is safe (remove special characters)
        userInput = userInput.replace(/[^a-zA-Z0-9_\-]/g, "_");

        // Redirect to the download link with the new name
        window.location.href = `./download?part=two&zipname=${encodeURIComponent(userInput)}.zip`;
    } else {
        alert("Download canceled: No number entered.");
    }
}