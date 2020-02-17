const mongoose = require('mongoose');

const KanbanBoard = mongoose.model('KanbanBoard');

module.exports = {
    async index(request, response) {
        const boards = await KanbanBoard.find();
        
        return response.json(boards);
    },

    // CREATE
    async store(request, response) {
        const newBoard = await KanbanBoard.create(request.body);

        return response.json(newBoard);
    },

    // READ
    async show(request, response) {
        const board = await KanbanBoard.findById(request.params.id);

        return response.json(board);
    },

    // UPDATE
    async update(request, response) {
        const board = await KanbanBoard.findByIdAndUpdate(
            request.params.id,
            request.body,
            { new: true }
        );

        return response.json(board);
    },

    // DELETE
    async destroy(request, response) {
        await KanbanBoard.findByIdAndRemove(request.params.id);

        return response.json('User deleted.');
    }
};