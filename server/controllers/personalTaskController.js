import { db } from '../connections/mysql.js';

export const createPersonalTask = (req, res) => {
    const query = `INSERT INTO personal_task VALUES(?)`
    const values = [
        req.body.personalTaskName,
        req.body.personalTaskDesc,
        req.body.priority,
        req.body.plannedStartDate,
        req.body.plannedEndDate,
        req.body.actualStartTime,
        req.body.actualEndTime,
        req.body.plannedBudget,
        req.body.actualBudget
    ]
    db.query(query, [values], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error creating task" });
        }
        return res.status(201).json({ message: "Personal Task created successfully" });
    })
}

export const getPersonalTasks = (req, res) => {
    const query = `SELECT pt.*
            FROM personal_task pt
            JOIN employee e ON pt.employee_id = e.employee_id
            JOIN users u ON e.user_account_id = u.user_id
            WHERE u.user_id = ? AND pt.is_deleted = 0`
    db.query(query, [req.user_id], (err, data) => {
        if (err) return res.status(500).json(err);

        if (data.length === 0) {
            return res.status(404).json({ msg: "No data found" });
        }

        return res.status(200).json(data)
    })
}

export const updatePersonalTask = (req,res) => {
    const taskId = req.params.taskId;

    if (req.body.employee_name) {
        const employeeName = req.body.employee_name;
        console.log(`employee name - ${employeeName}`);
        db.query('SELECT * FROM assigned WHERE task_id = ?', [taskId], (err, existingAssignment) => {
            console.log(existingAssignment.length);
            if (existingAssignment.length > 0) {
                db.query('UPDATE assigned SET employee_id = (SELECT employee_id FROM employee WHERE employee_name = ?) WHERE task_id = ?', [employeeName, taskId]);
            } else {
                db.query('INSERT INTO assigned (project_id, task_id, employee_id) VALUES (?, ?, (SELECT employee_id FROM employee WHERE employee_name = ?))',
                    [req.body.project_id, taskId, employeeName]); // replace projectId and roleId with the appropriate values
            }
        });
    }

    const query = `
            UPDATE task
            SET
            task_name = ?,
            project_id = ?,
            Priority = ?,
            task_description = ?,
            planned_start_date = ?,
            planned_end_date = ?,
            planned_budget = ?,
            actual_start_time = ?,
            actual_end_time = ?,
            actual_budget = ?,
            status = ?
            WHERE
            task_id = ?
            And is_deleted = 0`

    const values = [
        req.body.task_name,
        req.body.project_id,
        req.body.Priority,
        req.body.task_description,
        moment(req.body.planned_start_date).format('YYYY-MM-DD'),
        moment(req.body.planned_end_date).format('YYYY-MM-DD'),
        req.body.planned_budget,
        moment(req.body.actual_start_time).format('YYYY-MM-DD'),
        moment(req.body.actual_end_time).format('YYYY-MM-DD'),
        req.body.actual_budget,
        req.body.status,
        taskId
    ];

    db.query(query, values, (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows === 0) return res.status(400).json({ msg: "No matching record for updation" })
        return res.status(200).json({ message: "Task updated successfully" });
    })
}

export const deletePersonalTask = (req,res) => {
    const personalTaskIds = req.params.personalTaskIds.split(',');
    if (!Array.isArray(personalTaskIds) || personalTaskIds.length === 0) {
        return res.status(400).json({ error: 'Invalid task IDs provided' });
    }

    const query = `UPDATE personal_task 
        SET is_deleted = 1
        WHERE task_id IN (?)`;

    db.query(query, [personalTaskIds], (error, results) => {
        if (error) {
            console.error('Error deleting tasks:', error);
            return res.status(500).json({ error: 'An error occurred while deleting tasks' });
        }

        res.status(200).json({ message: 'Personal Tasks deleted successfully' });
    });
}