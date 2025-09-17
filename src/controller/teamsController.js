import { uploadToIPFS, getFromIPFS } from "../utils/ipfs.js";
import { updateMasterWithHackathon } from "./hackathonController.js";

export const createTeams = async (req, res) => {
    try {
        const { hackathonCID } = req.params;
        const newTeam = req.body;

        const teamCID = await uploadToIPFS(newTeam);

        const { name } = newTeam;
        const liteTeam = { name, cid: teamCID };

        const hackathon = await getFromIPFS(hackathonCID);

        let teams = [];
        if (hackathon.teamCID) {
            teams = await getFromIPFS(hackathon.teamCID);
        }


        teams.push(liteTeam);


        hackathon.teamCID = await uploadToIPFS(teams);
        const newHackathonCID = await uploadToIPFS(hackathon);



        const masterBody = {
            hackathonCID: newHackathonCID,
            title: hackathon.title,
            desc: hackathon.desc,
            startDate: hackathon.startDate,
            imageCID: hackathon.imageCID, // FIXED
        };

        await updateMasterWithHackathon({ body: masterBody }, res);


        res.status(201).json({
            message: "✅ Team created",
            cid: teamCID,
        });
    } catch (err) {
        console.error("❌ Error creating team:", err.message);
        res.status(500).json({ error: err.message });
    }
};

export const getTeamByCID = async (req, res) => {
    try {
        const { cid } = req.params;
        const teamData = await getFromIPFS(cid);

        res.status(200).json({
            success: true,
            cid,
            data: teamData,
        });
    } catch (err) {
        console.error("❌ Error fetching team:", err.message);
        res.status(500).json({ error: err.message });
    }
};
