const requestController = require('../controller/exhanges/requestControoler');
const router = require('express').Router();
router.post('/', requestController.createRequest);
router.get('/', requestController.getRequests);
router.delete('/:id', requestController.deleteRequest);
router.put('/:id',requestController.updateRequestStatus)
router.get('/received', requestController.getReceivedRequests)
module.exports = router;