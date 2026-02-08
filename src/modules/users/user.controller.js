import { deleteOne, getAll, getOne } from "../handlers/handlers.js"
import { User } from "../../../database/models/user.model.js"
import { catchError } from "../../middleware/catchError.js"


const addUser = catchError(async (req, res) => {
    let user = new User(req.body)
    await user.save()
    res.status(201).json({ message: "success", user })
})


const getAllUsers = getAll(User)
const getUser = getOne(User)

const updateUser = catchError(async (req, res, next) => {
    let document = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    document || next(new AppError("document not found", 404))
    !document || res.status(200).json({ message: "success", document })
})

const deleteUser = deleteOne(User)




export {
    addUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
}