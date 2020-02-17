const express = require('express');
const routes = express.Router();

const KanbanBoardController = require('./controllers/KanbanBoardController');

routes.get('/boards', KanbanBoardController.index);

routes.post('/boards', KanbanBoardController.store);            // CREATE
routes.get('/boards/:id', KanbanBoardController.show);          // READ
routes.put('/boards/:id', KanbanBoardController.update);        // UPDATE
routes.delete('/boards/:id', KanbanBoardController.destroy);    // DELETE

module.exports = routes;