import type { NextApiRequest, NextApiResponse } from "next";
import mongo from "../utils/MongoDataApiReq";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      const Get = await mongo("find", {});
      res.status(200).json(Get);
      break;
    case "POST":
      const { title } = req.body;
      const { pfp } = req.body;
      const Created = await mongo("insertOne", {
        document: {
          title: title,
          pfp: pfp,
        },
      });
      res.status(200).json(Created);
  }
}
