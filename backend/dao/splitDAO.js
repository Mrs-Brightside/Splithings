import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let expenses

export default class SplitDAO {
    static async injectDB(conn) {
        if (expenses) {
            return
        }
        try {
            expenses = await conn.db("split").collection("expenses")
        } catch (e) {
            console.error(`Unable to establish collection handle in userDAO: ${e}`)
        }
    }

    static async addExpense(user, expense, cashValue, category, dueDateMonth, dueDateYear) {
        try {
            const expenseDoc = {
                user: user,
                expense: expense,
                cashValue: cashValue,
                category: category,
                dueDateMonth: dueDateMonth,
                dueDateYear: dueDateYear
            }

            return await expenses.insertOne(expenseDoc)
        } catch (e) {
            console.error(`Unable to get expense: ${e}`)
            return { error: e }
        }
    }

    static async getExpense(expenseId) {
        try {
            return await expenses.findOne({ _id: new ObjectId(expenseId) })
        } catch (e) {
            console.error(`Unable to get expense: ${e}`)
            return { error: e }
        }
    }

    static async getTotalExpenses() {
        return await expenses.find().toArray();
    }
    

    static async updateExpense(expenseId, user, expense, cashValue, category, dueDateMonth, dueDateYear) {
        try {
            const updateResponse = await expenses.updateOne(
                { _id: new ObjectId(expenseId) },
                { $set: { user: user, expense: expense, cashValue: cashValue, category: category, dueDateMonth: dueDateMonth, dueDateYear: dueDateYear } }
            )
    
            return updateResponse
        } catch (e) {
            console.error(`Unable to update expense: ${e}`)
            return { error: e }
        }
    }
    

    static async deleteExpense(expenseId) {
        try {
            const deleteResponse = await expenses.deleteOne({
                _id: new ObjectId(expenseId),
            })
    
            return deleteResponse
        } catch (e) {
            console.error(`Unable to delete expense: ${e}`)
            return { error: e }
        }
    }    
}