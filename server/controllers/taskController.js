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
                    t.task_id,
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
                WHERE
                    t.project_id = ?
                    AND
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

export const getProjectTasks = (req, res) => {
    const projectId = req.params.projectId;

    // Query to fetch all task information
    const taskQuery = `SELECT * FROM task WHERE project_id = ? AND is_deleted = 0`;

    // Query to fetch count of all tasks
    const countQuery = `SELECT COUNT(*) AS task_count FROM task WHERE project_id = ? AND is_deleted = 0`;

    // Execute both queries in parallel using Promise.all
    Promise.all([
        new Promise((resolve, reject) => {
            db.query(taskQuery, [projectId], (err, tasks) => {
                if (err) reject(err);
                resolve(tasks);

                tasks.forEach(row => {
                    row.planned_start_date = moment(row.planned_start_date).format('YYYY-MM-DD');
                    row.planned_end_date = moment(row.planned_end_date).format('YYYY-MM-DD');
                    row.actual_start_time = moment(row.actual_start_time).format('YYYY-MM-DD');
                    row.actual_end_time = moment(row.actual_end_time).format('YYYY-MM-DD');
                });
            });
        }),
        new Promise((resolve, reject) => {
            db.query(countQuery, [projectId], (err, counts) => {
                if (err) reject(err);
                resolve(counts[0].task_count); // Extract task count from the result
            });
        })
    ])
        .then(([tasks, taskCount]) => {
            if (tasks.length === 0) {
                return res.status(404).json({ msg: "No tasks found for the project" });
            }

            return res.status(200).json({ tasks, taskCount });
        })
        .catch(err => {
            console.error("Error fetching data:", err);
            return res.status(500).json({ error: "Internal server error" });
        });
}

export const updateTask = (req, res) => {
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

export const deleteTask = (req, res) => {
    const query = `UPDATE task SET is_deleted = 1 WHERE task_id = ?`
    db.query(query, [req.params.taskId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows === 0) return res.status(400).json({ msg: "No data for deletion" })
        return res.status(200).json({ msg: "Task deleted successfully" })
    })
}

export const getPriorityTaskCount = (req, res) => {
    const query = `SELECT
                   possible_priorities.Priority,
                   COALESCE(COUNT(task_id), 0) AS task_count
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
                   FIELD(possible_priorities.Priority, 'Low', 'Medium', 'High');`
    db.query(query, [req.params.projectId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ msg: "No data found" })
        return res.status(200).json(data)
    })
}

export const getPendingTaskCount = (req, res) => {
    const query = `
                    SELECT
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
                        FIELD(possible_priorities.Priority, 'Low', 'Medium', 'High');`

    const query1 = `SELECT COUNT(priority) AS pending_subtask_count from subtask where priority = 'pending' AND project_id = ?`;
    db.query(query, [req.params.projectId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ msg: "No data found" })
        return res.status(200).json(data)
    })
}

// export const getTotalTaskCount = (req,res) =>{
//     const query = `SELECT COUNT(task_id) AS pending_task_count from task WHERE project_id = ?`;

//     db.query(query, [req.params.projectId], (err, data) => {
//         if (err) return res.status(500).json(err);
//         if (data.length === 0) return res.status(404).json({ msg: "No data found" })
//         return res.status(200).json(data[0])
//     })
// }

export const getTotalPendingTaskCount = (req, res) => {
    const query = `SELECT COUNT(status) AS pending_task_count from task where status = 'pending' AND project_id = ? AND is_deleted = 0`;

    db.query(query, [req.params.projectId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ msg: "No data found" })
        return res.status(200).json(data[0])
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

export const getProjectPriorityBasedTask = (req, res) => {
    const { projectId, priority } = req.params;

    const query = ' SELECT * FROM task WHERE project_id = ? AND Priority = ? AND is_deleted = 0';
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

export const getProjectTaskById = (req, res) => {
    const { projectId } = req.params;

    const query = `SELECT * FROM task where project_id = ?`;

    db.query(query, projectId, (err, data) => {
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

export const getUserTasksById = (req, res) => {
    const { projectId, userId } = req.params;

    const values = [
        projectId,
        userId
    ]
    // console.log(userId);
    const query = `
    SELECT distinct project.project_id, task.*
    FROM task
    inner join project 
    on task.project_id = project.project_id  
    INNER JOIN assigned
    ON task.task_id = assigned.task_id  
    INNER JOIN employee
    ON assigned.employee_id = employee.employee_id
    INNER JOIN users
    ON employee.user_account_id = users.user_id  
    WHERE users.user_id = ?`;

    db.query(query, req.params.userId, (err, data) => {
        if (err) return res.status(500).json(err);

        if (data.length === 0) {
            return res.status(404).json({ msg: "No data found" });
        }

        const result = data.map(row => {
            const { project_id, ...rest } = row;
            return rest;
        });

        result.forEach(row => {
            row.planned_start_date = moment(row.planned_start_date).format('YYYY-MM-DD');
            row.planned_end_date = moment(row.planned_end_date).format('YYYY-MM-DD');
            row.actual_start_time = moment(row.actual_start_time).format('YYYY-MM-DD');
            row.actual_end_time = moment(row.actual_end_time).format('YYYY-MM-DD');
        });

        return res.status(200).json(result);
    });
}

export const getUserProjectPriorityBasedTask = (req, res) => {
    const { projectId, priority, userId } = req.params;

    const query = ` SELECT DISTINCT task.task_id, task.* FROM task 
    INNER JOIN project 
    on task.project_id = project.project_id  
    INNER JOIN assigned
    ON task.task_id = assigned.task_id  
    INNER JOIN employee
    ON assigned.employee_id = employee.employee_id
    INNER JOIN users
    ON employee.user_account_id = users.user_id  
    WHERE project.project_id = ? AND Priority = ? AND users.user_id = ? AND is_deleted = 0`;
    const value = [projectId, priority, userId];
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

export const getUserPriorityTaskCount = (req, res) => {
    const query = `
        SELECT
            possible_priorities.Priority,
            COALESCE(COUNT(DISTINCT assigned.task_id), 0) AS task_count
        FROM
            (SELECT 'High' AS Priority UNION SELECT 'Medium' UNION SELECT 'Low') AS possible_priorities
        LEFT JOIN
            (SELECT task.Priority, assigned.task_id
            FROM task
            INNER JOIN assigned ON task.task_id = assigned.task_id
            INNER JOIN employee ON assigned.employee_id = employee.employee_id
            INNER JOIN users ON employee.user_account_id = users.user_id
            WHERE task.project_id = ?
            AND task.is_deleted = 0
            AND users.user_id = ?) AS assigned
        ON possible_priorities.Priority = assigned.Priority
        WHERE
            possible_priorities.Priority IN ('High', 'Medium', 'Low')
        GROUP BY
            possible_priorities.Priority
        ORDER BY
            FIELD(possible_priorities.Priority, 'Low', 'Medium', 'High');
    `;
    db.query(query, [req.params.projectId, req.params.userId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ msg: "No data found" })
        return res.status(200).json(data)
    })
}

export const getUserPendingTaskCount = (req, res) => {
    const query = `
    SELECT
    possible_priorities.Priority,
    COALESCE(SUM(CASE WHEN task.status = 'pending' THEN 1 ELSE 0 END), 0) AS pending_count
FROM
    (SELECT 'High' AS Priority UNION SELECT 'Medium' UNION SELECT 'Low') AS possible_priorities
LEFT JOIN
    (SELECT task.Priority,task.status
    FROM task
    INNER JOIN assigned ON task.task_id = assigned.task_id
    INNER JOIN employee ON assigned.employee_id = employee.employee_id
    INNER JOIN users ON employee.user_account_id = users.user_id
    WHERE task.project_id = ?
    AND task.is_deleted = 0
    AND users.user_id = ?) AS task
ON possible_priorities.Priority = task.Priority
WHERE
    possible_priorities.Priority IN ('High', 'Medium', 'Low')
GROUP BY
    possible_priorities.Priority
ORDER BY
    FIELD(possible_priorities.Priority, 'Low', 'Medium', 'High')
    `;

    db.query(query, [req.params.projectId, req.params.userId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ msg: "No data found" });
        return res.status(200).json(data);
    });
};

export const getUserTotalPendingTaskCount = (req, res) => {
    const query = `
    SELECT
    COUNT(*) AS total_pending_tasks
FROM
    task
INNER JOIN
    assigned ON task.task_id = assigned.task_id
INNER JOIN
    employee ON assigned.employee_id = employee.employee_id
WHERE
    employee.user_account_id = ?
    AND task.status = 'pending';
    `;

    db.query(query, [req.params.projectId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ msg: "No data found" })
        return res.status(200).json(data[0])
    })
}

export const getUserProjectTasks = (req,res) =>{
    const projectId = req.params.projectId;
    const userId = req.params.userId; 

    const taskQuery = `
        SELECT DISTINCT t.task_id,t.*
        FROM task t
        INNER JOIN assigned a ON t.task_id = a.task_id
        INNER JOIN employee e ON a.employee_id = e.employee_id
        INNER JOIN users u ON e.user_account_id = u.user_id
        WHERE t.project_id = ? AND t.is_deleted = 0 AND u.user_id = ?
    `;

    const countQuery = `
        SELECT COUNT(DISTINCT(t.task_id)) AS task_count
        FROM task t
        INNER JOIN assigned a ON t.task_id = a.task_id
        INNER JOIN employee e ON a.employee_id = e.employee_id
        INNER JOIN users u ON e.user_account_id = u.user_id
        WHERE t.project_id = ? AND t.is_deleted = 0 AND u.user_id = ?
    `;

    Promise.all([
        new Promise((resolve, reject) => {
            db.query(taskQuery, [projectId, userId], (err, tasks) => {
                if (err) reject(err);
                resolve(tasks.map(row => ({
                    ...row,
                    planned_start_date: moment(row.planned_start_date).format('YYYY-MM-DD'),
                    planned_end_date: moment(row.planned_end_date).format('YYYY-MM-DD'),
                    actual_start_time: moment(row.actual_start_time).format('YYYY-MM-DD'),
                    actual_end_time: moment(row.actual_end_time).format('YYYY-MM-DD')
                })));
            });
        }),
        new Promise((resolve, reject) => {
            db.query(countQuery, [projectId, userId], (err, counts) => {
                if (err) reject(err);
                resolve(counts[0].task_count); 
            });
        })
    ])
        .then(([tasks, taskCount]) => {
            if (tasks.length === 0) {
                return res.status(404).json({ msg: "No tasks found for the project" });
            }

            return res.status(200).json({ tasks, taskCount });
        })
        .catch(err => {
            console.error("Error fetching data:", err);
            return res.status(500).json({ error: "Internal server error" });
        });

}