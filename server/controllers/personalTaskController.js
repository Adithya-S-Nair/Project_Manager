import { db } from '../connections/mysql.js';
import moment from 'moment';

export const createPersonalTask = (req, res) => {
    const empFetchQery = "SELECT * FROM employee WHERE "
    const query = `INSERT INTO personal_task (
        employee_id,
        project_id,
        personal_task_name,
        Priority,
        personal_task_description,
        planned_start_date,
        planned_end_date,
        actual_start_time,
        actual_end_time,
        planned_budget,
        actual_budget,
        status
      )
      SELECT
        e.employee_id,
        ? AS project_id,
        ? AS personal_task_name,
        ? AS priority,
        ? AS personal_task_description,
        ? AS planned_start_date,
        ? AS planned_end_date,
        ? AS actual_start_time,
        ? AS actual_end_time,
        ? AS planned_budget,
        ? AS actual_budget,
        ? AS status
      FROM employee e
      WHERE e.user_account_id = ?      
    `;
    const values = [
        req.body.projectId,
        req.body.personalTaskName,
        req.body.priority,
        req.body.personalTaskDescription,
        req.body.plannedStartDate,
        req.body.plannedEndDate,
        req.body.actualStartTime,
        req.body.actualEndTime,
        req.body.plannedBudget,
        req.body.actualBudget,
        req.body.status,
        req.userId,
    ]
    db.query(query, values, (err, data) => {
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
            WHERE u.user_id = ? AND project_id = ? AND pt.is_deleted = 0`
    db.query(query, [req.userId, req.params.projectId], (err, data) => {
        if (err) return res.status(500).json(err);

        if (data.length === 0) {
            return res.status(404).json({ msg: "No data found" });
        }

        return res.status(200).json(data)
    })
}

export const updatePersonalTask = (req, res) => {
    const personalTaskId = req.params.personalTaskId;

    const query = `
            UPDATE personal_task
            SET
            personal_task_name = ?,
            Priority = ?,
            personal_task_description = ?,
            planned_start_date = ?,
            planned_end_date = ?,
            actual_start_time = ?,
            actual_end_time = ?,
            planned_budget = ?,
            actual_budget = ?,
            status = ?
            WHERE
            personal_task_id = ?
            And is_deleted = 0`

    const values = [
        req.body.personalTaskName,
        req.body.Priority,
        req.body.personalTaskDesc,
        moment(req.body.plannedStartDate).format('YYYY-MM-DD'),
        moment(req.body.plannedEndDate).format('YYYY-MM-DD'),
        moment(req.body.actualStartTime).format('YYYY-MM-DD'),
        moment(req.body.actualEndTime).format('YYYY-MM-DD'),
        req.body.plannedBudget,
        req.body.actualBudget,
        req.body.status,
        personalTaskId
    ];

    db.query(query, values, (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows === 0) return res.status(400).json({ msg: "No matching record for updation" })
        return res.status(200).json({ message: "Task updated successfully" });
    })
}

export const deletePersonalTask = (req, res) => {
    const personalTaskIds = req.params.personalTaskIds.split(',');
    if (!Array.isArray(personalTaskIds) || personalTaskIds.length === 0) {
        return res.status(400).json({ error: 'Invalid task IDs provided' });
    }

    const query = `UPDATE personal_task 
        SET is_deleted = 1
        WHERE personal_task_id IN (?)`;

    db.query(query, [personalTaskIds], (error, results) => {
        if (error) {
            console.error('Error deleting tasks:', error);
            return res.status(500).json({ error: 'An error occurred while deleting tasks' });
        }

        res.status(200).json({ message: 'Personal Tasks deleted successfully' });
    });
}

export const getProjectPriorityBasedPersonalTask = (req, res) => {
    const { projectId, priority } = req.params;

    const query = ' SELECT * FROM personal_task WHERE project_id = ? AND Priority = ? AND is_deleted = 0';
    const value = [projectId, priority];
    db.query(query, value, (err, data) => {
        if (err) return res.status(500).json(err);

        if (data.length === 0) {
            return res.status(404).json({ msg: "No data found" });
        }
        data.forEach(row => {
            row.planned_start_date = moment(row.planned_start_date).format('YYYY-MM-DD');
            row.planned_end_date = moment(row.planned_end_date).format('YYYY-MM-DD');
            row.actual_start_time = moment(row.actual_start_time).format('YYYY-MM-DD');
            row.actual_end_time = moment(row.actual_end_time).format('YYYY-MM-DD');
        });

        return res.status(200).json(data)
    })
}
