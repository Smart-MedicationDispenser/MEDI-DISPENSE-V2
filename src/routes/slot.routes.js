// const express = require("express");

// const router = express.Router();

// const slotController = require("../controllers/slot.controller");


// router.post("/", slotController.createSlot);

// router.get("/", slotController.getSlots);

// router.put("/dispense/:slotId", slotController.updateStock);


// module.exports = router;

const express = require("express");
const router = express.Router();

const { dispenseTablet } = require("../controllers/slot.controller");

router.put("/dispense/:slotId", dispenseTablet);

module.exports = router;