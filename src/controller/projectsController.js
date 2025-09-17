import { uploadToIPFS, getFromIPFS } from "../utils/ipfs.js";
import { updateMasterWithHackathon } from "./hackathonController.js";

export const createProject = async (req, res) => {
    try {
        const { hackathonCID } = req.params;
        const newProject = req.body;

        const projectCID = await uploadToIPFS(newProject);



        const { name, desc } = newProject;
        const liteProject = { name, desc, cid: projectCID };


        const hackathon = await getFromIPFS(hackathonCID);


        let projects = [];
        if (hackathon.projectCID) {
            projects = await getFromIPFS(hackathon.projectCID);
        }


        projects.push(liteProject);


        hackathon.projectCID = await uploadToIPFS(projects);
        const newHackathonCID = await uploadToIPFS(hackathon);



        const masterBody = {
            oldCID: hackathonCID,
            newCID: newHackathonCID,
            title: hackathon.title,
            desc: hackathon.desc,
            startDate: hackathon.startDate,
            imageCID: hackathon.imageCID,
        };

        await updateMasterWithHackathon(masterBody);


        res.status(201).json({
            message: "✅ Project created",
            projectCID,
            newHackathonCID,
        });

    } catch (err) {
        console.error("❌ Error creating project:", err.message);
        res.status(500).json({ error: err.message });
    }
};


export const getProjectByCID = async (req, res) => {
    try {
        const { cid } = req.params;
        const projectData = await getFromIPFS(cid);

        res.status(200).json({
            success: true,
            cid,
            data: projectData,
        });
    } catch (err) {
        console.error("❌ Error fetching project:", err.message);
        res.status(500).json({ error: err.message });
    }
};
