import api from './api';
import { CardCreation } from './cardCreation';

export class ListRendering {
    constructor() {
        this.listsContainerElement = 
            document.getElementById('listsContainer');
        this.createNewListDivElement = 
            document.getElementById('createNewList');
        
        this.renderLists();
    }

    async renderLists() {
        // Resetting the lists container.
        // The createNewListDiv is removed and stored so as not to be lost.
        this.listsContainerElement.removeChild(this.createNewListDivElement);
        this.listsContainerElement.innerHTML = "";
        
        // Getting the data from server.
        const { data } = await api.get('/lists');

        // Rendering the lists.
        for(let counter = 0; counter < data.length; counter++)
        {
            this.appendNewListNode(counter, data[counter].title, 
                data[counter].description, data[counter]._id);

            new CardCreation(counter);
        }

        // Restoring the createNewListDiv in DOM.
        this.listsContainerElement.appendChild(this.createNewListDivElement);
    }

    appendNewListNode(counter, title, description, listID) {
        const listItemHTML = 
        `
        <header class="listHeader">
            <div class="listTitle"></div>
    
            <div class="editDiv" title="Edit List">
                <a href="#" class="editListButton">
                    <img src="icons/edit_icon_black.png.png" />
                </a>
            </div>
    
            <div class="deleteDiv" title="Delete List">
                <a href="#" class="deleteListButton">
                    <img src="icons/delete_icon_black.png" />
                </a>
            </div>
        </header>
        
        <div class="createNewCard">
            <button class="createNewCardButton">+ Create New Card</button>
        </div>
        `;
        
        const listItemElement = document.createElement('div');
        listItemElement.setAttribute('class', 'list');
        listItemElement.innerHTML = listItemHTML;
    
        // Appending the list element created in the lists container.
        this.listsContainerElement.appendChild(listItemElement);
    
        // Setting the description in the list element created.
        const listTitleDivElement = document.getElementsByClassName('listTitle')[counter];
        listTitleDivElement.setAttribute('title', description);
        
        // Setting the title in the list element created.
        const titleElement = document.createElement('h2');
        titleElement.appendChild(document.createTextNode(title));

        listTitleDivElement.appendChild(titleElement);

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