export const creationFormHTML = 
`
<form id="creationForm">
    <input id="titleInput" name="title" type="text"
        placeholder="Title..." required="true" 
        minlength=1 maxlength=40 />

    <textarea id="descriptionInput" name="description" type="text"
        placeholder="Description..." required="true" 
        minlength=1 maxlength=200></textarea>

    <button type="submit">Create</button>
</form>
`;

export const listItemHTML = 
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