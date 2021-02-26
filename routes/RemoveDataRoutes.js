const express =  require("express");
const RemoveData = require('../controllers/admin/RemoveDataController.js');
const checkAuth =  require("../middleware/check-auth.js");

const router = express.Router();

router
    .post('/create',checkAuth, RemoveData.createRemoveData)
    .get('/view-all',checkAuth, RemoveData.getAllRemoveData)
    .patch('/update/:id',checkAuth,RemoveData.updateRemoveData)
    .delete('/delete/:id',checkAuth,RemoveData.removeRemoveData)
    .get('/view/:module',checkAuth, RemoveData.getDataView)
    .delete('/check-password',checkAuth,RemoveData.checkPassword);

module.exports = router;