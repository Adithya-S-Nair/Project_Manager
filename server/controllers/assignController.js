import { db } from '../connections/mysql.js';

export const assignTask = (req, res) => {
    const { employeeId, selectedTask } = req.body;
    const queries = [];
    for (const task of selectedTask) {
        const sql = 'INSERT INTO your_table_name (employee_id, task_id) VALUES (?, ?)';
        const values = [employeeId, task.task_id];

        queries.push(new Promise((resolveQuery, rejectQuery) => {
            connection.query(sql, values, (err, results) => {
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