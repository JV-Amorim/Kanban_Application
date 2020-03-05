import api from './api';
import { ListRendering } from './listRendering';

export class ListCreation {
    constructor() {
        this.listName = "";
        this.listDescription = "";

        this.isCreationPanelEnabled = false;

        this.creationPanelElement;
        this.formElement;
        this.nameInputElement;
        this.descriptionInputElement;
        this.submitButtonElement;
        
        this.listCreationDivElement = 
            document.getElementById('createNewList');
        this.listCreationButtonElement = 
            document.getElementById('createNewListButton');

        this.registerHandlers();
    }

    registerHandlers() {
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

    destroyOthersCreationPanels() {
        const cardCreationPanelElement = 
            document.getElementById('cardCreationPanel');

        if(cardCreationPanelElement)
        {
            const parent = cardCreationPanelElement.parentNode;
            parent.removeChild(cardCreationPanelElement);
        }
    }

    renderCreationPanel() {
        setTimeout(() => {
            this.isCreationPanelEnabled = true;
            console.log("Is creation panel enabled? " + this.isCreationPanelEnabled);
        }, 100);
        
        this.destroyOthersCreationPanels();

        this.creationPanelElement = document.createElement('div');
        this.creationPanelElement.setAttribute('id', 'listCreationPanel');

        this.formElement = document.createElement('form');
        this.formElement.setAttribute('id', 'creationForm');
        this.formElement.onsubmit = event => this.registerNewList(event);

        this.nameInputElement = document.createElement('input');
        this.nameInputElement.setAttribute('name', 'title');
        this.nameInputElement.setAttribute('type', 'text');
        this.nameInputElement.setAttribute('placeholder', 'Title...');
        this.nameInputElement.setAttribute('required', 'true');
        this.nameInputElement.setAttribute('minlength', '1');
        this.nameInputElement.setAttribute('maxlength', '40');

        this.descriptionInputElement = document.createElement('textarea');
        this.descriptionInputElement.setAttribute('name', 'description');
        this.descriptionInputElement.setAttribute('type', 'text');
        this.descriptionInputElement.setAttribute('placeholder', 'Description...');
        this.descriptionInputElement.setAttribute('required', 'true');
        this.descriptionInputElement.setAttribute('minlength', '1');
        this.descriptionInputElement.setAttribute('maxlength', '200');

        this.submitButtonElement = document.createElement('button');
        this.submitButtonElement.setAttribute('type', 'submit');
        this.submitButtonElement.appendChild(document.createTextNode('Create'));

        this.formElement.appendChild(this.nameInputElement);
        this.formElement.appendChild(this.descriptionInputElement);
        this.formElement.appendChild(this.submitButtonElement);
        this.creationPanelElement.appendChild(this.formElement);
        this.listCreationDivElement.appendChild(this.creationPanelElement);
        
        const obsorver = new MutationObserver(() => {
            this.isCreationPanelEnabled = false;
            console.log("Is creation panel enabled? " + this.isCreationPanelEnabled);
        });

        obsorver.observe(this.listCreationDivElement, { childList: true });
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