import { db } from '../connections/mysql.js';

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
        actualBudget } = req.body
    const query = `INSERT INTO task (task_name, project_id, priority, task_description, planned_start_date, planned_end_date, planned_budget, actual_start_time, actual_end_time, actual_budget)
                    VALUES (?)`
    const values = [
        taskName,
        projectId,
        priority,
        taskDescription,
        plannedStartDate,
        plannedEndDate,
        plannedBudget,
        actualStartTime,
        actualEndTime,
        actualBudget
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