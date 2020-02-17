const mongoose = require('mongoose');

const KanbanBoardSchema = new mongoose.Schema({
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

mongoose.model('KanbanBoard', KanbanBoardSchema);