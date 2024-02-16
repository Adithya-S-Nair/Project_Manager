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
    const query = `SELECT
                t.task_id ,
                t.task_name,
                t.project_id,
                t.Priority,
                t.task_description,
                t.planned_start_date,
                t.planned_end_date,
                t.planned_budget,
                t.actual_start_time,
                t.actual_end_time,
                t.actual_budget,
                t.status,
                e.employee_name
                FROM
                task t
                LEFT JOIN
                assigned a ON t.task_id = a.task_id
                LEFT JOIN
                employee e ON a.employee_id = e.employee_id
                LEFT JOIN
                users u ON e.user_account_id = u.user_id
                WHERE
                t.is_deleted = 0`

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

    if (req.body.employee_name) {
        const employeeName = req.body.employee_name;

        const existingAssignment = db.query('SELECT * FROM assigned WHERE task_id = ?', [taskId]);

        if (existingAssignment.length > 0) {
            db.query('UPDATE assigned SET employee_id = (SELECT employee_id FROM employee WHERE employee_name = ?) WHERE task_id = ?', [employeeName, taskId]);
        } else {
            db.query('INSERT INTO assigned (project_id, task_id, employee_id) VALUES (?, ?, (SELECT employee_id FROM employee WHERE employee_name = ?))',
                [req.body.project_id, taskId, employeeName]); // replace projectId and roleId with the appropriate values
        }
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

// export const getTaskNameById = (req, res) => {
//     const taskIds = req.body;
//     const taskNames = taskIds.map((taskId) => {
//         const query = `SELECT task_id,task_name from task where task_id = ?`;
//         db.query(query, taskId, (err, data) => {
//             if (err) return res.status(500).json(err);

//             if (data.length === 0) {
//                 return res.status(404).json({ msg: "No task name found" });
//             }

//             return res.status(200).json(data)
//         })

//     })
// }

export const getTaskNameById = (req, res) => {
    console.log(req.body);
    const taskIds = req.body;
    console.log(taskIds);
    const promises = taskIds.map((taskId) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT task_id, task_name from task where task_id = ?`;
            db.query(query, taskId, (err, data) => {
                if (err) return reject(err);

                if (data.length === 0) {
                    return reject({ msg: `No task name found for task ID ${taskId}` });
                }

                resolve(data[0]); // Resolve with the task name
            });
        });
    });

    // Wait for all promises to resolve
    Promise.all(promises)
        .then((taskNames) => {
            res.status(200).json(taskNames);
        })
        .catch((error) => {
            res.status(500).json(error); // Send an error response if any query fails
        });
};

export const getTask = (req, res) => {
    const { taskId } = req.params;
    const query = `SELECT * FROM task WHERE task_id = ?`;

    db.query(query, [taskId], (err, data) => {
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

        return res.status(200).json(data[0])
    })
}

export const deleteMultipleTask = (req, res) => {
    const taskIds = req.params.taskIds.split(',');
    console.log("taskId is:" + taskIds);
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
        return res.status(400).json({ error: 'Invalid task IDs provided' });
    }

    const query = `UPDATE task 
        SET is_deleted = 1
        WHERE task_id IN (?)`;

    db.query(query, [taskIds], (error, results) => {
        if (error) {
            console.error('Error deleting tasks:', error);
            return res.status(500).json({ error: 'An error occurred while deleting tasks' });
        }

        res.status(200).json({ message: 'Tasks deleted successfully' });
    });
};
