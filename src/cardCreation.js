import api from './api';

export class CardCreation {
    constructor(listIndex, listID) {
        this.cardName = "";
        this.cardDescription = "";

        this.parentListID = listID;

        this.cardCreationDivElement = 
            document.getElementsByClassName('createNewCard')[listIndex];
        this.cardCreationButtonElement = 
            document.getElementsByClassName('createNewCardButton')[listIndex];

        this.isCreationPanelEnabled = false;
        this.creationPanelElement;
        this.nameInputElement;
        this.descriptionInputElement;

        this.registerHandlers();
    }

    registerHandlers() {
        this.cardCreationButtonElement.onclick = event => {
            if(this.isCreationPanelEnabled)
                this.resetCreationPanel();
            else
                this.renderCreationPanel();
            };
    }

    resetCreationPanel() {
        this.isCreationPanelEnabled = false;
        
        this.nameInputElement.value = '';
        this.descriptionInputElement.value = '';

        this.cardCreationDivElement.removeChild(this.creationPanelElement);
    }

    destroyOthersCreationPanels() {
        const cardCreationPanelElement = 
            document.getElementById('cardCreationPanel');
        
        const listCreationPanelElement = 
            document.getElementById('listCreationPanel');
        
        if(cardCreationPanelElement)
        {
            const parent = cardCreationPanelElement.parentNode;
            parent.removeChild(cardCreationPanelElement);
        }

        if(listCreationPanelElement)
        {
            const parent = listCreationPanelElement.parentNode;
            parent.removeChild(listCreationPanelElement);
        }
    }

    renderCreationPanel() {
        setTimeout(() => {
            this.isCreationPanelEnabled = true;
            console.log("Is creation panel enabled? " + this.isCreationPanelEnabled);
        }, 100);

        this.destroyOthersCreationPanels();

        const cardItemHTML = 
        `
        <form id="creationForm">
            <input id="titleInput" name="title" type="text"
                placeholder="Title..." required="true" minlength=1 maxlength=40 />

            <textarea id="descriptionInput" name="description" type="text"
                placeholder="Description..." required="true" minlength=1 maxlength=40></textarea>

            <button type="submit">Create</button>
        </form>
        `;
        
        this.creationPanelElement = document.createElement('div');
        this.creationPanelElement.setAttribute('id', 'cardCreationPanel');
        this.creationPanelElement.innerHTML = cardItemHTML;
        
        this.cardCreationDivElement.appendChild(this.creationPanelElement);

        const formElement = document.getElementById('creationForm');
        formElement.onsubmit = event => this.registerNewCard(event);

        this.nameInputElement = document.getElementById('titleInput');
        this.descriptionInputElement =
            document.getElementById('descriptionInput');

        const obsorver = new MutationObserver(() => {
            this.isCreationPanelEnabled = false;
            console.log("Is creation panel enabled? " + this.isCreationPanelEnabled);
        });

        obsorver.observe(this.cardCreationDivElement, { childList: true });
    }

    async registerNewCard(event) {
        event.preventDefault();

        const name = this.nameInputElement.value;
        const description = this.descriptionInputElement.value;

        this.resetCreationPanel();

        const { data } = await api.get(`/lists/${this.parentListID}`);
        
        data.cards.push({ name, description });

        const response = await api.put(`/lists/${this.parentListID}`, data);

        console.log(response);
    }
}