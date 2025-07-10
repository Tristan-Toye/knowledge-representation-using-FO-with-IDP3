import CardMaps from "./CardMaps.js";

class GameState {
    constructor(deckElement, tableElement, playersElement, structureElement, messageHandler, resizeHandle) {
        this.deckElement = deckElement;
        this.tableElement = tableElement;
        this.playersElement = playersElement;
        this.structureElement = structureElement;
        
        this.messageHandler = messageHandler;
        this.resizeHandle = resizeHandle;
        
        this.lastAction = "";
        this.time = 0;

        this.msg_warning = {color : '#645CBB', msg : "Notice that the state remained the same as before the button was pressed. This allows inspection of the state before the call."};
    }

    getSelectedCards(){
        const elements = document.querySelectorAll('.selected');
        let selectedIDs = [];
    
        for (let i = 0; i < elements.length; i++) {
            selectedIDs.push(elements[i].getAttribute("val"));
        }
    
        return selectedIDs;
    }

    getSelectedCardsStructure(){
        let selectedCards = this.getSelectedCards();

        let selected = "";
        selectedCards.forEach((card) => {
            selected += this.atPlay +`,c("`+CardMaps.mappings[0][card[0]]+`","`+CardMaps.mappings[1][card[1]]+`","`+CardMaps.mappings[2][card[2]]+`","`+CardMaps.mappings[3][card[3]]+`"); `;
        });

        return selected;
    }
    
    setStructure(structure){
        this.structure = structure;

        // Clear the actions 
        this.setValue("noSet", "");
        this.setValue("deal", "");
        this.setValue("guesSet", "");
        this.setValue("selected", "");

        this.updateVariablesFromStructure();
    }

    updateVariablesFromStructure(){
        this.deckCards = this.#parseDeck();
        this.tableCards = this.#parseTable();
        [this.start, this.end] = this.#parsePlayers();
        this.scores = this.#parseScores();
        this.atPlay = this.#parseAtMove();
        this.inTheDeck = this.#parseInTheDeck();
        this.actions = this.#parsePossibleActions();
    }

    setValue(key, value){
        // Create a regex pattern to find the key followed by " = { ... }"
        const regex = new RegExp(`${key}\\s*=\\s*\\{[^\\}]*\\}`, 'g');

        // Replace the matched string with the new key-value pair
        this.structure = this.structure.replace(regex, `${key} = { ${value} }`);

        this.updateVariablesFromStructure();
        this.displayStructure();
    }

    

    guesSetA(player) { 
        this.setValue("guesSet", player);
        this.setValue("selected", this.getSelectedCardsStructure());

        this.setValue("noSet", "");
        this.setValue("deal", "");

        this.lastAction = "guesSetA";
    }
    
    noSetA(player) { 
        this.setValue("noSet", player);

        this.setValue("deal", "");
        this.setValue("guesSet", "");
        this.setValue("selected", "");

        this.lastAction = "noSetA";
    }

    dealA(player) { 
        this.setValue("deal", player);

        this.setValue("noSet", "");
        this.setValue("guesSet", "");
        this.setValue("selected", "");

        this.lastAction = "dealA";
    }


    // Function handelling the card click
    cardClic(element, event){
        element.classList.toggle('selected');

        if(element.classList.contains('selected')){
            element.src = `./static/deck/deck-anim/${element.getAttribute("val")}.svg`;
        }else{
            element.src = `./static/deck/deck-stat/${element.getAttribute("val")}.svg`;
        }

        this.setValue("selected", this.getSelectedCardsStructure());
    }

    createPlayerElement(i, color) {
        // Create main container
        const container = document.createElement("div");
        container.classList.add("msg-container");
        container.style.borderColor = color;
    
        // Create Player Info
        const playerInfo = document.createElement("b");
        playerInfo.innerHTML = `&nbsp;Player ${i} |`;
        
        // Create Actions Label
        const actionsLabel = document.createElement("b");
        actionsLabel.innerHTML = `&nbsp;Actions:`;
    
        // Create Buttons
        const actions = ["guesSetA", "noSetA", "dealA"];
        const buttons = actions.map(action => {
            const button = document.createElement("button");
            button.classList.add("btn-small");
            if (!this.actions[i].includes(action)) {
                button.classList.add("btn-disabled"); // Disable if action not available
            }else{
                button.onclick = (event) => { 
                    document.querySelectorAll('.active-action').forEach(element => {
                        element.classList.remove('active-action');
                    });

                    button.classList.add("active-action");

                    // Invoke the proper action
                    this[action](i); 
                };
            }
            button.textContent = action === "guesSetA" ? "Claim set" : action === "noSetA" ? "No set" : "Deal";
            return button;
        });
    
        // Create Score Label
        const scoreLabel = document.createElement("b");
        scoreLabel.innerHTML = `&nbsp;| Score: ` + this.scores[i - 1];
    
        // Append elements to the container
        container.appendChild(playerInfo);
        container.appendChild(actionsLabel);
        buttons.forEach(button => container.appendChild(button));
        container.appendChild(scoreLabel);
    
        return container;
    }

    visualize(){
        // Visualize the Deck
        this.deckElement.innerHTML = ""
        const totalCards = this.deckCards.length;
        this.deckCards.forEach((r, i) => {
            let id = r.map((val, index) => CardMaps.reversedMappings[index][val]).join('');
            
            let imgName = id[0]+id[1]+id[2]+id[3];
        
            const img = document.createElement("img");
            img.classList.add("deck-card");

            img.id = "img-card-"+i;
            if(i < this.inTheDeck-1){
                img.classList.add("bw-img");
            }
            img.src = "./static/deck/deck-stat/" + imgName + ".svg";
            img.setAttribute("val", imgName);
            img.style.zIndex = totalCards - i;
            this.deckElement.appendChild(img);
        });
        
        // Visualize Players UI
        this.playersElement.innerHTML = "";
        for (let i = this.start; i <= this.end; i++) {
            let color = i == this.atPlay ? "#79AC78" : "#A084DC";
        
            let playerElement = this.createPlayerElement(i, color);
            this.playersElement.appendChild(playerElement);
        }
        
        // Visualize Table
        this.tableElement.innerHTML = ""
        this.tableCards.forEach((r) => {
            let id = r.map((val, index) => CardMaps.reversedMappings[index][val]).join('');
            
            let imgName = id[0]+id[1]+id[2]+id[3];
        
            const img = document.createElement("img");
            img.classList.add("set-card");
            img.src = "./static/deck/deck-stat/" + imgName + ".svg";
            img.onclick = (event) => { this.cardClic(img, event); };
            img.setAttribute("val", imgName);
            this.tableElement.appendChild(img);
        });
    }

    displayStructure(){
        // const inputValue = document.getElementById("filter-structure").value;
        // const termsArray = inputValue.split(",").map(term => term.trim());
        // const filterPrefix = termsArray.map(term => `${term} = {`);

        const filterPrefix = ["Value = {", "initTable = {", "cardsProp = {", "deck = {"];

        let showStruct =  this.structure
            .split("\n")
            .filter(line => !filterPrefix.some(prefix => line.trim().startsWith(prefix)))
            .join("\n");

        this.structureElement.innerHTML = showStruct;
    }

    handleReset(status, data) {
        this.lastAction = "";
        this.time = 0;

        this.#loadAndDisplayNewStructure(status, data);
        if(status.startsWith("success")){
            let note = status == "success-more-models" ? " Note: <i>There is more than one model (the first will be used); this is normal if the project is not finished; however, at the end, there should be a unique model.</i>" : "";
            this.messageHandler.generateAndPushMsg('#A084DC',[{color : '#645CBB', msg : "New game instantiated!" + note}]);
        } else if(status == "unsatisfiable"){
            this.messageHandler.generateAndPushMsg('#E16A54',[{color : '#E16A54', msg : "Your theory is unsatisfiable! Check the console!"}, this.msg_warning]);
        } else if(status == "error"){
            this.messageHandler.generateAndPushMsg('#E16A54',[{color : '#E16A54', msg : "Something went wrong! Check the console!"}, this.msg_warning]);
        }
    }

    handleStep(status, data){
        if(status.startsWith("success")){
            let note = status == "success-more-models" ? " Note: <i>There is more than one model (the first will be used); this is normal if the project is not finished; however, at the end, there should be a unique model.</i>" : "";
            if(this.lastAction != ""){
                let images = "";
                if(this.lastAction == "guesSetA"){
                    images = this.messageHandler.generateImages(this.getSelectedCards());
                }

                this.messageHandler.generateAndPushMsg('#79AC78',[{color : '#79AC78', msg : "At time " + this.time + ": " + this.#getLastActionText() + note}], images);
                this.time = this.time + 1;
            } else {
                this.messageHandler.generateAndPushMsg('#E16A54',[{color : '#E16A54', msg : "No action was selected!" + note}]);
            }
        } else if(status == "unsatisfiable"){
            this.messageHandler.generateAndPushMsg('#E16A54',[{color : '#E16A54', msg : "Your theory is unsatisfiable! Check the console!"}, this.msg_warning]);
        } else if(status == "error"){
            this.messageHandler.generateAndPushMsg('#E16A54',[{color : '#E16A54', msg : "Something went wrong! Check the console!"}, this.msg_warning]);
        }

        this.#loadAndDisplayNewStructure(status, data);
        this.lastAction = "";
    }

    #getLastActionText(){
        if(this.lastAction == "guesSetA"){
            return "Player " + this.atPlay + " guessed a set:";
        }
        
        if(this.lastAction == "noSetA"){
            return "Player " + this.atPlay + " claimed there is no set!";
        }

        if(this.lastAction == "dealA"){
            return "Player " + this.atPlay + " dealt new cards!";
        }
        
        return "No action was selected!";
    }

    #loadAndDisplayNewStructure(status, data){
        if(status == "success" || status == "success-more-models"){
            this.setStructure(data);
            this.visualize();
            this.displayStructure();
            this.resizeHandle();
        }else if (status == "unsatisfiable") {
            this.messageHandler.setTheConsole("Your theory is unsatisfiable! This can happen if you didn't select any action. Also, it is possible that some symbols in the theory are not declared in the vocabulary. <b>However, it is also possible that your theory is simply too restrictive!</b>", true);
        }else if (status == "error") {
            this.messageHandler.setTheConsole("IDP error: " + data, true);
        }
    }

    #parseDeck(){
        const match = this.structure.match(/\bdeck\s*=\s*\{([^}]*)\}/);
    
        if (match) {
            const deckValues = match[1]
                .match(/\d+->c\(([^)]+)\)/g) // Match all 'c(...)' groups
                .map(group => group.match(/"([^"]+)"/g).map(v => v.replace(/"/g, ''))); // Extract values and remove quotes
    
            return deckValues;
        } else {
            return [];
        }
    }
    
    #parseTable(){
        const match = this.structure.match(/\btable\s*=\s*\{([^}]*)\}/);
    
        if (match && match[1]) {
            const groups = match[1].match(/c\(([^)]+)\)/g); // Match all 'c(...)' groups
            
            if(groups){
                // Extract values and remove quotes
                return groups.map(group => group.match(/"([^"]+)"/g).map(v => v.replace(/"/g, ''))); 
            } else {
                return [];
            }
        } else {
            return [];
        }
    }
    
    #parsePlayers(){
        const playerMatch = this.structure.match(/\bPlayer\s*=\s*\{\s*(\d+)\s*\.\.\s*(\d+)\s*\}/);
    
        if (playerMatch) {
            const start = parseInt(playerMatch[1], 10);
            const end = parseInt(playerMatch[2], 10);
    
            return [start, end]
        } else {
            return []
        }
    }

    #parsePossibleActions(){
        const match = this.structure.match(/\bpossibleActions\s*=\s*\{([^}]*)\}/);
        
        const matches = match[1].match(/(\w+)\((\d+)\)/g);

        const grouped = {};

        // Init sets
        for (let i = this.start; i <= this.end; i++) {
            grouped[i] = []; 
        }

        // Process each match
        if(matches){
            matches.forEach(match => {
                const [, name, number] = match.match(/(\w+)\((\d+)\)/); // Extract name & number

                grouped[number].push(name); // Add name to corresponding number
            });
        }
        return grouped;
    }
    
    #parseScores() {
        const match = this.structure.match(/\bscore\s*=\s*\{([^}]*)\}/);
         
        if (match) {
            const scoresValues = match[1]
                .match(/-?\d+->-?\d+/g) // Match all 'p->s' groups, allowing negatives
                .map(group => group.match(/-?\d+->(-?\d+)/)[1]); // Extract values and handle negatives
    
            return scoresValues;
        } else {
            return [];
        }
    }

    #parseAtMove(){
        const playerMatch = this.structure.match(/\batMove\s*=\s*(\d+)\s*/);
    
        if (playerMatch) {
            const atMove = parseInt(playerMatch[1], 10);
    
            return atMove
        } else {
            return -1
        }
    }

    #parseInTheDeck(){
        const playerMatch = this.structure.match(/\binTheDeck\s*=\s*(\d+)\s*/);
    
        if (playerMatch) {
            const atMove = parseInt(playerMatch[1], 10);
    
            return atMove
        } else {
            return -1
        }
    }
}

export default GameState;