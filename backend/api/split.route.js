import express from "express"
import SplitCtrl from "./split.controller.js"

const router = express.Router()

router.route("/").get(SplitCtrl.apiGetTotalExpenses)
router.route("/new").post(SplitCtrl.apiPostExpense)
router.route("/:id")
  .get(SplitCtrl.apiGetExpense)
  .put(SplitCtrl.apiUpdateExpense)
  .delete(SplitCtrl.apiDeleteExpense)

export default router