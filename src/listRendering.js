import api from './api';
import { CardCreation } from './cardCreation';
import { listItemHTML } from './htmlTemplates';

export class ListRendering {
    constructor() {
        this.listsContainerElement = 
            document.getElementById('listsContainer');
        this.createNewListDivElement = 
            document.getElementById('createNewList');
        
        this.renderLists();
    }

    async renderLists() {
        // The createNewListDiv is removed and stored so as not to be lost.
        this.listsContainerElement.removeChild(this.createNewListDivElement);

        // Resetting the lists container.
        this.listsContainerElement.innerHTML = "";
        
        const { data } = await api.get('/lists');

        // Rendering the lists.
        for(let counter = 0; counter < data.length; counter++)
        {
            this.appendNewListNode();
   
            this.setListElementAttributes(counter, data[counter].title, data[counter].description);

            this.setDeleteButtonFunctionality(counter, data[counter]._id);

            new CardCreation(counter, data[counter]._id);
        }

        // Restoring the createNewListDiv in DOM.
        this.listsContainerElement.appendChild(this.createNewListDivElement);
    }

    appendNewListNode() {
        const listItemElement = document.createElement('div');
        listItemElement.setAttribute('class', 'list');
        listItemElement.innerHTML = listItemHTML;
    
        this.listsContainerElement.appendChild(listItemElement);
    }

    setListElementAttributes(counter, title, description) {
        const listTitleDivElement = document.getElementsByClassName('listTitle')[counter];
        listTitleDivElement.setAttribute('title', description);
        
        const titleElement = document.createElement('h2');
        titleElement.appendChild(document.createTextNode(title));

        listTitleDivElement.appendChild(titleElement);
    }

    setDeleteButtonFunctionality(counter, listID) {
        const deleteListButtonElement =
            document.getElementsByClassName('deleteListButton')[counter];
        
        deleteListButtonElement.onclick = (event) => this.deleteList(event, listID);
    }

    async deleteList(event, listID) {
        event.preventDefault();

        await api.delete(`/lists/${listID}`);
        this.renderLists();
    }
}