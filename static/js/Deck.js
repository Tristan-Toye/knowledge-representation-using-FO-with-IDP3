import CardMaps from "./CardMaps.js";

class Deck {
    constructor(tableElement, tableStruct, shuffled = true) {
        this.tableElement = tableElement;
        this.tableStruct = tableStruct;
        this.shuffled = shuffled;

        this.initateTheDeck();
    }

    setSfuffled(shuffled) {
        this.shuffled = shuffled;
    }

    initateTheDeck() {
        this.deck = this.generateDeck();
        if(this.shuffled){
            this.shuffleDeck(this.deck);
        }
    }

    generateDeck() {
        let result = [''];
        
        for (let i = 0; i < CardMaps.abbreviations.length; i++) {
            let temp = [];
            for (let res of result) {
                for (let item of CardMaps.abbreviations[i]) {
                    temp.push(res + item);
                }
            }
            result = temp;
        }

        return result;
    }
    
    // Function shuffling the deck
    shuffleDeck(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];  // Swap elements
        }
    }
    
    // Deal three cards
    dealCards(number, checkLimit) {
        if(!(checkLimit && this.getNumberOfCardsOnTable(false) >= 9)) {
            // If empty reset the deck
            if (this.deck.length == 0) {
                this.initateTheDeck();
            }
            
            for(let i = 0; i < number; i++){
                setTimeout(() => {
                    let nextCard = this.deck.pop();
                    const img = document.createElement("img");
                    img.classList.add("set-card", "enter");
                    img.src = "./static/deck/deck-stat/" + nextCard + ".svg";
                    img.setAttribute("val", nextCard);
                    img.onclick = function(event) {cardClic(this, event);};
                    this.tableElement.appendChild(img);
                    setTimeout(() => {
                        img.classList.remove("enter");
                    }, 300);
                    this.tableStruct.setTheTableStructure(this.getCardsOnTable());
                }, i * 300);
            }
        }else{
            this.tableStruct.setTheTableStructure(this.getCardsOnTable());
        }
    }
    
    // Get the number of selected cards
    getNumberOfCardsOnTable(countSelected){
        if(countSelected){
            return (document.querySelectorAll('.set-card')).length;
        }else{
            return (document.querySelectorAll('.set-card:not(.selected)')).length;
        }
    }
    
    // Function getting all cards on the table (their ids)
    getCardsOnTable(){
        const elements = document.querySelectorAll('.set-card');
        let selectedIDs = [];
    
        for (let i = 0; i < elements.length; i++) {
            selectedIDs.push(elements[i].getAttribute("val"));
        }
    
        return selectedIDs;
    }
    
    // Function extracting all selected cards (their ids)
    getSelectedCards(){
        const elements = document.querySelectorAll('.selected');
        let selectedIDs = [];
    
        for (let i = 0; i < elements.length; i++) {
            selectedIDs.push(elements[i].getAttribute("val"));
        }
    
        return selectedIDs;
    }
    
    // Clear the selected cards
    unselectAllCards(){
        const elements = document.querySelectorAll('.selected');
    
        for (let i = 0; i < elements.length; i++) {
            elements[i].src = `./static/deck/deck-stat/${elements[i].getAttribute("val")}.svg`;
            elements[i].classList.remove('selected');
        }
    }

    // Delete all selected cards
    deleteCards(selectedCards, redeal, animated) {
        selectedCards.forEach((val, i) => {
            if(animated){
                setTimeout(() => {
                    let card = document.querySelector(`.set-card[val="${val}"]`);
                    card.classList.add("exit");
                    setTimeout(() => card.remove(), (3-i) * 300);
                }, i * 300);
            } else {
                let card = document.querySelector(`.set-card[val="${val}"]`);
                card.remove();
            }
        });

        if(redeal){
            setTimeout(() => {this.dealCards(3, true);}, 1200);
        }
    }

    getOrderDeckStructure(){
        let deckStruct = "deck = {";
        this.deck.forEach((card, index) => {
            deckStruct += (index+1) + `->c("`+CardMaps.mappings[0][card[0]]+`","`+CardMaps.mappings[1][card[1]]+`","`+CardMaps.mappings[2][card[2]]+`","`+CardMaps.mappings[3][card[3]]+`"); `;
        });
        deckStruct += "}";

        return deckStruct;
    }
}

export default Deck;