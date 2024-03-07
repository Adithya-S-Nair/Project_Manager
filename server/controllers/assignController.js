import { db } from '../connections/mysql.js';

export const assignTask = (req, res) => {
    const { employeeId, taskNames } = req.body;
    const queries = [];
    for (const task of taskNames) {
        const getProjectQuery = `SELECT project.project_id 
                                 FROM project 
                                 INNER JOIN task t
                                 ON project.project_id = t.project_id
                                 WHERE t.task_id = ?`;
        db.query(getProjectQuery, [task.task_id], (err, projectResults) => {
            if (err) {
                console.error('Error retrieving project ID:', err.message);
                res.status(500).json({ error: 'Internal Server Error', message: err.message });
                return;
            }

            if (projectResults.length === 0) {
                console.error('Project ID not found for task:', task.task_id);
                res.status(404).json({ error: 'Not Found', message: 'Project ID not found for task' });
                return;
            }

            const projectId = projectResults[0].project_id;
            const insertQuery = 'INSERT INTO assigned(employee_id, task_id, project_id) VALUES (?, ?, ?)';
            const values = [employeeId, task.task_id, projectId];

            queries.push(new Promise((resolveQuery, rejectQuery) => {
                db.query(insertQuery, values, (err, results) => {
                    if (err) {
                        rejectQuery(err);
                    } else {
                        resolveQuery(results);
                    }
                });
            }));
        });
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
        const getProjectQuery = `SELECT project.project_id 
                                 FROM project 
                                 INNER JOIN task t
                                 ON project.project_id = t.project_id
                                 INNER JOIN subtask
                                 ON t.task_id = subtask.task_id 
                                 WHERE subtask.subtask_id = ?`;
        db.query(getProjectQuery, [task.subtask_id], (err, projectResults) => {
            if (err) {
                console.error('Error retrieving project ID:', err.message);
                res.status(500).json({ error: 'Internal Server Error', message: err.message });
                return;
            }

            if (projectResults.length === 0) {
                console.error('Project ID not found for subtask:', task.subtask_id);
                res.status(404).json({ error: 'Not Found', message: 'Project ID not found for subtask' });
                return;
            }

            const projectId = projectResults[0].project_id;
            const insertQuery = 'INSERT INTO assigned(employee_id, subtask_id, project_id) VALUES (?, ?, ?)';
            const values = [employeeId, task.subtask_id, projectId];

            queries.push(new Promise((resolveQuery, rejectQuery) => {
                db.query(insertQuery, values, (err, results) => {
                    if (err) {
                        rejectQuery(err);
                    } else {
                        resolveQuery(results);
                    }
                });
            }));
        });
    }
    Promise.all(queries)
        .then(() => {
            console.log('Subtask IDs inserted successfully.');
            res.status(200).json({ message: 'Subtask assigned successfully' });
        })
        .catch((error) => {
            console.error('Error inserting subtask IDs:', error.message);
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

    db.query(query, [employeeId, projectId, employeeId, projectId], (err, data) => {
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
