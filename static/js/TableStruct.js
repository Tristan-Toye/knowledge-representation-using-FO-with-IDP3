import CardMaps from "./CardMaps.js";

class TableStruct {

    constructor(structureElement, resizeHandle, tableCards = []) {
        this.structureElement = structureElement;
        this.resizeHandle = resizeHandle;

        this.initialize(tableCards);
    }

    initialize(tableCards){
        this.structure = this.#generateTableStructure(tableCards);
    }


    // Generates an IDP structure out of the table
    #generateTableStructure(tableCards) {
        let structure = `structure S_table : V_table_extra {\n`;
        structure += `  table = {\n`;

        tableCards.forEach((card, index) => {
            if((index + 3) % 3 == 0 ){ structure += `   `; }
            structure += ` c("`+CardMaps.mappings[0][card[0]]+`","`+CardMaps.mappings[1][card[1]]+`","`+CardMaps.mappings[2][card[2]]+`","`+CardMaps.mappings[3][card[3]]+`");`;
            if((index + 1) % 3 == 0 ){ structure += `\n`; }
        });

        structure += `  }\n`;
        structure += `}`;

        return structure;
    }

    // Function seting the value of the table structure
    setTheTableStructure(tableCards) {
        this.initialize(tableCards);
        this.structureElement.innerHTML = this.structure.replace(/\n/g, "<br>");
        this.resizeHandle();
    };

}

export default TableStruct;