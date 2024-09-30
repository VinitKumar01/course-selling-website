const bcrypt = require("bcrypt");
const { Router } = require("express");
const {userModel, purchaseModel, courseModel} = require("../db");
const jwt = require("jsonwebtoken");
const {userMiddleware} = require("../middleware/user")

const JWT_SECRET_USER = process.env.JWT_SECRET_USER;
const userRouter = Router();

userRouter.post("/signup", async (req, res)=> {
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    const hashedPassword = await bcrypt.hash(password, 5);

    try {
        await userModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        })
        res.json({
            message: "You are signedUp"
        })
    } catch (error) {
        res.status(400).json({
            message: "Error Occured While Signingup"
        })
    }
    
})

userRouter.post("/signin", async (req, res)=> {
    const email = req.body.email;
    const password = req.body.password;

    const response = await userModel.findOne({
        email: email,
        password: await bcrypt.hash(password, 5)
    });

    if (response) {
        const token = jwt.sign({
            id: response._id
        }, JWT_SECRET_USER);

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrect Credentials"
        })
    }
})

userRouter.get("/purchases", userMiddleware, async (req, res)=> {
    const userId = req._id;
    
    const purchases = await purchaseModel.findOne({
        userId: userId
    });

    let purchasedCourseId = [];

    for (let course of purchases) {
        purchasedCourseId.push(course.courseId)
    }

    const courseData = await courseModel.find({
        _id: { $in: purchasedCourseIds }
    })

    res.json({
        courseData
    })
})

module.exports = {
    userRouter: userRouter
}