const mongoose = require('mongoose');

const KanbanListController = new mongoose.Schema({
    title: String,
    sorting: Number,
    cards: [{
        name: String,
        priority: Number,
        color: String,
        toDoList: [{
            toDo: String,
            status: Boolean,
        }],
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
});

mongoose.model('KanbanList', KanbanListController);