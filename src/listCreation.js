import api from './api';
import { ListRendering } from './listRendering';
import { creationFormHTML } from './htmlTemplates';

export class ListCreation {
    constructor() {
        this.listName = "";
        this.listDescription = "";

        this.isCreationPanelEnabled = false;

        this.creationPanelElement;
        this.nameInputElement;
        this.descriptionInputElement;
        
        this.listCreationDivElement = 
            document.getElementById('createNewList');
        this.listCreationButtonElement = 
            document.getElementById('createNewListButton');

        this.enableCreationButtonFunctionality();
    }

    enableCreationButtonFunctionality() {
        this.listCreationButtonElement.onclick = event => {
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

        this.listCreationDivElement.removeChild(this.creationPanelElement);
    }

    renderCreationPanel() {
        this.setObserverInRenderedPanel();
        
        // The checker attribute is set with delay to not interfere in Observer.
        setTimeout(() => { this.isCreationPanelEnabled = true; }, 100);
        
        this.destroyOthersCreationPanels();

        this.creationPanelElement = document.createElement('div');
        this.creationPanelElement.setAttribute('id', 'listCreationPanel');
        this.creationPanelElement.innerHTML = creationFormHTML;

        this.listCreationDivElement.appendChild(this.creationPanelElement);

        this.setCreationFormFunctionality();
    }

    setObserverInRenderedPanel() {
        const obsorver = new MutationObserver(() => {
            this.isCreationPanelEnabled = false;
        });

        obsorver.observe(this.listCreationDivElement, { childList: true });
    }

    destroyOthersCreationPanels() {
        const cardCreationPanelElement = 
            document.getElementById('cardCreationPanel');

        if(cardCreationPanelElement)
        {
            const parent = cardCreationPanelElement.parentNode;
            parent.removeChild(cardCreationPanelElement);
        }
    }

    setCreationFormFunctionality() {
        const formElement = document.getElementById('creationForm');
        formElement.onsubmit = event => this.registerNewList(event);

        this.nameInputElement = document.getElementById('titleInput');
        this.descriptionInputElement = document.getElementById('descriptionInput');
    }

    async registerNewList(event) {
        event.preventDefault();

        const title = this.nameInputElement.value;
        const description = this.descriptionInputElement.value;

        this.resetCreationPanel();

        // Creating the new document on the lists collection.
        await api.post('/lists', { title, description });

        // The instance of ListRendering is created to refresh the lists rendered.
        new ListRendering;
    }
}