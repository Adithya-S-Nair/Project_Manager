import { db } from '../connections/mysql.js';
import moment from 'moment';

export const createNewTask = (req, res) => {
    if (!req.userType === 'Admin') {
        return res.status(403).json("This user cannot create a task")
    }
    const {
        taskName,
        projectId,
        priority,
        taskDescription,
        plannedStartDate,
        plannedEndDate,
        plannedBudget,
        actualStartTime,
        actualEndTime,
        actualBudget,
        status } = req.body
    const query = `INSERT INTO task (task_name, project_id, priority, task_description, planned_start_date, planned_end_date, planned_budget, actual_start_time, actual_end_time, actual_budget, status)
                    VALUES (?)`
    const values = [
        taskName,
        projectId,
        priority,
        taskDescription,
        moment(plannedStartDate).format('YYYY-MM-DD'),
        moment(plannedEndDate).format('YYYY-MM-DD'),
        plannedBudget,
        moment(actualStartTime).format('YYYY-MM-DD'),
        moment(actualEndTime).format('YYYY-MM-DD'),
        actualBudget,
        status
    ]

    db.query(query, [values], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error creating task" });
        }
        return res.status(201).json({ message: "Task created successfully" });
    })
}

export const getTasksByProjectId = (req, res) => {
    const query = "SELECT * FROM task WHERE project_id = ? AND is_deleted = 0"
    const value = [req.params.projectId]
    db.query(query, value, (err, data) => {
        if (err) return res.status(500).json(err);

        if (data.length === 0) {
            return res.status(404).json({ msg: "No data found" });
        }

        return res.status(200).json(data)
    })
}

export const updateTask = (req, res) => {
    const taskId = req.params.taskId;

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
            actual_budget = ?
            WHERE
            task_id = ?
            And is_deleted = 0`

    const values = [
        re.body.taskName,
        req.body.projectId,
        req.body.priority,
        req.body.taskDescription,
        req.body.plannedStartDate,
        req.body.plannedEndDate,
        req.body.plannedBudget,
        req.body.actualStartTime,
        req.body.actualEndTime,
        req.body.actualBudget,
        taskId
    ];

    db.query(query, values, (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows === 0) return res.status(400).json({ msg: "No matching record for updation" })
        return res.status(200).json({ message: "Task updated successfully" });
    })
}

export const deleteTask = (req, res) => {
    const query = `UPDATE task SET is_deleted = 1 WHERE task_id = ?`
    db.query(query, [req.params.taskId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows === 0) return res.status(400).json({ msg: "No data for deletion" })
        return res.status(200).json({ msg: "Task deleted successfully" })
    })
}

export const getPendingTaskCount = (req, res) => {
    const query = `SELECT
                    possible_priorities.Priority,
                    COALESCE(SUM(CASE WHEN task.status = 'pending' THEN 1 ELSE 0 END), 0) AS pending_count
                FROM
                    (SELECT 'High' AS Priority UNION SELECT 'Medium' UNION SELECT 'Low') AS possible_priorities
                LEFT JOIN
                    task ON possible_priorities.Priority = task.Priority
                        AND task.project_id = ?
                        AND task.is_deleted = 0
                WHERE
                    possible_priorities.Priority IN ('High', 'Medium', 'Low')
                GROUP BY
                    possible_priorities.Priority
                ORDER BY
                    FIELD(possible_priorities.Priority, 'High', 'Medium', 'Low')`
    db.query(query, [req.params.projectId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ msg: "No data found" })
        return res.status(200).json(data)
    })
}

export const getTaskIdAndName = (req, res) => {

    const q = "SELECT task_id,task_name FROM task";

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);

        if (data.length === 0) {
            return res.status(404).json({ msg: "No data found" });
        }

        return res.status(200).json(data)
    })
}
