import { db } from '../connections/mysql.js';
import moment from 'moment';

export const createPersonalSubtask = (req, res) => {
    const {
        personalsubtask_name,
        personal_task_id,
        project_id,
        Priority,
        personalsubtask_description,
        planned_start_date,
        planned_end_date,
        planned_budget,
        actual_start_time,
        actual_end_time,
        actual_budget,
        status,
    } = req.body;

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

        const query = `
            INSERT INTO personalsubtask (
                personalsubtask_name,
                personal_task_id,
                project_id,
                Priority,
                personalsubtask_description,
                planned_start_date,
                planned_end_date,
                planned_budget,
                actual_start_time,
                actual_end_time,
                actual_budget,
                status,
                employee_id 
            ) VALUES (?)`;

        const values = [
            personalsubtask_name,
            personal_task_id,
            project_id,
            Priority,
            personalsubtask_description,
            moment(planned_start_date).format('YYYY-MM-DD'),
            moment(planned_end_date).format('YYYY-MM-DD'),
            planned_budget,
            moment(actual_start_time).format('YYYY-MM-DD'),
            moment(actual_end_time).format('YYYY-MM-DD'),
            actual_budget,
            status,
            employeeId
        ];

        db.query(query, [values], (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error creating personal subtask" });
            }
            return res.status(201).json({ message: "Personal subtask created successfully" });
        });
    });
};


export const deletePersonalSubtasks = (req, res) => {
    const personalsubtaskIds = req.params.personalSubtaskIds.split(',');
    console.log("personalsubtaskId is:" + personalsubtaskIds);
    if (!Array.isArray(personalsubtaskIds) || personalsubtaskIds.length === 0) {
        return res.status(400).json({ error: 'Invalid personal subtask IDs provided' });
    }

    const query = `UPDATE personalsubtask 
        SET is_deleted = 1
        WHERE personalsubtask_id IN (?)`;

    db.query(query, [personalsubtaskIds], (error, results) => {
        if (error) {
            console.error('Error deleting personal subtasks:', error);
            return res.status(500).json({ error: 'An error occurred while deleting personal subtasks' });
        }

        res.status(200).json({ message: 'Personal subtasks deleted successfully' });
    });
}

export const updatePersonalSubtaskById = (req, res) => {
    const { personalsubtaskId } = req.params;
    const {
        personalsubtaskName,
        personalsubtaskDescription,
        priority,
        plannedStartDate,
        plannedEndDate,
        plannedBudget,
        actualStartTime,
        actualEndTime,
        actualBudget,
        status
    } = req.body;

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

        const query = `
        UPDATE personalsubtask
        SET 
            personalsubtask_name = ?,
            personalsubtask_description = ?,
            Priority = ?,
            planned_start_date = ?,
            planned_end_date = ?,
            planned_budget = ?,
            actual_start_time = ?,
            actual_end_time = ?,
            actual_budget = ?,
            status = ?,
            employee_id = ?
        WHERE personalsubtask_id = ?`;

        const values = [
            personalsubtaskName,
            personalsubtaskDescription,
            priority,
            moment(plannedStartDate).format('YYYY-MM-DD'),
            moment(plannedEndDate).format('YYYY-MM-DD'),
            plannedBudget,
            moment(actualStartTime).format('YYYY-MM-DD'),
            moment(actualEndTime).format('YYYY-MM-DD'),
            actualBudget,
            status,
            employeeId,
            personalsubtaskId
        ];

        db.query(query, values, (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error updating personal subtask" });
            }
            return res.status(200).json({ message: "Personal subtask updated successfully" });
        });
    });
}

export const getAllPersonalSubtask = (req, res) => {
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

        const personalSubtaskQuery = `
        SELECT ps.*
        FROM personalsubtask ps
        INNER JOIN employee e ON ps.employee_id = e.employee_id
        INNER JOIN users u ON e.user_account_id = u.user_id
        WHERE ps.project_id = ? AND ps.employee_id = ? AND ps.is_deleted = 0
    `;

        const countQuery = `
        SELECT COUNT(ps.personalsubtask_id) AS personal_subtask_count
        FROM personalsubtask ps
        INNER JOIN employee e ON ps.employee_id = e.employee_id
        INNER JOIN users u ON e.user_account_id = u.user_id
        WHERE ps.project_id = ? AND ps.employee_id = ? AND ps.is_deleted = 0
    `;

        Promise.all([
            new Promise((resolve, reject) => {
                db.query(personalSubtaskQuery, [projectId, employeeId], (err, personalSubtasks) => {
                    if (err) reject(err);
                    resolve(personalSubtasks);

                    personalSubtasks.forEach(row => {
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
                    resolve(counts[0].personal_subtask_count);
                });
            })
        ])
            .then(([personalSubtasks, personalSubtaskCount]) => {
                if (personalSubtasks.length === 0) {
                    return res.status(404).json({ msg: "No personal subtasks found for the project" });
                }
                return res.status(200).json({ personalSubtasks, personalSubtaskCount });
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                return res.status(500).json({ error: "Internal server error" });
            });
    });
};

export const getProjectPriorityBasedPersonalSubtask = (req, res) => {
    const { projectId, priority } = req.params;

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

        const query = `
        SELECT ps.*
        FROM personalsubtask ps
        INNER JOIN employee e ON ps.employee_id = e.employee_id
        INNER JOIN users u ON e.user_account_id = u.user_id
        WHERE ps.project_id = ? AND ps.Priority = ? AND ps.is_deleted = 0 AND ps.employee_id =?
    `;
        const values = [projectId, priority, employeeId];

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
    });
}

export const getPriorityPersonalSubtaskCount = (req, res) => {
    const query = `
        SELECT
            possible_priorities.Priority,
            COALESCE(COUNT(personalsubtask.personalsubtask_id), 0) AS subtask_count
        FROM
            (SELECT 'High' AS Priority UNION SELECT 'Medium' UNION SELECT 'Low') AS possible_priorities
        LEFT JOIN
            (SELECT ps.Priority, ps.personalsubtask_id
            FROM personalsubtask ps
            INNER JOIN employee e ON ps.employee_id = e.employee_id
            WHERE ps.project_id = ?
            AND ps.is_deleted = 0
            AND e.user_account_id = ?) AS personalsubtask
        ON possible_priorities.Priority = personalsubtask.Priority
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

export const getPendingPriorityBasedPersonalSubtaskCount = (req, res) => {
    const userId = req.userId; // Assuming userId is available from checkAuth middleware

    const query = `
        SELECT
            possible_priorities.Priority,
            COALESCE(SUM(CASE WHEN personalsubtask.status = 'pending' THEN 1 ELSE 0 END), 0) AS pending_count
        FROM
            (SELECT 'High' AS Priority UNION SELECT 'Medium' UNION SELECT 'Low') AS possible_priorities
        LEFT JOIN
            (SELECT ps.Priority, ps.status
            FROM personalsubtask ps
            INNER JOIN employee e ON ps.employee_id = e.employee_id
            INNER JOIN users u ON e.user_account_id = u.user_id
            WHERE ps.project_id = ?
            AND ps.is_deleted = 0
            AND u.user_id = ?) AS personalsubtask
        ON possible_priorities.Priority = personalsubtask.Priority
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
}

export const getTotalPendingPersonalSubtaskCount = (req, res) => {
    const userId = req.params.userId;

    const query = `
        SELECT COUNT(personalsubtask.status) AS pending_subtask_count
        FROM personalsubtask
        INNER JOIN employee ON personalsubtask.employee_id = employee.employee_id
        INNER JOIN users ON employee.user_account_id = users.user_id
        WHERE personalsubtask.status = 'pending'
            AND personalsubtask.project_id = ?
            AND personalsubtask.is_deleted = 0
            AND users.user_id = ?
    `;

    db.query(query, [req.params.projectId, req.userId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ msg: "No data found" });
        return res.status(200).json(data[0]);
    });
}