const { Router } = require("express");
const {userMiddleware} = require("../middleware/user");
const {courseModel, purchaseModel} = require("../db");
const courseRouter = Router();

courseRouter.get("/preview", async (req, res)=> {
    try {
        const courses = await courseModel.find({});
        res.json({ courses });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve courses" });
    }
})

courseRouter.post("/purchase",userMiddleware , async (req, res)=> {
    const userId = req.id;
    const courseId = req.body.courseId;

    //add a payment logic
    try {
        await purchaseModel.create({
            userId,
            courseId
        })
        res.json({
            message: "Course purchased sucessfully"
        })
    } catch (error) {
        res.status(400).json({
            message: "Course purchase failed"
        })
    }
})

module.exports = {
    courseRouter: courseRouter
}