import { Client } from "@notionhq/client";
const { NOTION_TOKEN, NEXT_PUBLIC_NOTION_DB_ID } = process.env

const notion = new Client({
  auth: NOTION_TOKEN
});

export async function getEntries() {
  const myPage = await notion.databases.query({
    database_id: NEXT_PUBLIC_NOTION_DB_ID,
    filter: {
      property: "Hide",
      checkbox: {
        equals: false,
      },
    },
  });
  const res = myPage.results
  .map((entry) => {
    return { ...entry.properties, url: entry.url, id: entry.id };
  })
  .sort(
    (a, b) => Date.parse(a.Due.date.start) - Date.parse(b.Due.date.start)
  );
  return res
}
