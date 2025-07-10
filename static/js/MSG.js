import CardMaps from "./CardMaps.js";

class MSG{

    constructor(consoleElement, msgElement, consolDefaultMsg="There are no errors!") {
        this.consoleElement = consoleElement;
        this.msgElement = msgElement;
        this.consolDefaultMsg = consolDefaultMsg;
    }

    // Function generating card id from structure entry
    generateId(cString) {
        // Extract values inside c(...)
        let values = cString.match(/"([^"]+)"/g).map(v => v.replace(/"/g, ''));

        // Map values to corresponding ID characters
        let id = values.map((val, index) => CardMaps.reversedMappings[index][val]).join('');
        
        return id[0]+id[1]+id[2]+id[3];
    }

    // Generate a list of images for the selected cards
    generateImages(cards) {
        var images = '';
        
        for(let i = 0; i < cards.length; i++){
            images += `<img class="mini-card" src="./static/deck/deck-stat/${cards[i]}.svg">`;
        }

        return images;
    }

    // Generate a box message
    generateMsgBox(borderColor, msgs, images=""){
        //Base of the box with border color
        let box = "<div class='msg-container' style='border-color: " + borderColor + "'>";
        
        // Add messages one by one
        msgs.forEach((m) => {
            box += "<span style='color:" + m.color + "'>" + m.msg + "</span> ";
        });
        
        // Add images if any
        if(images != ""){
            box += "<br>" + images;
        }

        // Close the box
        box += "</div>";

        return box;
    }

    // Generate a message block for the checkng of a set
    generateAMsgForCheck(selectedCards, theoryAnswer, actualAnswer, msg){
        let images = this.generateImages(selectedCards);
        let answer = (!(actualAnswer ^ theoryAnswer));

        let borderColor = answer ? "#79AC78" : "#E16A54";
        let text1Col = theoryAnswer ? "#79AC78" : "#E16A54";
        let text2Col = actualAnswer ? "#79AC78" : "#E16A54";
        let actualMsg = "Correct answer: " + (actualAnswer ? "This is a set!" : "This is not a set!");

        return this.generateMsgBox(borderColor, [{color: text1Col, msg: msg},{color: text2Col, msg: actualMsg}], images);
    }

    // Sets the value of the console
    setTheConsole(msg = this.consolDefaultMsg, error = false){
        if(error){ console.error('Error:'+ msg); }

        this.consoleElement.innerHTML = msg;
        this.consoleElement.style.color = error ? "#E16A54" : "#79AC78";

        this.consoleElement.classList.add("console-attention");
        setTimeout(() => {
            this.consoleElement.classList.remove("console-attention");
        }, 500);
    }

    // Push the message to the right info panel
    pushMsg(msg){
        this.msgElement.innerHTML = msg + this.msgElement.innerHTML;
    }

    // Combined generate and push in one function
    generateAndPushMsg(borderColor, msgs, images=""){
        this.pushMsg(this.generateMsgBox(borderColor, msgs, images));
    }

    // Handl the Show Sets response
    generateAndPushMsgForShowSets(data){
        if(data.value == "success"){
            const tripleMatches = data.msg.match(/c\([^)]*\),c\([^)]*\),c\([^)]*\)/g);
            
            // Sets found on the table
            if(tripleMatches !== null){
                const splitComponents = tripleMatches.map(triple => triple.split(/,(?=c\()/));
                
                const result = splitComponents.map(triple => triple.map(x => this.generateId(x)));
                
                let imgs = ""
                result.forEach((r) => {
                    imgs += this.generateImages(r);
                    imgs += "&nbsp&nbsp";
                });

                this.setTheConsole();
                this.pushMsg(this.generateMsgBox('#A084DC',[{color : '#645CBB', msg : 'Sets on the table (found by your theory):'}], imgs));
            // There are no sets on the table!
            }else{
                
                this.setTheConsole();
                this.pushMsg(this.generateMsgBox('#A084DC',[{color : '#645CBB', msg : 'No sets foudn on the table!'}]));
            }
        }else if (data.value == "unsatisfiable") {
            this.setTheConsole();
            this.pushMsg(this.generateMsgBox('#E16A54',[{color : '#E16A54', msg : 'Your theory seams to be unsatisfiable, which shuld never be the case!'}]));
        }else if (data.value == "error" || data.value == "timeout") {
            this.setTheConsole(data.msg, true);
        }
    }

    // Handl the Are There Sets response
    generateAndPushMsgForAreThereSets(data){
        if(data.value == "error" || data.value == "timeout"){
            this.setTheConsole(data.msg, true);
        }else{
            this.setTheConsole();
            
            let setMsg = (data.value == "true" ? "There <b>is</b> a set at the table!" : "There is <b>no</b> set at the table!");
            this.pushMsg(this.generateMsgBox('#A084DC',[{color : '#645CBB', msg : setMsg}]));
        }
    }

    // Handl the Check If Set response
    generateAndPushMsgForCheckIfSet(data, isSetProc, selectedCards, deck){
        if(data.value == "error" || data.value == "timeout"){
            this.setTheConsole(data.msg, true);
        }else{
            let isSetDecl = (data.value === "true");
            this.setTheConsole();
            this.pushMsg(this.generateAMsgForCheck(selectedCards, isSetDecl, isSetProc, data.msg));
            
            if(isSetProc && (!(isSetProc ^ isSetDecl))){
                deck.deleteCards(selectedCards, true, true);
            }
        }
    }

    

}

export default MSG;