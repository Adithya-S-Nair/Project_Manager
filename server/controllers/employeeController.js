import { db } from '../connections/mysql.js';

export const appointEmployee = (req, res) => {

    const orgCode = 'nishk';
    const currentYear = new Date().getFullYear();
    const random4DigitNumber = Math.floor(1000 + Math.random() * 9000);

    const employeeCode = `emp_${orgCode}_${currentYear}_${random4DigitNumber}`;

    const query = `INSERT INTO employee (employee_code, employee_name, user_account_id)
                   SELECT ?, user_name, ? FROM users WHERE user_id = ?`;
    const values = [employeeCode, req.params.userId, req.params.userId];

    db.query(query, values, (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows === 0) return res.status(404).json({ msg: "No data found" });
        return res.status(200).json({ msg: "Employee created successfully" });
    });
};


export const getAllEmployees = (req, res) => {
    const query = `SELECT * FROM employee`;

    db.query(query, (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ msg: "No data found" })
        return res.status(200).json(data)
    })
}