const express = require('express');
const routes = express.Router();

const KanbanListController = require('./controllers/KanbanListController');

routes.get('/lists', KanbanListController.index);

routes.post('/lists', KanbanListController.store);            // CREATE
routes.get('/lists/:id', KanbanListController.show);          // READ
routes.put('/lists/:id', KanbanListController.update);        // UPDATE
routes.delete('/lists/:id', KanbanListController.destroy);    // DELETE

module.exports = routes;