const mongoose = require('mongoose');

const KanbanList = mongoose.model('KanbanList');

module.exports = {
    async index(request, response) {
        const lists = await KanbanList.find();
        
        return response.json(lists);
    },

    // CREATE
    async store(request, response) {
        const newList = await KanbanList.create(request.body);

        return response.json(newList);
    },

    // READ
    async show(request, response) {
        const list = await KanbanList.findById(request.params.id);

        return response.json(list);
    },

    // UPDATE
    async update(request, response) {
        const list = await KanbanList.findByIdAndUpdate(
            request.params.id,
            request.body,
            { new: true }
        );

        return response.json(list);
    },

    // DELETE
    async destroy(request, response) {
        await KanbanList.findByIdAndRemove(request.params.id);

        return response.json('List deleted from the board.');
    }
};