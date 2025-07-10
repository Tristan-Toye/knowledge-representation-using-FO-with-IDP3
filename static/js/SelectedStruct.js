import CardMaps from "./CardMaps.js";

class SelectedStruct {

    constructor(structureElement, resizeHandle, selectedCards = []) {
        this.structureElement = structureElement;
        this.resizeHandle = resizeHandle;

        this.initialize(selectedCards);
    }

    initialize(selectedCards){
        this.structure = this.#generateSelectedStructure(selectedCards);
    }

    // Generates an IDP structure out of the selected cards
    #generateSelectedStructure(selectedCards) {
        let structure = `structure S_selected : V_selected_extra {\n`;
        structure += `  selected = { `;

        selectedCards.forEach((card) => {
            structure += `c("`+CardMaps.mappings[0][card[0]]+`","`+CardMaps.mappings[1][card[1]]+`","`+CardMaps.mappings[2][card[2]]+`","`+CardMaps.mappings[3][card[3]]+`"); `;
        });

        structure += `}\n`;
        structure += `}`;

        return structure;
    }

    // Function seting the value of the structure
    setTheSelectedStructure(selectedCards){
        this.initialize(selectedCards);
        this.structureElement.innerHTML = this.structure;
        this.resizeHandle();
    }
}

export default SelectedStruct;