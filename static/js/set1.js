import Deck from "./Deck.js";
import TableStruct from "./TableStruct.js";
import SelectedStruct from "./SelectedStruct.js";
import MSG from "./MSG.js";
import CodeManager from "./CodeManager.js";

const documents = [
    {name: "base-vocabulary", buttonText: "Base voc", editable: false, description: '<b>Base vocabulary</b> - this vocabulary declares the basic symbols needed for modeling this task. You can not edit this theory!'},
    {name: "base-theory", buttonText: "1. Extending voc", editable: true, description: '<b>Warming up!</b> To be able to talk easier about cards and their properties, you should introduce one new type reifying the properties types (from the base voc) and one function mapping cards and properties to a value. It is <b>important</b> to get this part right as the rest of the project depends on it! You are provided with detailed hints in the comments of the code, make sure to follow them!'},
    {name: "selected-theory", buttonText: "2. Sets", editable: true, description: '<b>What is a set?</b> This theory formalizes the notion of a "set" in the Set game. The idea is that models of this theory are exactly card triples that are forming a set. This part is responsible for the behaviour of the <b>"Check selected"</b> button.'},
    {name: "table-theory", buttonText: "3. Card table", editable: true, description: '<b>Finding sets on the card table!</b> This theory formalizes the notion of a card table in the Set game. Furthermore, id specifies all sets that are on the table. Notice this theory should not be unsatisfiable if there are no sets on the table! This constraint is added in the "T_table_has_set" theory. This part is responsible for the behaviour of <b>"Are there sets"</b> and <b>"Show sets"</b> buttons.'}
];

//This theory formalizes the basic elements needed for the Set game. The goal of this task is to create a good ontology for the rest of the project. 

// ###############################
// UI/UTILS/HELPER FUNCTIONS START
// ###############################
// Get element by id
function elID(id) {
    return document.getElementById(id);
}

// Get inner height of an elemnt
function getInnerHeight(elm){
    var computed = getComputedStyle(elm),
        padding = parseInt(computed.paddingTop) + parseInt(computed.paddingBottom);

    return elm.clientHeight - padding;
}

// Function adjusting size of elements
function handleResize() {
    if(window.innerWidth < 769){
        elID("b1-mid").style.height = "350px";
        elID("b2-mid").style.height = elID("table").style.height = "350px";
        elID("b3-mid").style.height = "350px";
    }else{ 
        elID("container").style.height = getInnerHeight(document.body) - getInnerHeight(elID("menu-bar")) + "px";

        // Left pannel
        // 6 for borders
        let b1m = getInnerHeight(elID("b1")) - getInnerHeight(elID("b1-top")) - getInnerHeight(elID("b1-bot")) - 6;
        elID("b1-mid").style.height = b1m + "px";
        elID("theory-editor").style.height = b1m - getInnerHeight(elID("code-header")) + "px";
        
        // Mid pannel
        // 6 for borders 
        let b2m = getInnerHeight(elID("b2")) - getInnerHeight(elID("b2-top")) - getInnerHeight(elID("b2-bot")) - 6;
        elID("b2-mid").style.height = b2m + "px"; 
        // 10 for padding
        let th = b2m - 10 - getInnerHeight(elID("control-buttons"));
        elID("table").style.height = th + "px";
        document.querySelectorAll('.set-card').forEach(element => {
            // 30 is the spacing between the cards
            element.style.height = ((th - 30) / 3 ) + 'px';
        });

        // Right pannel
        elID("b3-mid").style.height = (getInnerHeight(elID("b3")) - getInnerHeight(elID("b3-top"))) + "px";
    }
}

// Function checking if selected cards are forming a set
function checkIfSetProcedural(selectedCards) {
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
// ###############################
// UI/UTILS/HELPER FUNCTIONS START
// ###############################


// ######################
// EVENTS FUNCTIONS START
// ######################
// Function handelling the card click
export function cardClic(element, event){
    element.classList.toggle('selected');

    if(element.classList.contains('selected')){
        element.src = `./static/deck/deck-anim/${element.getAttribute("val")}.svg`;
    }else{
        element.src = `./static/deck/deck-stat/${element.getAttribute("val")}.svg`;
    }

    selectedStruct.setTheSelectedStructure(deck.getSelectedCards());
}

// Function handelling the deal click
export function dealClic(){
    if(deck.getNumberOfCardsOnTable(true) == 0){
        // Deal the cards 3x at the start
        deck.dealCards(9, false);
    }else{
        deck.dealCards(3, false);
    }
}

// Make a server call to check if it is a set
export function checkIfSet() {
    let selectedCards = deck.getSelectedCards();
    let isSetProc = checkIfSetProcedural(selectedCards); 
    selectedStruct.initialize(selectedCards);
    
    const url = `http://localhost:8000/is_set?structure=${encodeURIComponent(selectedStruct.structure)}`;
    
    loadingOverlay.style.visibility = "visible";
    fetch(url)
        .then(response => response.json())
        .then(data => msg.generateAndPushMsgForCheckIfSet(data, isSetProc, selectedCards, deck))
        .catch(error => msg.setTheConsole(error, true))
        .finally(() => {
            deck.unselectAllCards();
            selectedStruct.setTheSelectedStructure(deck.getSelectedCards());
            loadingOverlay.style.visibility = "hidden";
        });
}

// Check if there are any sets on the table (IDP)
export function areThereSets(){
    tableStruct.initialize(deck.getCardsOnTable());
    const url = `http://localhost:8000/are_there_sets?structure=${encodeURIComponent(tableStruct.structure)}`;

    loadingOverlay.style.visibility = "visible";
    fetch(url).then(response => response.json())
        .then(data => msg.generateAndPushMsgForAreThereSets(data))
        .catch(error => msg.setTheConsole(error, true))
        .finally(() => loadingOverlay.style.visibility = "hidden");
}

// Find and show all the sets on the table
export function showSets(){
    tableStruct.initialize(deck.getCardsOnTable());
    const url = `http://localhost:8000/show_sets?structure=${encodeURIComponent(tableStruct.structure)}`;

    loadingOverlay.style.visibility = "visible";
    fetch(url).then(response => response.json())
        .then(data => msg.generateAndPushMsgForShowSets(data))
        .catch(error => msg.setTheConsole(error, true))
        .finally(() => loadingOverlay.style.visibility = "hidden");
}
// ####################
// EVENTS FUNCTIONS END
// ####################



// Variables
const loadingOverlay = elID("loading-overlay");
const msg = new MSG(elID('console'), elID('msg'));
const tableStruct = new TableStruct(elID('structure-table'), handleResize);
const selectedStruct = new SelectedStruct(elID('structure'), handleResize);
const deck = new Deck(elID("table"), tableStruct);
const cm = new CodeManager("theory-buttons", "theory-description", "theory-editor", "set1/", documents, loadingOverlay, msg, handleResize);


export function reset(){
    deck.initateTheDeck();
    deck.deleteCards(deck.getCardsOnTable(), false, false);
    tableStruct.setTheTableStructure([]);
    selectedStruct.setTheSelectedStructure([]);
    msg.generateAndPushMsg('#A084DC',[{color : '#645CBB', msg : "New game instantiated!"}]);
}

// Init the game
reset();

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
        window.location.href = `./download?zipname=${encodeURIComponent(userInput)}.zip`;
    } else {
        alert("Download canceled: No number entered.");
    }
}
