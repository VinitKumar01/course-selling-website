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
            message: `Error Occured While Signingup, ${error}`
        })
    }
    
})

userRouter.post("/signin", async (req, res)=> {
    const email = req.body.email;
    const password = req.body.password;

    const user = await userModel.findOne({
        email: email
    });

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
        const token = jwt.sign({
            id: user._id
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
    const userId = req.id;
    
    const purchases = await purchaseModel.find({
        userId: userId
    });

    let purchasedCourseIds = [];

    try {
        for (let i = 0; i<purchases.length;i++){ 
            purchasedCourseIds.push(purchases[i].courseId)
        }
    
        const courseData = await courseModel.find({
            _id: { $in: purchasedCourseIds }
        });
    
        res.json({
            courseData
        })
    } catch (error) {
        res.status(400).json({
            message:"You have no courses"
        })
    }

})

module.exports = {
    userRouter: userRouter
}