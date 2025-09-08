import { Router } from "express";
import { Dorm } from "../models/Dorm.js";

export const dorms = Router();

dorms.get("/", async (_req, res) => {
  const all = await Dorm.findAll({ order: [["id", "ASC"]] });
  res.json(all);
});

dorms.get("/:id", async (req, res, next) => {
  try {
    const dorm = await Dorm.findByPk(req.params.id);

    if (!dorm) return res.status(404).json({ error: "Dorm not found" });
    res.json(dorm);
  } 
  catch (err) { next(err); }
});

dorms.post ("/", async (req, res, next )=> {
  try {
    const newDorm = await Dorm.create(req.body);

    res.status(201).json(newDorm);
  } 
  catch (err) { next(err); }
});

dorms.put("/:id", async (req, res, next) => {
  try {
    const dorm = await Dorm.findByPk(req.params.id);
    if (!dorm) return res.status(404).json({ error: "Dorm not found" });

    Object.assign(dorm, req.body);
    await dorm.save();

    res.json(dorm);
  } 
  catch (err) { next(err); }
});

dorms.delete("/:id", async (req, res) => {
  const n = await Dorm.destroy({ where: { id: req.params.id } });
  res.json({ deleted: n });
});   
// Note: Add error handling middleware in index.js to catch errors from next(err) 
// Example:
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({ error: 'Internal Server Error' });
// });  
