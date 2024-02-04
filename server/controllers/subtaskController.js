import { db } from '../connections/mysql.js';

export const createNewSubtask = (req, res) => {
    const {
        subtaskName,
        taskId,
        priority,
        subtaskDescription,
        plannedStartDate,
        plannedEndDate,
        plannedBudget,
        actualStartTime,
        actualEndTime,
        actualBudget
    } = req.body;

    const query = `
        INSERT INTO subtask (
            subtask_name,
            task_id,
            Priority,
            subtask_description,
            planned_start_date,
            planned_end_date,
            planned_budget,
            actual_start_time,
            actual_end_time,
            actual_budget
        ) VALUES (?)`

    const values = [
        subtaskName,
        taskId,
        priority,
        subtaskDescription,
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

export const getSubtasksByProjectId = (req, res) => {
    const query = `SELECT subtask.*
                    FROM subtask
                    JOIN task ON subtask.task_id = task.task_id
                    JOIN project ON task.project_id = project.project_id
                    WHERE project.project_id = ?
                    AND subtask.is_deleted = 0;
                    `
    const value = [req.params.projectId]
    db.query(query, value, (err, data) => {
        if (err) return res.status(500).json(err);

        if (data.length === 0) {
            return res.status(404).json({ msg: "No data found" });
        }

        return res.status(200).json(data)
    })
}

export const updateSubtask = (req, res) => {
    const subtaskId = req.params.taskId;

    const query = `
        UPDATE subtask
        SET
        subtask_name = ?,
        task_id = ?,
        Priority = ?,
        subtask_description = ?,
        planned_start_date = ?,
        planned_end_date = ?,
        planned_budget = ?,
        actual_start_time = ?,
        actual_end_time = ?,
        actual_budget = ?
        WHERE
        subtask_id = ?
        And is_deleted = 0`

    const values = [
        req.body.subtaskName,
        req.body.taskId,
        req.body.priority,
        req.body.subtaskDescription,
        req.body.plannedStartDate,
        req.body.plannedEndDate,
        req.body.plannedBudget,
        req.body.actualStartTime,
        req.body.actualEndTime,
        req.body.actualBudget,
        subtaskId,
    ];

    db.query(query, values, (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows === 0) return res.status(400).json({ msg: "No matching record for updation" })
        return res.status(200).json({ message: "Subtask updated successfully" });
    })
}

export const deleteSubtask = (req, res) => {
    const query = `UPDATE subtask SET is_deleted = 1 WHERE subtask_id = ?`
    db.query(query, [req.params.subtaskId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows === 0) return res.status(400).json({ msg: "No data for deletion" })
        return res.status(200).json({ msg: "Task deleted successfully" })
    })
}