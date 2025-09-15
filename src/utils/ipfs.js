import { pinata } from "../config/pinata.js";

export async function uploadToIPFS(jsonData) {
  try {
    const res = await pinata.post("/pinning/pinJSONToIPFS", {
      pinataContent: jsonData,
    });
    return res.data.IpfsHash; 
  } catch (err) {
    throw new Error("❌ Failed to upload to IPFS: " + err.message);
  }
}

export async function getFromIPFS(cid) {
  const gateway = "https://ipfs.io/ipfs/";
  const url = `${gateway}${cid}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("❌ Failed to fetch from IPFS");
  return res.json();
}
