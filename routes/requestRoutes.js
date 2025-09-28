const requestController = require('../controller/exhanges/requestControoler');
const router = require('express').Router();
router.post('/', requestController.createRequest);
router.get('/', requestController.getRequests);
router.delete('/:id', requestController.deleteRequest);

module.exports = router;