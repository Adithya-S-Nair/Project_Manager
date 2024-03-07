import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import { db } from '../connections/mysql.js';
import moment from 'moment';

export const register = (req, res) => {

    const signInTime = req.body.signInTime;

    const selectQuery = "SELECT * FROM users WHERE email = ?";

    db.query(selectQuery, [req.body.email], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("User already exists!");

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const insertQuery =
            "INSERT INTO users (`user_name`, `email`, `password`, `first_name`, `last_name`, `registration_time`, `user_type`) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const values = [
            req.body.username,
            req.body.email,
            hashedPassword,
            req.body.firstname,
            req.body.lastname,
            moment(signInTime).format('YYYY-MM-DD HH:mm:ss'),
            req.body.usertype
        ];

        db.query(insertQuery, values, (err, data) => {
            if (err) {
                console.error(err); // Log the error
                return res.status(500).json({ error: "Error creating user", details: err });
            }
            return res.status(200).json("User has been created.");
        });

    });
};

export const login = (req, res) => {
    const signInTime = moment().format('YYYY-MM-DD HH:mm:ss');

    const selectQuery = "SELECT * FROM users WHERE email = ?";

    db.query(selectQuery, [req.body.email], (err, selectResult) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (selectResult.length === 0) {
            return res.status(404).json("User not found");
        }
        const checkPassword = bcrypt.compareSync(req.body.password, selectResult[0].password);

        if (!checkPassword) {
            return res.status(400).json("Wrong password or username");
        }

        // Format the signin field using moment
        selectResult.forEach(row => {
            row.registration_time = moment(row.registration_time).format('YYYY-MM-DD HH:mm:ss');
        });

        const token = jwt.sign(
            {
                user_id: selectResult[0].user_id,
                user_type: selectResult[0].user_type,
                email: selectResult[0].user_email
            },
            process.env.SECRET
        );

        const { password, ...others } = selectResult[0];
        res.cookie("accessToken", token, { httpOnly: true }).status(200).json(others);
    });
};

export const logout = (req, res) => {
    return res
        .clearCookie("accessToken")
        .status(200)
        .json({ message: "Successfully logged out" });
}

export const verify = (req, res) => {
    if (req.userId) {
        return res.status(200).json({ msg: "authorization successful", userId: req.userId, user_type: req.userType })
    }
}