const exchangeController = require('../controller/exhanges/exchangeController');

const router = require('express').Router();

const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, exchangeController.createExchange);
router.get('/', exchangeController.getExchanges);
router.get('/:id', authMiddleware, exchangeController.getExchange);
router.put('/:id', authMiddleware, exchangeController.updateExchange);
router.delete('/:id', authMiddleware, exchangeController.deleteExchange);
router.get('/my/exchages', authMiddleware, exchangeController.getMyExchanges);
module.exports = router;