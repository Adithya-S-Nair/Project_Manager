import { db } from '../connections/mysql.js';
import moment from 'moment';

export const createPersonalTask = (req, res) => {
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
        req.body.project_id,
        req.body.personal_task_name,
        req.body.Priority,
        req.body.personal_task_description,
        req.body.planned_start_date,
        req.body.planned_end_date,
        req.body.actual_start_time,
        req.body.actual_end_time,
        req.body.planned_budget,
        req.body.actual_budget,
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
    const { projectId } = req.params;

    const employeeQuery = `SELECT employee_id FROM employee WHERE user_account_id = ?`;

    db.query(employeeQuery, [req.userId], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error retrieving employee information" });
        }
        if (rows.length === 0) {
            return res.status(404).json({ error: "Employee not found for the given userId" });
        }

        const employeeId = rows[0].employee_id;

        const personalTaskQuery = `
        SELECT pt.*
        FROM personal_task pt
        INNER JOIN employee e ON pt.employee_id = e.employee_id
        INNER JOIN users u ON e.user_account_id = u.user_id
        WHERE pt.project_id = ? AND pt.employee_id = ?
    `;

        const countQuery = `
        SELECT COUNT(pt.personal_task_id) AS personal_task_count
        FROM personal_task pt
        INNER JOIN employee e ON pt.employee_id = e.employee_id
        INNER JOIN users u ON e.user_account_id = u.user_id
        WHERE pt.project_id = ? AND pt.employee_id = ?
    `;

        Promise.all([
            new Promise((resolve, reject) => {
                db.query(personalTaskQuery, [projectId, employeeId], (err, personalTasks) => {
                    if (err) reject(err);
                    resolve(personalTasks);

                    personalTasks.forEach(row => {
                        row.planned_start_date = moment(row.planned_start_date).format('YYYY-MM-DD');
                        row.planned_end_date = moment(row.planned_end_date).format('YYYY-MM-DD');
                        row.actual_start_time = moment(row.actual_start_time).format('YYYY-MM-DD');
                        row.actual_end_time = moment(row.actual_end_time).format('YYYY-MM-DD');
                    });
                });
            }),
            new Promise((resolve, reject) => {
                db.query(countQuery, [projectId, employeeId], (err, counts) => {
                    if (err) reject(err);
                    resolve(counts[0].personal_task_count);
                });
            })
        ])
            .then(([personalTasks, personalTaskCount]) => {
                if (personalTasks.length === 0) {
                    return res.status(404).json({ msg: "No personal subtasks found for the project" });
                }
                return res.status(200).json({ personalTasks, personalTaskCount });
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                return res.status(500).json({ error: "Internal server error" });
            });
    });
};

export const getPersonalTask = (req, res) => {
    const { personalTaskId } = req.params;
    const query = `SELECT * FROM personal_task WHERE personal_task_id = ?`;

    db.query(query, [personalTaskId], (err, data) => {
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

export const getPersonalTaskIdAndName = (req, res) => {
    const q = "SELECT personal_task_id,personal_task_name FROM personal_task";

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);

        if (data.length === 0) {
            return res.status(404).json({ msg: "No data found" });
        }

        return res.status(200).json(data)
    })
}

export const getPersonalTaskNameById = (req,res) =>{
    // console.log(req.body);
    const personalTaskIds = req.body;
    // console.log(taskIds);
    const promises = personalTaskIds.map((personalTaskId) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT personal_task_id, personal_task_name from personal_task where personal_task_id = ?`;
            db.query(query, personalTaskId, (err, data) => {
                if (err) return reject(err);

                if (data.length === 0) {
                    return reject({ msg: `No personal task name found for personal task ID ${personalTaskId}` });
                }

                resolve(data[0]); 
            });
        });
    });

    // Wait for all promises to resolve
    Promise.all(promises)
        .then((personalTaskNames) => {
            res.status(200).json(personalTaskNames);
        })
        .catch((error) => {
            res.status(500).json(error); // Send an error response if any query fails
        });
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
        req.body.personal_task_name,
        req.body.Priority,
        req.body.personal_task_description,
        moment(req.body.planned_start_date).format('YYYY-MM-DD'),
        moment(req.body.planned_end_date).format('YYYY-MM-DD'),
        moment(req.body.actual_start_time).format('YYYY-MM-DD'),
        moment(req.body.actual_end_time).format('YYYY-MM-DD'),
        req.body.planned_budget,
        req.body.actual_budget,
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

export const getPriorityPersonalTaskCount = (req, res) => {
    const query = `
        SELECT
            possible_priorities.Priority,
            COALESCE(COUNT(personal_task.personal_task_id), 0) AS task_count
        FROM
            (SELECT 'High' AS Priority UNION SELECT 'Medium' UNION SELECT 'Low') AS possible_priorities
        LEFT JOIN
            (SELECT pt.Priority, pt.personal_task_id
            FROM personal_task pt
            INNER JOIN employee e ON pt.employee_id = e.employee_id
            WHERE pt.project_id = ?
            AND pt.is_deleted = 0
            AND e.user_account_id = ?) AS personal_task
        ON possible_priorities.Priority = personal_task.Priority
        WHERE
            possible_priorities.Priority IN ('High', 'Medium', 'Low')
        GROUP BY
            possible_priorities.Priority
        ORDER BY
            FIELD(possible_priorities.Priority, 'Low', 'Medium', 'High');
    `;

    db.query(query, [req.params.projectId, req.userId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ msg: "No data found" });
        return res.status(200).json(data);
    });
}

export const getPendingPriorityBasedPersonalTaskCount = (req, res) => {

    const query = `
        SELECT
            possible_priorities.Priority,
            COALESCE(SUM(CASE WHEN personal_task.status = 'pending' THEN 1 ELSE 0 END), 0) AS pending_count
        FROM
            (SELECT 'High' AS Priority UNION SELECT 'Medium' UNION SELECT 'Low') AS possible_priorities
        LEFT JOIN
            (SELECT pt.Priority, pt.status
            FROM personal_task pt
            INNER JOIN employee e ON pt.employee_id = e.employee_id
            INNER JOIN users u ON e.user_account_id = u.user_id
            WHERE pt.project_id = ?
            AND pt.is_deleted = 0
            AND u.user_id = ?) AS personal_task
        ON possible_priorities.Priority = personal_task.Priority
        WHERE
            possible_priorities.Priority IN ('High', 'Medium', 'Low')
        GROUP BY
            possible_priorities.Priority
        ORDER BY
            FIELD(possible_priorities.Priority, 'Low', 'Medium', 'High');
    `;

    db.query(query, [req.params.projectId, req.userId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ msg: "No data found" });
        return res.status(200).json(data);
    });
}

export const getTotalPendingPersonalTaskCount = (req, res) => {

    const query = `
        SELECT COUNT(personal_task.status) AS pending_task_count
        FROM personal_task
        INNER JOIN employee ON personal_task.employee_id = employee.employee_id
        INNER JOIN users ON employee.user_account_id = users.user_id
        WHERE personal_task.status = 'pending'
            AND personal_task.project_id = ?
            AND personal_task.is_deleted = 0
            AND users.user_id = ?
    `;

    db.query(query, [req.params.projectId, req.userId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ msg: "No data found" });
        return res.status(200).json(data[0]);
    });
}