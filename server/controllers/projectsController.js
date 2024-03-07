import { db } from '../connections/mysql.js';
import moment from 'moment';

export const getAllProjects = (req, res) => {

    const { userId, userType, userName } = req;

    if (userType === "Admin" || userType === "admin") {
        const q = "SELECT * FROM project";

        db.query(q, (err, data) => {

            if (err) return res.status(500).json(err);

            if (data.length == 0) return res.status(409).json("Project Not Found");

            data.forEach(row => {
                row.project_start_date = moment(row.project_start_date).format('DD-MM-YYYY');
                row.project_end_date = moment(row.project_end_date).format('DD-MM-YYYY');
                row.actual_start_date = moment(row.actual_start_date).format('DD-MM-YYYY');
                row.actual_end_date = moment(row.actual_end_date).format('DD-MM-YYYY');
            });

            return res.status(200).json(data);
        })
    } else if (userType === "Users" || userType === "users") {
        const q = `  SELECT
        distinct project.project_id, project.project_name
        FROM
        project
        JOIN
        assigned ON assigned.project_id = project.project_id
        JOIN
        employee ON employee.employee_id = assigned.employee_id
        JOIN
        users ON users.user_id = employee.user_account_id
        WHERE users.user_id = ?` ;

        db.query(q, [userId], (err, data) => {

            if (err) return res.status(500).json(err);

            if (data.length == 0) return res.status(404).json("Project Not Found");

            data.forEach(row => {
                row.project_start_date = moment(row.project_start_date).format('DD-MM-YYYY');
                row.project_end_date = moment(row.project_end_date).format('DD-MM-YYYY');
                row.actual_start_date = moment(row.actual_start_date).format('DD-MM-YYYY');
                row.actual_end_date = moment(row.actual_end_date).format('DD-MM-YYYY');
            });

            return res.status(200).json(data);
        })
    }
}

export const getProjectById = (req, res) => {
    if (req.userType === 'Admin') {
        const query = "SELECT * FROM project WHERE project_id = ?"
        const value = [req.params.projectId]
        db.query(query, value, (err, data) => {

            data.forEach(row => {
                row.project_start_date = moment(row.project_start_date).format('YYYY-MM-DD');
                row.project_end_date = moment(row.project_end_date).format('YYYY-MM-DD');
                row.actual_start_date = moment(row.actual_start_date).format('YYYY-MM-DD');
                row.actual_end_date = moment(row.actual_end_date).format('YYYY-MM-DD');
            });

            if (err) return res.status(500).json(err);
            if (data.length == 0) return res.status(404).json("Project Not Found");
            return res.status(200).json(data[0]);
        })
    } else {
        const query = `SELECT
                        project.*
                    FROM
                        project
                    JOIN
                        assigned ON assigned.project_id = project.project_id
                    JOIN
                        employee ON employee.employee_id = assigned.employee_id
                    JOIN
                        users ON users.user_id = employee.user_account_id
                    WHERE
                        users.user_id = ? AND project.project_id = ?`
        const values = [req.userId, req.params.projectId]
        db.query(query, values, (err, data) => {
            if (err) return res.status(500).json(err);
            if (data.length == 0) return res.status(404).json("Project Not Found");
            return res.status(200).json(data[0]);
        })
    }
}

export const createProject = (req, res) => {

    const project_start_date = req.body.projectStartDate;
    const project_end_date = req.body.projectEndDate;
    const actual_start_date = req.body.actualStartDate;
    const actual_end_date = req.body.actualEndDate;

    const q = "INSERT INTO project (`project_name`, `project_start_date`, `project_end_date`, `actual_start_date` , `actual_end_date`, `project_description`) VALUES( ? )";

    const values = [
        req.body.projectName,
        moment(project_start_date).format('YYYY-MM-DD'),
        moment(project_end_date).format('YYYY-MM-DD'),
        moment(actual_start_date).format('YYYY-MM-DD'),
        moment(actual_end_date).format('YYYY-MM-DD'),
        req.body.projectDescription
    ];

    db.query(q, [values], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }

        return res.status(200).json("Project has been Successfully Created");
    });
}

export const getProjectCompletionStatus = (req, res) => {
    const query = `SELECT
                    SUM(CASE WHEN status = 'Pending' AND is_deleted = 0 THEN 1 ELSE 0 END) AS pending_count,
                    SUM(CASE WHEN status = 'Work In Progress' AND is_deleted = 0 THEN 1 ELSE 0 END) AS workinprogress_count,
                    SUM(CASE WHEN status = 'On Hold' AND is_deleted = 0 THEN 1 ELSE 0 END) AS hold_count,
                    SUM(CASE WHEN status = 'Completed' AND is_deleted = 0 THEN 1 ELSE 0 END) AS completed_count,
                    COUNT(task_id) AS total_count
                FROM
                    task
                WHERE
                    project_id = ?`

    db.query(query, req.params.projectId, (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ msg: "No data found" })
        return res.status(200).json(data[0])
    })
}

export const getRadarChartData = (req, res) => {
    const query = `SELECT
                task.task_id,
                task.task_name,
                COUNT(subtask.subtask_id) AS total_subtasks,
                COUNT(CASE WHEN subtask.status = 'Completed' AND subtask.is_deleted = 0 THEN subtask.subtask_id END) AS completed_subtasks_count
                FROM
                task
                LEFT JOIN
                subtask ON task.task_id = subtask.task_id
                WHERE
                task.project_id = ?
                GROUP BY
                task.task_id, task.task_name
                ORDER BY
                task.task_id`
    db.query(query, [req.params.projectId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ msg: "No data found" })
        return res.status(200).json(data)
    })
}

export const getProjectIdAndName = (req, res) => {

    const q = "SELECT project_id,project_name FROM project";

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);

        if (data.length === 0) {
            return res.status(404).json({ msg: "No data found" });
        }

        return res.status(200).json(data)
    })
}

export const getGaugeProjectCompletionStatus = (req, res) => {
    const { userId, userType } = req;

    if (userType === "Admin" || userType === "admin") {
        const query = `SELECT
            project.project_id,
            project.project_name,
            SUM(CASE WHEN task.status = 'Completed' AND task.is_deleted = 0 THEN 1 ELSE 0 END) AS completed_count,
            COUNT(task.task_id) AS total_count
        FROM
            task
        JOIN
            project ON task.project_id = project.project_id
        GROUP BY
            project.project_id, project.project_name`;

        db.query(query, (err, data) => {
            if (err) return res.status(500).json(err);
            if (data.length === 0) return res.status(404).json({ msg: "No data found" });
            return res.status(200).json(data);
        });
    } else if (userType === "Users" || userType === "users") {
        const query = `SELECT
            project.project_id,
            project.project_name,
            SUM(CASE WHEN task.status = 'Completed' AND task.is_deleted = 0 THEN 1 ELSE 0 END) AS completed_count,
            COUNT(task.task_id) AS total_count
        FROM
            task
        JOIN
            project ON task.project_id = project.project_id
        JOIN
            assigned ON assigned.project_id = project.project_id
        JOIN
            employee ON employee.employee_id = assigned.employee_id
        JOIN
            users ON users.user_id = employee.user_account_id
        WHERE
            users.user_id = ?
        GROUP BY
            project.project_id, project.project_name`;

        db.query(query, [userId], (err, data) => {
            if (err) return res.status(500).json(err);
            if (data.length === 0) return res.status(404).json("Project Not Found");
            return res.status(200).json(data);
        });
    }
};

export const updateProjectDetail = (req, res) => {

    const {
        project_name,
        project_start_date,
        project_end_date,
        actual_start_date,
        actual_end_date,
        project_description,
    } = req.body;

    const projectId = req.params.projectId;
    console.log(project_name);

    const query = `UPDATE project 
                   SET project_name = ?, project_start_date = ?, project_end_date = ?, actual_start_date = ?,
                   actual_end_date = ?, project_description = ?
                   WHERE project_id = ?`;

    const values = [
        project_name,
        project_start_date,
        project_end_date,
        actual_start_date,
        actual_end_date,
        project_description,
        projectId
    ];

    db.query(query, values, (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("Project Not Found");
        return res.status(200).json("project updated successfully");
    });
}

export const getProjectName = (req, res) => {
    const { taskId } = req.params;
    const query = `SELECT project.project_name,task.project_id 
    from task
    INNER JOIN project
    ON task.project_id = project.project_id
    WHERE task_id = ?`;

    db.query(query, taskId, (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("Project Not Found");
        return res.status(200).json(data);
    });
}

export const getAllProjectDetails = (req, res) => {

    const query = `
    SELECT p.project_id ,p.project_name,p.project_start_date,p.project_end_date, t.task_id ,t.task_name,t.planned_start_date as task_start_date ,t.planned_end_date as task_end_date , s.subtask_id ,s.subtask_name,s.planned_start_date as subtask_start_date,s.planned_end_date as subtask_end_date  
    FROM project AS p
    LEFT JOIN task AS t ON p.project_id = t.project_id 
    LEFT JOIN subtask AS s ON t.task_id = s.task_id
    ORDER BY p.project_id, t.task_id, s.subtask_id
    `;

    const projects = [];

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        let currentProject = null;
        let currentTask = null;



        results.forEach((row) => {
            if (currentProject === null || currentProject.project_id !== row.project_id) {
                currentProject = {
                    project_id: row.project_id,
                    name: row.project_name,
                    start_date: moment(row.project_start_date).format('YYYY-MM-DD'),
                    end_date: moment(row.project_end_date).format('YYYY-MM-DD'),
                    tasks: []
                };
                projects.push(currentProject);
                currentTask = null;
            }

            if (row.task_id) {
                if (!currentTask || currentTask.task_id !== row.task_id) {
                    currentTask = {
                        task_id: row.task_id,
                        name: row.task_name,
                        start_date: moment(row.task_start_date).format('YYYY-MM-DD'),
                        end_date: moment(row.task_end_date).format('YYYY-MM-DD'),
                        subtasks: []
                    };
                    currentProject.tasks.push(currentTask);
                }

                if (row.subtask_id) {
                    currentTask.subtasks.push({
                        subtask_id: row.subtask_id,
                        name: row.subtask_name,
                        start_date: moment(row.subtask_start_date).format('YYYY-MM-DD'),
                        end_date: moment(row.subtask_end_date).format('YYYY-MM-DD'),
                    });
                }
            }
        });
        currentProject = null;
        currentTask = null;

        res.json(projects);
    });
};
