import { db } from '../connections/mysql.js';

export const assignTask = (req, res) => {
    const { employeeId, taskNames } = req.body;
    const queries = [];
    for (const task of taskNames) {
        const sql = 'INSERT INTO assigned(employee_id, task_id) VALUES (?, ?)';
        const values = [employeeId, task.task_id];

        queries.push(new Promise((resolveQuery, rejectQuery) => {
            db.query(sql, values, (err, results) => {
                if (err) {
                    rejectQuery(err);
                } else {
                    resolveQuery(results);
                }
            });
        }));
    }
    Promise.all(queries)
        .then(() => {
            console.log('Task IDs inserted successfully.');
            res.status(200).json({ message: 'Task assigned successfully' });
        })
        .catch((error) => {
            console.error('Error inserting task IDs:', error.message);
            res.status(500).json({ error: 'Internal Server Error', message: error.message });
        });
};

export const assignSubtask = (req, res) => {
    const { employeeId, taskNames } = req.body;
    const queries = [];
    for (const task of taskNames) {
        const sql = 'INSERT INTO assigned(employee_id, subtask_id) VALUES (?, ?)';
        const values = [employeeId, task.subtask_id];

        queries.push(new Promise((resolveQuery, rejectQuery) => {
            db.query(sql, values, (err, results) => {
                if (err) {
                    rejectQuery(err);
                } else {
                    resolveQuery(results);
                }
            });
        }));
    }
    Promise.all(queries)
        .then(() => {
            console.log('Task IDs inserted successfully.');
            res.status(200).json({ message: 'Task assigned successfully' });
        })
        .catch((error) => {
            console.error('Error inserting task IDs:', error.message);
            res.status(500).json({ error: 'Internal Server Error', message: error.message });
        });
};

export const assignProject = (req, res) => {
    const { employeeId, projectId } = req.body;

    const query = `
    INSERT INTO assigned (employee_id, project_id) 
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE employee_id = VALUES(employee_id), project_id = VALUES(project_id);
    
`;
         
    db.query(query, [employeeId, projectId,employeeId, projectId], (err, data) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ msg: "Duplicate entry for employee_id and project_id" });
            } else {
                return res.status(500).json(err);
            }
        } else {
            return res.status(200).json({ msg: "Successfully assigned project" });
        }
    });
};
