const express = require("express")
const router = express.Router()
const tripController = require("../controller/tripController")

router.post("/add/item", tripController.addNewItem);
router.post("/delete/item/:id/:type", tripController.removeItem);

// router.post("/delete/:userId", checkAuth, userController.deleteUser);

module.exports = router;