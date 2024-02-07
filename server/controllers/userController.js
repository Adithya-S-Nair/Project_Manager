import { db } from '../connections/mysql.js';

export const getAllUsers = (req, res) => {
    if (!req.userType === 'Admin') {
        return res.status(403).json({ err: "User is not authorized to fetch this information" })
    }
    const query = `SELECT * FROM users
                    WHERE NOT EXISTS (
                        SELECT 1
                        FROM employee
                        WHERE users.user_id = employee.user_account_id
                    ) AND user_type = 'Users'`
    db.query(query, (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ msg: "No data found" })
        return res.status(200).json(data)
    })
}