class CardMaps {

 
    static abbreviations = [
        ['1', '2', '3'],  // Number
        ['d', 's', 'o'],  // Symbol
        ['e', 's', 'f'],  // Shade
        ['g', 'b', 'r']   // Shape
    ];
    	


    static mappings = [
        { '1': 'One', '2': 'Two', '3': 'Three' },
        { 'd': 'Diamond', 's': 'Squiggle', 'o': 'Oval' },
        { 'e': 'Empty', 's': 'Stripes', 'f': 'Full' },
        { 'g': 'Green', 'b': 'Blue', 'r': 'Red' }
    ];

    static reversedMappings = [
        { 'One': '1', 'Two': '2', 'Three': '3' },
        { 'Diamond': 'd', 'Squiggle': 's', 'Oval': 'o' },
        { 'Empty': 'e', 'Stripes': 's', 'Full': 'f' },
        { 'Green': 'g', 'Blue': 'b', 'Red': 'r' }
    ];


}

export default CardMaps;