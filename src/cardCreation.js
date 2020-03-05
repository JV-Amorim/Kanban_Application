import api from './api';
import { creationFormHTML } from './htmlTemplates';

export class CardCreation {
    constructor(listIndex, listID) {
        this.cardName = "";
        this.cardDescription = "";

        this.parentListID = listID;

        this.isCreationPanelEnabled = false;
        
        this.creationPanelElement;
        this.nameInputElement;
        this.descriptionInputElement;

        this.cardCreationDivElement = 
            document.getElementsByClassName('createNewCard')[listIndex];
        this.cardCreationButtonElement = 
            document.getElementsByClassName('createNewCardButton')[listIndex];

        this.enableCreationButtonFunctionality();
    }

    enableCreationButtonFunctionality() {
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

    renderCreationPanel() {
        this.setObserverInRenderedPanel();

        // The checker attribute is set with delay to not interfere in Observer.
        setTimeout(() => { this.isCreationPanelEnabled = true; }, 100);

        this.destroyOthersCreationPanels();
        
        this.creationPanelElement = document.createElement('div');
        this.creationPanelElement.setAttribute('id', 'cardCreationPanel');
        this.creationPanelElement.innerHTML = creationFormHTML;
        
        this.cardCreationDivElement.appendChild(this.creationPanelElement);

        this.setCreationFormFunctionality();
    }

    setObserverInRenderedPanel() {
        const obsorver = new MutationObserver(() => {
            this.isCreationPanelEnabled = false;
        });

        obsorver.observe(this.cardCreationDivElement, { childList: true });
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

    setCreationFormFunctionality() {
        const formElement = document.getElementById('creationForm');
        formElement.onsubmit = event => this.registerNewCard(event);

        this.nameInputElement = document.getElementById('titleInput');
        this.descriptionInputElement = document.getElementById('descriptionInput');
    }

    async registerNewCard(event) {
        event.preventDefault();

        const name = this.nameInputElement.value;
        const description = this.descriptionInputElement.value;

        this.resetCreationPanel();

        const { data } = await api.get(`/lists/${this.parentListID}`);
        
        data.cards.push({ name, description });

        await api.put(`/lists/${this.parentListID}`, data);
    }
}