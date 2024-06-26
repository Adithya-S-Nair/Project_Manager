import { db } from '../connections/mysql.js';
import moment from 'moment';

export const createNewSubtask = (req, res) => {

    console.log(req.body.projectId);
    const {
        subtaskName,
        projectId,
        taskId,
        priority,
        subtaskDescription,
        plannedStartDate,
        plannedEndDate,
        plannedBudget,
        actualStartTime,
        actualEndTime,
        actualBudget,
        status
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
            actual_budget,
            project_id,
            status
        ) VALUES (?)`

    const values = [
        subtaskName,
        taskId,
        priority,
        subtaskDescription,
        moment(plannedStartDate).format('YYYY-MM-DD'),
        moment(plannedEndDate).format('YYYY-MM-DD'),
        plannedBudget,
        moment(actualStartTime).format('YYYY-MM-DD'),
        moment(actualEndTime).format('YYYY-MM-DD'),
        actualBudget,
        projectId,
        status
    ]

    db.query(query, [values], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error creating subtask" });
        }
        return res.status(201).json({ message: "Subask created successfully" });
    })
}

export const getSubtasksByProjectId = (req, res) => {
    const query = `SELECT 
                        subtask.*,
                        employee.employee_name AS assigned_employee_name
                    FROM 
                        subtask
                    JOIN 
                        task ON subtask.task_id = task.task_id
                    JOIN 
                        project ON task.project_id = project.project_id
                    LEFT JOIN 
                        assigned ON subtask.subtask_id = assigned.subtask_id
                    LEFT JOIN 
                        employee ON assigned.employee_id = employee.employee_id
                    WHERE 
                        project.project_id = 1
                        AND subtask.is_deleted = 0`
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
    const subtaskId = req.params.subtaskId;
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

export const getPrioritySubtaskCount = (req, res) => {
    const query = `SELECT
                   possible_priorities.Priority,
                   COALESCE(COUNT(subtask_id), 0) AS subtask_count
                   FROM
                   (SELECT 'High' AS Priority UNION SELECT 'Medium' UNION SELECT 'Low') AS possible_priorities
                   LEFT JOIN
                   subtask ON possible_priorities.Priority = subtask.Priority
                   AND subtask.project_id = ?
                   AND subtask.is_deleted = 0
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

export const getPendingSubtaskCount = (req, res) => {
    const query = `SELECT
                   possible_priorities.Priority,
                   COALESCE(SUM(CASE WHEN subtask.status = 'pending' THEN 1 ELSE 0 END), 0) AS pending_count
                   FROM
                   (SELECT 'High' AS Priority UNION SELECT 'Medium' UNION SELECT 'Low') AS possible_priorities
                   LEFT JOIN
                   subtask ON possible_priorities.Priority = subtask.Priority
                   AND subtask.project_id = ?
                   AND subtask.is_deleted = 0
                   WHERE
                   possible_priorities.Priority IN ('High', 'Medium', 'Low')
                   GROUP BY
                   possible_priorities.Priority
                   ORDER BY
                   FIELD(possible_priorities.Priority, 'Low', 'Medium', 'High')`

    db.query(query, [req.params.projectId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ msg: "No data found" })
        return res.status(200).json(data)
    })
}

export const getTotalPendingSubtaskCount = (req, res) => {
  
        const query = `SELECT COUNT(status) AS pending_subtask_count from subtask where status = 'pending' AND project_id = ? AND is_deleted = 0`;

        db.query(query, [req.params.projectId], (err, data) => {
            if (err) return res.status(500).json(err);
            if (data.length === 0) return res.status(404).json({ msg: "No data found" })
            return res.status(200).json(data[0])
        })

}

export const getSubtaskNameById = (req, res) => {
    const subtaskIds = req.body;
    console.log(req.body);
    // console.log(subtaskIds);
    const promises = subtaskIds.map((subtaskId) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT subtask_id, subtask_name from subtask where subtask_id = ?`;
            db.query(query, subtaskId, (err, data) => {
                if (err) return reject(err);

                if (data.length === 0) {
                    return reject({ msg: `No task name found for task ID ${subtaskId}` });
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
}

export const getSubtaskById = (req, res) => {
    const { subtaskId } = req.params;
    const query = `SELECT * FROM subtask WHERE subtask_id = ?`;

    db.query(query, [subtaskId], (err, data) => {
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

export const updateSubtaskById = (req, res) => {

    const subtaskId = req.params.subtaskId;

    if (req.body.assigned_employee_name) {
        const employeeName = req.body.assigned_employee_name;
        console.log(`employee name - ${employeeName}`);
        db.query('SELECT * FROM assigned WHERE subtask_id = ?', [subtaskId], (err, existingAssignment) => {
            console.log(existingAssignment.length);
            if (existingAssignment.length > 0) {
                db.query('UPDATE assigned SET employee_id = (SELECT employee_id FROM employee WHERE employee_name = ?) WHERE subtask_id = ?', [employeeName, subtaskId]);
            } else {
                db.query('INSERT INTO assigned (subtask_id, employee_id, project_id) VALUES (?, (SELECT employee_id FROM employee WHERE employee_name = ?), ?)',
                    [subtaskId, employeeName, req.body.project_id]); // replace projectId and roleId with the appropriate values
            }
        });
    } 

    console.log(subtaskId);
    console.log(req.body);
    const query = `
            UPDATE subtask
            SET
            subtask_name = ?,
            project_id = ?,
            task_id = ?,
            Priority = ?,
            subtask_description = ?,
            planned_start_date = ?,
            planned_end_date = ?,
            planned_budget = ?,
            actual_start_time = ?,
            actual_end_time = ?,
            actual_budget = ?,
            status = ?
            WHERE
            subtask_id = ?
            AND is_deleted = 0`

    const values = [
        req.body.subtask_name,
        req.body.project_id,
        req.body.task_id,
        req.body.Priority,
        req.body.subtask_description,
        moment(req.body.planned_start_date).format('YYYY-MM-DD'),
        moment(req.body.planned_end_date).format('YYYY-MM-DD'),
        req.body.planned_budget,
        moment(req.body.actual_start_time).format('YYYY-MM-DD'),
        moment(req.body.actual_end_time).format('YYYY-MM-DD'),
        req.body.actual_budget,
        req.body.status,
        subtaskId
    ];

    db.query(query, values, (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows === 0) return res.status(400).json({ msg: "No matching record for updation" })
        return res.status(200).json({ message: "Subtask updated successfully" });
    })
}

export const deleteMultipleSubtask = (req, res) => {
    const subtaskIds = req.params.subtaskIds.split(',');
    console.log("subtaskId is:" + subtaskIds);
    if (!Array.isArray(subtaskIds) || subtaskIds.length === 0) {
        return res.status(400).json({ error: 'Invalid task IDs provided' });
    }

    const query = `UPDATE subtask 
        SET is_deleted = 1
        WHERE subtask_id IN (?)`;

    db.query(query, [subtaskIds], (error, results) => {
        if (error) {
            console.error('Error deleting subtasks:', error);
            return res.status(500).json({ error: 'An error occurred while deleting subtasks' });
        }

        res.status(200).json({ message: 'Subtasks deleted successfully' });
    });
}

export const getProjectSubtasks = (req, res) => {
    const { projectId } = req.params;

    // Query to fetch all task information
    const subtaskQuery = `SELECT * FROM subtask WHERE project_id = ?`;

    // Query to fetch count of all tasks
    const countQuery = `SELECT COUNT(*) AS subtask_count FROM subtask WHERE project_id = ?`;

    // Execute both queries in parallel using Promise.all
    Promise.all([
        new Promise((resolve, reject) => {
            db.query(subtaskQuery, [projectId], (err, subtasks) => {
                if (err) reject(err);
                resolve(subtasks);
            });
        }),
        new Promise((resolve, reject) => {
            db.query(countQuery, [projectId], (err, counts) => {
                if (err) reject(err);
                resolve(counts[0].subtask_count); // Extract task count from the result
            });
        })
    ])
        .then(([subtasks, subtaskCount]) => {
            if (subtasks.length === 0) {
                return res.status(404).json({ msg: "No tasks found for the project" });
            }
            return res.status(200).json({ subtasks, subtaskCount });
        })
        .catch(err => {
            console.error("Error fetching data:", err);
            return res.status(500).json({ error: "Internal server error" });
        });
}

export const getProjectSubtaskByProjectId = (req, res) => {
    const { projectId } = req.params;

    const query = `SELECT * FROM subtask where project_id = ? AND is_deleted = 0`;

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

export const getProjectPriorityBasedSubtask = (req, res) => {
    const { projectId, priority } = req.params;

    const query = ' SELECT * FROM subtask WHERE project_id = ? AND Priority = ? AND is_deleted = 0';
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

export const getUserProjectSubtasks = (req, res) => {
    const { projectId, userId } = req.params; 

    const subtaskQuery = `
        SELECT s.*
        FROM subtask s
        INNER JOIN assigned a ON s.subtask_id = a.subtask_id
        INNER JOIN employee e ON a.employee_id = e.employee_id
        INNER JOIN users u ON e.user_account_id = u.user_id
        WHERE s.project_id = ? AND u.user_id = ?
    `;

    const countQuery = `
        SELECT COUNT(s.subtask_id) AS subtask_count
        FROM subtask s
        INNER JOIN assigned a ON s.subtask_id = a.subtask_id
        INNER JOIN employee e ON a.employee_id = e.employee_id
        INNER JOIN users u ON e.user_account_id = u.user_id
        WHERE s.project_id = ? AND u.user_id = ?
    `;

    Promise.all([
        new Promise((resolve, reject) => {
            db.query(subtaskQuery, [projectId, userId], (err, subtasks) => {
                if (err) reject(err);

                // Format dates for each subtask
                subtasks.forEach(row => {
                    row.planned_start_date = moment(row.planned_start_date).format('YYYY-MM-DD');
                    row.planned_end_date = moment(row.planned_end_date).format('YYYY-MM-DD');
                    row.actual_start_time = moment(row.actual_start_time).format('YYYY-MM-DD');
                    row.actual_end_time = moment(row.actual_end_time).format('YYYY-MM-DD');
                });

                resolve(subtasks);
            });
        }),
        new Promise((resolve, reject) => {
            db.query(countQuery, [projectId, userId], (err, counts) => {
                if (err) reject(err);
                resolve(counts[0].subtask_count); 
            });
        })
    ])
        .then(([subtasks, subtaskCount]) => {
            if (subtasks.length === 0) {
                return res.status(404).json({ msg: "No subtasks found for the project" });
            }
            return res.status(200).json({ subtasks, subtaskCount });
        })
        .catch(err => {
            console.error("Error fetching data:", err);
            return res.status(500).json({ error: "Internal server error" });
        });
}

export const getUserProjectPriorityBasedSubtask = (req, res) => {
    const { projectId, priority, userId } = req.params;

    const query = `
        SELECT s.*
        FROM subtask s
        INNER JOIN assigned a ON s.subtask_id = a.subtask_id
        INNER JOIN employee e ON a.employee_id = e.employee_id
        INNER JOIN users u ON e.user_account_id = u.user_id
        WHERE s.project_id = ? AND s.Priority = ? AND s.is_deleted = 0 AND u.user_id = ?
    `;
    const values = [projectId, priority, userId];

    db.query(query, values, (err, data) => {
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

        return res.status(200).json(data);
    });
};

export const getUserPrioritySubtaskCount = (req, res) => {
    const {userId} = req.params; 
    const query = `
        SELECT
            possible_priorities.Priority,
            COALESCE(COUNT(subtask.subtask_id), 0) AS subtask_count
        FROM
            (SELECT 'High' AS Priority UNION SELECT 'Medium' UNION SELECT 'Low') AS possible_priorities
        LEFT JOIN
            (SELECT sub.Priority, sub.subtask_id
            FROM subtask sub
            INNER JOIN assigned a ON sub.subtask_id = a.subtask_id
            INNER JOIN employee e ON a.employee_id = e.employee_id
            INNER JOIN users u ON e.user_account_id = u.user_id
            WHERE sub.project_id = ?
            AND sub.is_deleted = 0
            AND u.user_id = ?) AS subtask
        ON possible_priorities.Priority = subtask.Priority
        WHERE
            possible_priorities.Priority IN ('High', 'Medium', 'Low')
        GROUP BY
            possible_priorities.Priority
        ORDER BY
            FIELD(possible_priorities.Priority, 'Low', 'Medium', 'High');
    `;

    db.query(query, [req.params.projectId, userId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ msg: "No data found" });
        return res.status(200).json(data);
    });
};

export const getUserPendingSubtaskCount = (req, res) => {
    const userId = req.params.userId;

    const query = `
        SELECT
            possible_priorities.Priority,
            COALESCE(SUM(CASE WHEN subtask.status = 'pending' THEN 1 ELSE 0 END), 0) AS pending_count
        FROM
            (SELECT 'High' AS Priority UNION SELECT 'Medium' UNION SELECT 'Low') AS possible_priorities
        LEFT JOIN
            (SELECT sub.Priority, sub.status
            FROM subtask sub
            INNER JOIN assigned a ON sub.subtask_id = a.subtask_id
            INNER JOIN employee e ON a.employee_id = e.employee_id
            INNER JOIN users u ON e.user_account_id = u.user_id
            WHERE sub.project_id = ?
            AND sub.is_deleted = 0
            AND u.user_id = ?) AS subtask
        ON possible_priorities.Priority = subtask.Priority
        WHERE
            possible_priorities.Priority IN ('High', 'Medium', 'Low')
        GROUP BY
            possible_priorities.Priority
        ORDER BY
            FIELD(possible_priorities.Priority, 'Low', 'Medium', 'High');
    `;

    db.query(query, [req.params.projectId, userId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ msg: "No data found" });
        return res.status(200).json(data);
    });
};

export const getUserTotalPendingSubtaskCount = (req, res) => {
    const userId = req.params.userId;

    const query = `
        SELECT COUNT(subtask.status) AS pending_subtask_count
        FROM subtask
        INNER JOIN assigned ON subtask.subtask_id = assigned.subtask_id
        INNER JOIN employee ON assigned.employee_id = employee.employee_id
        INNER JOIN users ON employee.user_account_id = users.user_id
        WHERE subtask.status = 'pending'
            AND subtask.project_id = ?
            AND subtask.is_deleted = 0
            AND users.user_id = ?
    `;

    db.query(query, [req.params.projectId, userId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ msg: "No data found" });
        return res.status(200).json(data[0]);
    });
};
