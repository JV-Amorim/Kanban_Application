import { toDoItemHTML } from './htmlTemplates';
import api from './api';

export class CardDetails {
    constructor(cardData, parentListID) {
        this.parentListID = parentListID;
        
        this.detailsModalElement = document.getElementById('cardDetailsModal');

        this.cardName = cardData.name;
        this.cardDescription = cardData.description;

        this.renderDetailsModal();
    }

    renderDetailsModal() {
        this.setAllDetailsModalContent();
        
        this.setDetailsModalCloseFunctionality();
        
        setTimeout(() => this.enableOrDisableDetailsModal(true), 100);
    }

    enableOrDisableDetailsModal(trueOrFalse) {
        if(trueOrFalse)
            this.detailsModalElement.style.display = 'block';
        else
            this.detailsModalElement.style.display = 'none';
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

    setAllDetailsModalContent() {
        this.setModalHeader_Title();
        this.setModalHeader_ParentListInformation();

        this.setModalDescription();
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

    }

    resetDetailsModalContent() {
        const modalContentElement = 
            this.detailsModalElement.getElementsByClassName('modalContent')[0];

        const modalHeaderElement = 
            modalContentElement.getElementsByClassName('modalHeader')[0];

        const modalDescriptionElement = 
            modalContentElement.getElementsByClassName('modalDescription')[0];

        modalHeaderElement.querySelector('h2').innerHTML = '';
        modalHeaderElement.querySelector('p').innerHTML = '';

        modalDescriptionElement.querySelector('p').innerHTML = '';
    }
}