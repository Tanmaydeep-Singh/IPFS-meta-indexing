import Master from "../models/Master.js";

export const getAllEntities = async (req, res) => {
  try {
    const { entity } = req.params;
    const entries = await Master.find({ entity });

    if(!entries)
    {
         const master = new Master({ entity, cid });
         const savedMaster = await master.save();
        res.status(201).json(savedMaster);    
    }

    res.status(200).json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
