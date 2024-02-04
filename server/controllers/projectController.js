import { db } from '../connections/mysql.js';
import moment from 'moment';

export const getAllProjects = (req, res) => {
    const q = "SELECT * FROM project ";

    db.query(q, (err, data) => {

        if (err) return res.status(500).json(err);

        if (data.length == 0) return res.status(409).json("Project Not Found");

        data.forEach(row => {
            row.project_start_date = moment(row.project_start_date).format('YYYY-MM-DD');
            row.project_end_date = moment(row.project_end_date).format('YYYY-MM-DD');
            row.actual_start_date = moment(row.actual_start_date).format('YYYY-MM-DD');
            row.actual_end_date = moment(row.actual_end_date).format('YYYY-MM-DD');
        });

        return res.status(200).json(data);
    })
}

export const createProject = (req,res) =>{

    const project_start_date = req.body.projectStartDate;
    const project_end_date = req.body.projectEndDate;
    const actual_start_date = req.body.actualStartDate;
    const actual_end_date = req.body.actualEndDate;

    const q ="INSERT INTO project (`project_name`, `project_start_date`, `project_end_date`, `actual_start_date` , `actual_end_date`, `project_description`) VALUES( ? )";

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