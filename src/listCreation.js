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

    renderCreationPanel() {
        this.isCreationPanelEnabled = true;
        
        this.creationPanelElement = document.createElement('div');
        this.creationPanelElement.setAttribute('id', 'listCreationPanel');

        this.formElement = document.createElement('form');
        this.formElement.setAttribute('id', 'listCreationForm');
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
    }

    async registerNewList(event) {
        event.preventDefault();

        const title = this.nameInputElement.value;
        const description = this.descriptionInputElement.value;

        this.resetCreationPanel();

        // Getting the last index, that is, the sorting number of the new document.
        const { data } = await api.get('/lists');
        const sorting = data.length;

        // Creating the new document on the lists collection.
        await api.post('/lists', { title, description, sorting });

        // The instance of ListRendering is created to refresh the lists rendered.
        new ListRendering;
    }
}