import { Client } from "@notionhq/client";
const { NOTION_TOKEN, NEXT_PUBLIC_NOTION_DB_ID, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = process.env;
import { getNext7Days } from "./ticktick/osScript";
import { Redis } from '@upstash/redis'

const notion = new Client({
  auth: NOTION_TOKEN,
});

export async function getNotionEntries() {
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
    }).sort(
      (a, b) => Date.parse(a?.Due?.date?.start || -1) - Date.parse(b?.Due?.date?.start || -1)
    );
  return res;
}

export async function getTickTickTasks() {
  const tasksArr = []
  const tasksObj = await getNext7Days();
  tasksObj.forEach((thing) => {
    const start = thing.name;
    const Due = {
      date: {
        start: start || -1,
      },
    };
    tasksArr.push(
      ...thing.children.map((task) => ({
        ...task,
        Name: {
          title: [
            {
              plain_text: task.title || "",
            },
          ],
        },
        Due,
        url: "",
        Status: { select: { name: "Incomplete" } },
      }))
    );
  });
  return tasksArr;
}

export async function getEntries() {
  const promises = [getNotionEntries()];
  // if (Object.keys(process.env).includes("TICKTICK_CLIENT_ID")) {
  //   const redis = new Redis({
  //     url: UPSTASH_REDIS_REST_URL,
  //     token: UPSTASH_REDIS_REST_TOKEN
  //   })
  //   const token = await redis.get<string>('dash:ticktick_access');
  //   if (!token) {
      
  //   }
  //   const projectId = ""
  //   const req = await fetch(`https://api.ticktick.com/open/v1/project/${projectId}`)
  //   console.log()
  
  // }
  const [notion, ticktick] = await Promise.all(promises)
  return [...ticktick||[], ...notion]
}