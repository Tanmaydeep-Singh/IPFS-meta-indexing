import { updateMasterWithHackathon } from "../controller/hackathonController.js";
import { getFromIPFS, uploadToIPFS } from "./ipfs.js";
import Master from "../model/masterSchema.js";

// Merges two lists based on a specified key (default: "cid")
export const mergeList = (currentList, newItems, key = "cid") => {
    const existingMap = new Map((currentList || []).map(item => [item[key], item]));

    for (const item of newItems) {
        existingMap.set(item[key], { ...existingMap.get(item[key]), ...item });
    }

    return Array.from(existingMap.values());
};

// Updates a list for the hackathon
export const updateListForHackathon = async (hackathon, newItem, listType, cidKey) => {
    // Upload new item to IPFS and create a lighter version
    const itemCID = await uploadToIPFS(newItem);
    const { _id, name, desc } = newItem;
    const liteItem = { _id, name, desc, cid: itemCID };

    let currentList = [];

    // Retrieve the current list from IPFS if it exists
    if (hackathon[cidKey]) {
        currentList = await getFromIPFS(hackathon[cidKey]);
    }

    // Merge the new item with the current list
    const updatedList = mergeList(currentList, [liteItem]);

    // Upload the updated list to IPFS
    const newListCID = await uploadToIPFS(updatedList);

    // Retrieve master data for hackathons
    let master = await Master.findOne({ key: "hackathons" });
    let letesHackathons = master ? await getFromIPFS(master.cid) : [];

    if (!Array.isArray(letesHackathons)) {
        letesHackathons = [];
    }

    // Find the corresponding hackathon
    let h =  await getFromIPFS(letesHackathons.find(item => item._id === hackathon._id)?.cid);
    
    console.log("h.cid", h.cid);

    // Update hackathon based on list type
    if (listType === "Project") {
        console.log(" called for Project update")
        hackathon = {
            ...hackathon,
            teamCID: h?.teamCID || hackathon.teamCID,
        };
        console.log(h)
        console.log(hackathon.teamCID)
        console.log(h?.teamCID)
        console.log(hackathon.teamCID)

    }

    if (listType === "Team") {
        console.log(" called for Team update")
        hackathon = {
            ...hackathon,
            projectCID: h?.projectCID || hackathon.projectCID,
        };

        console.log(hackathon.projectCID)
    }

    const updatedHackathon = {
        ...hackathon,
        [cidKey]: newListCID,
    };

    // Upload the updated hackathon to IPFS
    const newHackathonCID = await uploadToIPFS(updatedHackathon);

    return { itemCID, newHackathonCID, updatedHackathon };
};

// Wrapper to update the master with the hackathon
export const updateMasterWrapper = async (oldCID, hackathon) => {
    const masterBody = {
        _id: hackathon._id,
        oldCID,
        newCID: hackathon.cid,
        title: hackathon.title,
        desc: hackathon.desc,
        startDate: hackathon.startDate,
        imageCID: hackathon.imageCID,
        votesCount: hackathon.votesCount,
        votesCID: hackathon.votesCID,
    };

    return await updateMasterWithHackathon(masterBody);
};
