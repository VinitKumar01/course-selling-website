const bcrypt = require("bcrypt");
const { Router } = require("express");
const {adminModel, courseModel} = require("../db");
const {adminMiddleware} = require("../middleware/admin");
const jwt = require("jsonwebtoken");

const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN;

const adminRouter = Router();

adminRouter.post("/signup", async (req, res)=> {
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    const hashedPassword = await bcrypt.hash(password, 5);

    try {
        await adminModel.create({
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

adminRouter.post("/signin", async (req, res)=> {
    const email = req.body.email;
    const password = req.body.password;

    const response = await adminModel.findOne({
        email: email,
        password: password,
    });

    if (response) {
        const token = jwt.sign({
            id: response._id
        }, JWT_SECRET_ADMIN);

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrect Credentials"
        })
    }
})

adminRouter.post("/course", adminMiddleware, async (req, res)=> {
    const {title, description, price, imageUrl} = req.body;
    const creatorId = req._id;

    try {
        const course = await courseModel.create({
            title,
            description,
            price,
            imageUrl,
            creatorId
        })
        res.json({
            message: "Course Added",
            courseId: course._id
        })
    } catch (error) {
        res.status(400).json({
            meaasge: "Failed to add course"
        })
    }
})

adminRouter.put("/course", adminMiddleware, async (req, res)=> {
    const adminId = req._id;
    const {title, description, price, imageUrl, courseId} = req.body;

    try {
        const course = await courseModel.updateOne({
            _id: courseId,
            creatorId: adminId
        }, {
            title,
            description,
            price,
            imageUrl
        });

        res.json({
            message: "Course Updated",
            courseId: course._id
        })
    } catch (error) {
        res.json({
            message: "Failed to update course"
        })
    }
})

adminRouter.get("/course/bulk", adminMiddleware, async function(req, res) {
    const adminId = req._id;
    
    const courses = await courseModel.find({
        creatorId: adminId 
    });
    
    res.json({
        courses
    })
    
})

module.exports = {
    adminRouter: adminRouter
}