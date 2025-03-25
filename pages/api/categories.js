import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { isAdminRequest} from "@/pages/api/auth/[...nextauth]";
import {getServerSession} from "next-auth";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
 await isAdminRequest(req,res);


  if (method === "GET") {
    res.json(await Category.find().populate("parent"));
  }

  if (method === "POST") {
    const { name, parentCategory ,properties} = req.body;

    // Validate parentCategory value
    const parentId = parentCategory || null; // Convert empty string to null

    try {
      const categoryDoc = await Category.create({
        name,
        parent: parentId,
        properties:properties,
      });
      res.json(categoryDoc);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  if (method === "PUT") {
    const { name, parentCategory, properties,_id } = req.body;

    // Validate parentCategory value
    const parentId = parentCategory || null; // Convert empty string to null

    try {
      const categoryDoc = await Category.updateOne(
        { _id },
        {
          name,
          parent: parentId,
          properties,
        }
      );
      res.json(categoryDoc);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  if (method === "DELETE") {
    const { _id } = req.query;
    try {
      await Category.deleteOne({ _id });
      res.json("ok");
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
