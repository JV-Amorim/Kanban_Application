import api from './api';
import { cardItemHTML } from './htmlTemplates';
import { CardDetails } from './cardDetailsModal';

export class CardRendering {
    constructor(listIndex, listID) {
        this.parentListID = listID;

        this.parentListElement = 
            document.getElementsByClassName('list')[listIndex];
        
        this.renderCards();
    }

    async renderCards() {
        const listCreateNewCardElement = this.resetCurrentRenderedCards();
        
        const { data } = await api.get(`/lists/${this.parentListID}`);
        const { cards } = data;

        for(let counter = 0; counter < cards.length; counter++)
        {
            const name = cards[counter].name;
            const description = cards[counter].description;

            const newCardItem = this.createNewCardItem(name, description);

            this.setTasksCounterInNewCardItem(newCardItem, cards[counter]);
            this.setCreationDateInNewCardItem(newCardItem, cards[counter]);
            this.setDeleteButtonInNewCardItem(newCardItem, cards[counter]);
            this.setCardDetailsFunctionality(newCardItem, cards[counter]);

            this.parentListElement.appendChild(newCardItem);
        }

        this.parentListElement.appendChild(listCreateNewCardElement);
    }

    resetCurrentRenderedCards() {
        const listHeaderElement =
            this.parentListElement.getElementsByClassName('listHeader')[0];
        const listCreateNewCardElement = 
            this.parentListElement.getElementsByClassName('createNewCard')[0];

        this.parentListElement.innerHTML = '';

        this.parentListElement.appendChild(listHeaderElement);

        return listCreateNewCardElement;
    }

    createNewCardItem(name, description) {
        const newCardItem = document.createElement('div');
        newCardItem.setAttribute('class', 'card');
        newCardItem.innerHTML = cardItemHTML;

        const nameElement = newCardItem.querySelector('h3');
        nameElement.appendChild(document.createTextNode(name));
        nameElement.setAttribute('title', description);

        return newCardItem;
    }

    setTasksCounterInNewCardItem(newCardItem, cardData) {
        const tasksCounterElement =
            newCardItem.querySelector('.tasksCounter span');

        let tasksCompleted = 0;
        
        for(let i = 0; i < cardData.toDoList.length; i++)
        {
            if(cardData.toDoList[i].status)
                tasksCompleted++;
        }

        tasksCounterElement.appendChild(document.createTextNode(
            `${tasksCompleted}/${cardData.toDoList.length}`
        ));
    }

    setCreationDateInNewCardItem(newCardItem, cardData) {
        const creationDateElement =
            newCardItem.querySelector('.creationDate span');

        let date = cardData.createdAt.split('T')[0];
        date = date.split('-');

        creationDateElement.appendChild(document.createTextNode(
            `${date[2]}/${date[1]}/${date[0]}`
        ));
    }

    setDeleteButtonInNewCardItem(newCardItem, cardData) {
        const deleteCardElement =
            newCardItem.querySelector('.deleteDiv a');

        deleteCardElement.onclick = (event) => this.deleteCardItem(event, cardData._id);
    }

    setCardDetailsFunctionality(newCardItem, cardData) {
        const cardName = newCardItem.querySelector('h3');
        
        cardName.onclick = () => new CardDetails(cardData, this.parentListID);
    }

    async deleteCardItem(event, cardID) {
        event.preventDefault();

        const { data } = await api.get(`/lists/${this.parentListID}`);

        let cardIndex;

        for(let i = 0; i < data.cards.length; i++)
        {
            if(data.cards[i]._id === cardID)
                cardIndex = i;
        }

        data.cards.splice(cardIndex, 1);

        await api.put(`/lists/${this.parentListID}`, data);

        this.renderCards();
    }
}