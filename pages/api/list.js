import { getEntries } from "../../lib/server/notion"
const list = async (_, res) => {
  const list = await getEntries()
  res.status(200).json({list})
}

export default list