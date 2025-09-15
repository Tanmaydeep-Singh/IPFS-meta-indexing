Perfect 👍 — you’re thinking about it the right way:

1. **IPFS = source of truth** for hackathons, projects, teams (JSON data).
2. **MongoDB = thin layer** just to keep minimal metadata/indexes so we avoid overloading IPFS calls.
3. **APIs = flows** that handle:

   * Writing to IPFS (new JSONs / updates).
   * Updating Master CIDs in MongoDB.
   * Reading from IPFS efficiently (single objects & arrays).

Here’s a `README.md` draft that defines **schemas**, **flows**, and **APIs** clearly:

---

````markdown
# Hackathon Management (IPFS + MongoDB)

This project uses **IPFS (via Pinata)** as the main storage layer and **MongoDB** as a minimal index/cache layer.  
MongoDB dependencies are kept minimal — only used to store **Master CID references** and basic indexing to avoid excessive IPFS calls.

---

## 🔑 Core Idea

- **IPFS** stores the actual JSON data for:
  - Hackathons
  - Projects
  - Teams
- **MongoDB** only stores:
  - Latest CID references for collections (`hackathons`, `projects`, `teams`)
  - Simple indexing fields if needed later
- **APIs** interact with both:
  - Write: Upload JSON → Get CID → Update Master schema
  - Read: Lookup Master CID → Fetch JSON from IPFS → Return response

---

## 📂 IPFS Schemas

### Hackathon
```json
{
  "id": "hack_001",
  "title": "HackX Buildathon",
  "desc": "A global hackathon for builders",
  "startDate": "2025-09-20",
  "endDate": "2025-09-22",
  "imageCID": "Qm123...",
  "prize": "$5000",
  "projectsCID": "QmProjCID...",
  "teamsCID": "QmTeamsCID..."
}
````

### Project

```json
{
  "id": "proj_001",
  "name": "AI Tracker",
  "desc": "Tracks daily habits using AI",
  "github": "https://github.com/example/ai-tracker",
  "link": "https://ai-tracker.io",
  "team": "team_001"
}
```

### Team

```json
{
  "id": "team_001",
  "name": "HackMasters",
  "members": ["Alice", "Bob", "Charlie"],
  "lead": "Alice"
}
```

---

## 📂 MongoDB Schemas

### Master

Keeps track of current CID references.

```js
{
  key: "hackathons", // or "projects", "teams"
  cid: "Qm123..."
}
```

*(Optionally, can include timestamp or history tracking if rollback is needed.)*

---

## 🌐 API Flows

### 1. Get All Hackathons

* Fetch CID from Master (`key: hackathons`)
* Pull JSON array from IPFS
* Return to client

### 2. Create Hackathon

* Receive hackathon data from client
* Push JSON to IPFS → get CID
* Update Hackathons JSON on IPFS
* Update Master `hackathons` CID in MongoDB

### 3. Join Hackathon

* Add user/team to Hackathon’s `teamsCID` JSON
* Upload updated Teams JSON to IPFS
* Update Master `teams` CID in MongoDB

### 4. Create Team

* Create new Team JSON
* Upload to IPFS → get CID
* Update Hackathon’s `teamsCID`
* Update Master `teams` CID

### 5. Create Project

* Create new Project JSON
* Upload to IPFS → get CID
* Update Hackathon’s `projectsCID`
* Update Master `projects` CID

---

## 📡 API Categories

We will implement two categories of APIs:

1. **Simple Array APIs**

   * Example: `/hackathons` → returns all hackathons (array JSON)
   * Example: `/projects/:hackathonId` → returns all projects in a hackathon

2. **Single Component APIs**

   * Example: `/hackathon/:id` → returns single hackathon
   * Example: `/project/:id` → returns single project
   * Example: `/team/:id` → returns single team

---

## 🚀 Development Roadmap (Stage 1)

1. Define IPFS JSON schemas ✅
2. Define minimal MongoDB schemas ✅
3. Build API flows:

   * [ ] Get all hackathons
   * [ ] Create hackathon
   * [ ] Join hackathon
   * [ ] Create team
   * [ ] Create project
4. Add update flows:

   * [ ] Update hackathon/projects/teams by uploading new JSON & replacing CID
5. Optimize caching to avoid overloading IPFS

---

## ⚠️ Notes

* MongoDB **will not store** actual hackathon/project/team details — only CIDs and simple indexes.
* Every update = new JSON → new CID → Master updated.
* Queries may get complex (multiple lookups across CIDs), but IPFS remains the source of truth.

```


