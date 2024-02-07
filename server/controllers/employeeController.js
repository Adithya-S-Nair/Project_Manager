import { db } from '../connections/mysql.js';

export const appointEmployee = (req, res) => {
    const query = `INSERT INTO employee (employee_code, employee_name, user_account_id)
                VALUES (?)`
    const values = ['sample_code', 'emp_name', req.params.userId]
    db.query(query, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ msg: "No data found" })
        return res.status(200).json({ msg: "Employee created successfully" })
    })
}