class EngineCom {
    constructor(loadingOverlay, messageHandler) {
        this.loadingOverlay = loadingOverlay;
        this.messageHandler = messageHandler;
    }

    async initiateGame(players, deck){
        const initStruct = `structure S : V_final {
            Time = {0..1}
            Player = { 1..` + players + ` }\n    ` + deck + `\n}`;

        let rdata = await this.callIDP('init', initStruct);

        return rdata;
    }

    async progressGame(structure){
        const stepStruct = structure.replace(": V_final_ss", "S : Vss").replaceAll("[ : Prop]", "[ : Prop]()");

        let rdata = await this.callIDP('oneStepProgress', stepStruct);
       
        return rdata;
    }

    async callIDP(inference, structure){
        const url = `http://localhost:8000/ltc_progress?structure=${encodeURIComponent(structure)}&inference=${inference}`;
        
        let status;
        let rdata;
        this.loadingOverlay.style.visibility = "visible";
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const explanation = response.status == 414 ? "This error is probably caused by too big structure! Please make sure you didn't introduce auxiliary predicates that are too big." : "";
                throw new Error(`HTTP ${response.status} - ${response.statusText}! ${explanation}`);
            }
        
            const data = await response.json();
            status = data.value;
            if (status.startsWith("success")) {
                rdata = this.#extractStructureBlock(data.msg);
            } else {
                rdata = data.msg;
            }
        
            this.messageHandler.setTheConsole("IDP request '" + inference + "' executed successfully!", false);
        } catch (error) {
            // This now includes HTTP errors AND network errors
            this.messageHandler.setTheConsole("Error executing an IDP request '" + inference + "': " + error, true);
        } finally {
            this.loadingOverlay.style.visibility = "hidden";
        }

        return {status: status, data: rdata};
    }

    #extractStructureBlock(input) {
        const startMarker = "structure  : V_final_ss {";
        const startIndex = input.indexOf(startMarker);
    
        if (startIndex === -1) {
            return null; // Not found
        }
    
        let openBraces = 0;
        let endIndex = startIndex;
    
        for (let i = startIndex + startMarker.length - 1; i < input.length; i++) {
            if (input[i] === "{") openBraces++;
            if (input[i] === "}") openBraces--;
    
            endIndex = i;
            
            if (openBraces === 0) {
                break;
            }
        }
    
        return input.substring(startIndex, endIndex + 1); // Extract full block
    }



}

export default EngineCom;