import { toDoItemHTML } from './htmlTemplates';
import api from './api';

export class CardDetails {
    constructor(cardData, parentListID) {
        this.parentListID = parentListID;
        
        this.detailsModalElement = document.getElementById('cardDetailsModal');

        this.cardData = cardData;
        this.cardName = cardData.name;
        this.cardDescription = cardData.description;
        this.cardToDoList = cardData.toDoList;

        this.renderDetailsModal();
    }

    renderDetailsModal() {
        this.setAllDetailsModalContent();
        
        this.setDetailsModalCloseFunctionality();
        
        setTimeout(() => this.enableOrDisableDetailsModal(true), 100);
    }

    setAllDetailsModalContent() {
        this.setModalHeader_Title();
        this.setModalHeader_ParentListInformation();

        this.setModalDescription();

        this.setModalToDoList();
    }

    setModalHeader_Title() {
        const modalHeaderElement = 
            this.detailsModalElement.getElementsByClassName('modalHeader')[0];

        const cardNameElement =  modalHeaderElement.querySelector('h2');
        cardNameElement.appendChild(document.createTextNode(this.cardName));
    }

    async setModalHeader_ParentListInformation()
    {
        const modalHeaderElement = 
            this.detailsModalElement.getElementsByClassName('modalHeader')[0];

        const { data:listData } = await api.get(`/lists/${this.parentListID}`);

        const linkToParentListElement = document.createElement('a');
        linkToParentListElement.setAttribute('href', '#');
        linkToParentListElement.setAttribute('title', 'Change Parent List');
        linkToParentListElement.appendChild(document.createTextNode(listData.title));

        const parentListInfoElement = modalHeaderElement.querySelector('p');
        parentListInfoElement.appendChild(document.createTextNode("in the list "));
        parentListInfoElement.appendChild(linkToParentListElement);
    }

    setModalDescription() {
        const modalDescriptionElement = 
            this.detailsModalElement.getElementsByClassName('modalDescription')[0];

        modalDescriptionElement.querySelector('p').appendChild(
            document.createTextNode(this.cardDescription)
        );
    }

    setModalToDoList() {
        const modalToDoListElement = 
            this.detailsModalElement.getElementsByClassName('toDoListContainer')[0];
        
        this.cardToDoList.forEach(toDoItem => {
            const newToDoElement = document.createElement('div');
            newToDoElement.setAttribute('class', 'toDoItem');
            newToDoElement.innerHTML = toDoItemHTML;

            newToDoElement.querySelector('input').checked = toDoItem.status;

            newToDoElement.querySelector('span').appendChild(
                document.createTextNode(toDoItem.toDo)
            );

            if(toDoItem.status)
                newToDoElement.querySelector('span')
                .style.textDecorationLine = 'line-through';

            modalToDoListElement.appendChild(newToDoElement);
        });

        this.setModalToDoList_ButtonFunctionality();

        this.setModalToDoList_NewToDoFunctionality();
    }

    setModalToDoList_ButtonFunctionality() {
        const newToDoButtonElement = 
            this.detailsModalElement.getElementsByClassName('newToDoButton')[0];
        const newToDoFormElement = 
            this.detailsModalElement.getElementsByClassName('newToDoForm')[0];

        newToDoFormElement.style.display = 'none';

        newToDoFormElement.querySelector('input').value = '';

        newToDoButtonElement.onclick = () => {
            if(newToDoFormElement.style.display === 'none')
                newToDoFormElement.style.display = 'block';
            else
                newToDoFormElement.style.display = 'none';
        }
    }

    setModalToDoList_NewToDoFunctionality() {
        const newToDoFormElement = 
            this.detailsModalElement.getElementsByClassName('newToDoForm')[0];

        newToDoFormElement.querySelector('button').onclick = event => 
            this.AddNewToDoItemInCard(event, newToDoFormElement.querySelector('input'));
    }

    async AddNewToDoItemInCard(event, inputElement) {
        event.preventDefault();
        
        const toDo = inputElement.value;
        const status = false;

        this.cardToDoList.push({ toDo, status });
        this.cardData.toDoList = this.cardToDoList;

        const { data } = await api.get(`/lists/${this.parentListID}`);
        const { cards } = data;

        const cardIndex = cards.findIndex(element => element._id === this.cardData._id);
        cards[cardIndex] = this.cardData;
        data.cards = cards;

        const response = await api.put(`/lists/${this.parentListID}`, data);

        this.RefreshToDoListItems(response, cardIndex);
    }

    RefreshToDoListItems({ data }, cardIndex) {
        const cardContent = data.cards[cardIndex];

        this.cardData = cardContent;
        this.cardName = cardContent.name;
        this.cardDescription = cardContent.description;
        this.cardToDoList = cardContent.toDoList;

        const modalToDoListElement = 
            this.detailsModalElement.getElementsByClassName('modalToDoList')[0];
        modalToDoListElement.getElementsByClassName('toDoListContainer')[0].innerHTML = '';

        this.setModalToDoList();
    }

    setDetailsModalCloseFunctionality() {
        const closeModalElement = 
            this.detailsModalElement.getElementsByClassName('closeModal')[0];

        closeModalElement.onclick = () => {
            this.resetDetailsModalContent();
            this.enableOrDisableDetailsModal(false);
        }

        window.onclick = () => {
            if(event.target == this.detailsModalElement)
            {
                this.resetDetailsModalContent();
                this.enableOrDisableDetailsModal(false);
            }
        }
    }

    enableOrDisableDetailsModal(trueOrFalse) {
        if(trueOrFalse)
            this.detailsModalElement.style.display = 'block';
        else
            this.detailsModalElement.style.display = 'none';
    }

    resetDetailsModalContent() {
        const modalContentElement = 
            this.detailsModalElement.getElementsByClassName('modalContent')[0];

        const modalHeaderElement = 
            modalContentElement.getElementsByClassName('modalHeader')[0];

        const modalDescriptionElement = 
            modalContentElement.getElementsByClassName('modalDescription')[0];

        const modalToDoListElement = 
            modalContentElement.getElementsByClassName('modalToDoList')[0];

        // Resetting modal's header.
        modalHeaderElement.querySelector('h2').innerHTML = '';
        modalHeaderElement.querySelector('p').innerHTML = '';

        // Resetting modal's description.
        modalDescriptionElement.querySelector('p').innerHTML = '';

        // Resetting modal's list of to do items.
        modalToDoListElement.getElementsByClassName('toDoListContainer')[0].innerHTML = '';

        // Resetting modal's creation panel of new to do items.
        modalToDoListElement.getElementsByClassName('newToDoForm')[0].style.display = 'none';
        modalToDoListElement.getElementsByClassName('newToDoForm')[0]
            .querySelector('input').value = '';
    }
}