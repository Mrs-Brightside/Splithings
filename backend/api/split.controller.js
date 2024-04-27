import SplitDAO from "../dao/splitDAO.js"

export default class SplitController {
    static async apiPostExpense(req, res, next) {
        try {
            const user = req.body.user
            const expense = req.body.expense
            const cashValue = parseFloat(req.body.cashValue).toFixed(2)
            const category = req.body.category
            const dueDateMonth = req.body.dueDateMonth
            const dueDateYear = req.body.dueDateYear

            const expenseResponse = await SplitDAO.addExpense(
                user,
                expense,
                cashValue,
                category,
                dueDateMonth,
                dueDateYear
            )
            res.json({ status: "sucess" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiGetTotalExpenses(req, res, next) {
        try {
            const expenses = await SplitDAO.getTotalExpenses();
            res.json(expenses);
        } catch (e) {
            console.error(`Unable to get expenses: ${e}`)
            res.status(500).json({ error: e })
        }
    }
    static async apiGetExpense(req, res, next) {
        try {
            let id = req.params.id || {}
            let expense = await SplitDAO.getExpense(id)
            if (!expense) {
                res.status(404).json({ error: "Not found" })
                return
            }
            res.json(expense)
        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }
    static async apiUpdateExpense(req, res, next) {
        try {
            const expenseId = req.params.id
            const user = req.body.user
            const expense = req.body.expense
            const cashValue = parseFloat(req.body.cashValue).toFixed(2)
            const category = req.body.category
            const dueDateMonth = req.body.dueDateMonth
            const dueDateYear = req.body.dueDateYear
    
            const expenseResponse = await SplitDAO.updateExpense(
                expenseId,
                user,
                expense,
                cashValue,
                category,
                dueDateMonth,
                dueDateYear
            )
    
            var { error } = expenseResponse
            if (error) {
                return res.status(400).json({ error })
            }
            if (expenseResponse.modifiedCount === 0) {
                throw new Error("unable to update expense")
            }
            return res.json({ status: "success" })
        } catch (e) {
            console.error(e)
            return res.status(500).json({ error: e.message })
        }
    }
    

    static async apiDeleteExpense(req, res, next) {
        try {
            const expenseId = req.params.id
            const expenseResponse = await SplitDAO.deleteExpense(expenseId)
            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}