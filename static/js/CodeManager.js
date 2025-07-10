class CodeManager {
    constructor(buttonsTarget, descriptionTarget, editorTarget, directory, documents, loadingOverlay, messageHandler = undefined, resizeHandle = undefined, resetButtonId = "theory-reset", activeClass = "selected-theory", idPrefix = "document-"){
        this.buttonsTarget = buttonsTarget;
        this.descriptionTarget = descriptionTarget;
        this.editorTarget = editorTarget;
        this.directory = directory;
        this.documents = documents;

        this.loadingOverlay = loadingOverlay;
        this.messageHandler = messageHandler;
        this.resizeHandle = resizeHandle;

        this.resetButtonId = resetButtonId;

        this.activeClass = activeClass;
        this.idPrefix = idPrefix;

        // Setup the CodeMirror editor
        this.codeEditor = CodeMirror($("#"+this.editorTarget)[0], {mode: "idp", lineNumbers : true, lineWrapping : true});
        this.openedDocument = undefined;
    
        this.initialize();
    }

    async initialize() {
        let buttonslement = document.getElementById(this.buttonsTarget);

        // Create the reset button
        const button = document.createElement("button");
        button.classList.add("btn-small");
        button.id = this.resetButtonId;
        button.textContent = "Reset";
        button.onclick = async (event) => {
            await this.#resetTheory();
        };
        buttonslement.appendChild(button);

        // Create the buttons
        this.documents.forEach((doc, index) => {
            const button = document.createElement("button");
            button.classList.add("btn-small");
            button.id = this.idPrefix + doc.name;
            button.textContent = doc.buttonText;
            button.onclick = async (event) => {
                await this.#saveTheCode();
                await this.#openTheory(index);
            };    

            buttonslement.appendChild(button);
        });

        // Open the first document
        if(this.documents.length){
            await this.#openTheory(0);
        }

        // Bind the save action to the editor code change
        this.codeEditor.on("change", async () => {
            await this.#saveTheCode(false);
        });
    }

    async #openTheory(id){
        // Remove the active document class
        if(this.openedDocument != undefined){
            document.getElementById(this.idPrefix + this.documents[this.openedDocument].name).classList.remove(this.activeClass);
        }

        // Set the opened document id
        this.openedDocument = id;

        // Update the description
        document.getElementById(this.descriptionTarget).innerHTML = this.documents[this.openedDocument].description;

        // Update the code
        let code = await this.#getTheCode(this.documents[this.openedDocument].name);
        this.codeEditor.setValue(code);

        // Disable/Enable editing
        if(this.documents[this.openedDocument].editable){
            this.codeEditor.setOption("readOnly", false); 
            document.getElementById(this.resetButtonId).classList.remove("btn-disabled");
        }else{
            this.codeEditor.setOption("readOnly", "nocursor"); 
            document.getElementById(this.resetButtonId).classList.add("btn-disabled");
        }

        // Add the active document class
        document.getElementById(this.idPrefix + this.documents[this.openedDocument].name).classList.add(this.activeClass);

        // Trigger resize
        this.resizeHandle?.();        
    }

    async #resetTheory() {
        // Reload the code
        if(this.documents[this.openedDocument].editable){
            if (confirm("Are you sure you want to reset the code of the selected file?")) {
                let code = await this.#getTheCode("templates/" + this.documents[this.openedDocument].name);
                this.codeEditor.setValue(code);
            }
        }
    }

    async #saveTheCode(overlay = true){

        if (!this.documents[this.openedDocument].editable){
            return
        }

        let selectedTheory = this.documents[this.openedDocument].name;
        let code = this.codeEditor.getValue();

        const url = `http://localhost:8000/save_code?name=${encodeURIComponent(this.directory + selectedTheory)}&code=${encodeURIComponent(code)}`;

        if(overlay){
            this.loadingOverlay.style.visibility = "visible";
        }
        fetch(url)
            .then((response) => {
                if (response.ok) {
                    this.messageHandler?.setTheConsole("Code of theory " + selectedTheory + " saved!", false);
                }
            })
            .catch(error => this.messageHandler?.setTheConsole("Error saving the code of the theory " + selectedTheory + ":" + error, false))
            .finally(() => this.loadingOverlay.style.visibility = "hidden");
    }

    async #getTheCode(fileName) {
        const url = `http://localhost:8000/get_code?name=${encodeURIComponent(this.directory + fileName)}`;
        
        let rcode = "";
        this.loadingOverlay.style.visibility = "visible";
        await fetch(url)
            .then(response => response.json())
            .then(data => {
                this.messageHandler?.setTheConsole();
                rcode = data.code;
            })
            .catch(error => this.messageHandler?.setTheConsole(error, true))
            .finally(() => this.loadingOverlay.style.visibility = "hidden");
        return rcode;
    }
}

export default CodeManager;
