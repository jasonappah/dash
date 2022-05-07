import useSWR from "swr";
import { getEntries } from "../lib/server/notion";
import { DateTime } from "luxon";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { timeOfDay } from "../lib/util";
import { Item } from "../components/Item";
const REEVAL_SECS = 60;

export default function Home(props) {
  const { data, error, isValidating } = useSWR("/api/list", {
    fallbackData: { list: props.list },
    refreshInterval: REEVAL_SECS * 1000,
  });

  if (error)
    return (
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-2xl">An unexpected error occurred.</h1>
        <code className="m-8 p-2 rounded ">{error.toString()}</code>
      </div>
    );
    
  if (!data)
    return (
      <div className="h-screen flex justify-center items-center">
        <AiOutlineLoading3Quarters className="animate-spin w-10 h-10" />
      </div>
    );

  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-6xl m-4">Good {timeOfDay()}.</h1>
        <h2 className="font-semibold text-2xl">
          You have{" "}
          {
            data.list.filter(
              (item) =>
                DateTime.now() - DateTime.fromISO(item?.Due?.date?.start || -1) > 0 &&
                item?.Status?.select?.name !== "Complete"
            ).length
          }{" "}
          overdue assignments, and {data.list.length} total events and
          assignments.
        </h2>
        <p className="m-1.5">
          {isValidating
            ? "Updating..."
            : `Last updated on ${DateTime.now().toLocaleString(
                DateTime.DATETIME_MED_WITH_SECONDS
              )}.`}
        </p>
      </div>
      <div className="m-10">
        {data.list.map((item) => (
          <Item
            key={item.id}
            name={item.Name.title[0].plain_text}
            url={item.url}
            status={item?.Status?.select?.name}
            startDate={item.Due.date.start}
            endDate={item.Due.date.end}
          />
        ))}
      </div>
    </>
  );
}

export async function getStaticProps() {
  const list = await getEntries();
  return { props: { list }, revalidate: REEVAL_SECS };
}
