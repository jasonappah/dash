import { useEffect, useState } from "react";
import { niceDtString } from "../lib/util";

export function Item({ name, url, status, startDate, endDate }) {
  const [progressBg, setBg] = useState("bg-red-10");
  useEffect(() => {
    if (status === "Complete") {
      setBg("bg-green-100");
    } else if (status === "In Progress") {
      setBg("bg-yellow-100");
    } else {
      setBg("bg-red-100");
    }
  }, [status]);

  return (
    <a href={url}>
      <div className="p-1 px-2 transition flex flex-row dark:hover:bg-white hover:bg-opacity-10 dark:hover:bg-opacity-10 hover:bg-black sm:gap-8 rounded items-center">
        <p className="font-bold">{name}</p>
        {status && (
          <p className={`rounded px-2 p-0.5 dark:text-black ${progressBg}`}>
            {status}
          </p>
        )}
        <p>
          {endDate ? "" : "Due "}
          {niceDtString(startDate)}
          {endDate && ` - ${niceDtString(endDate)}`}
        </p>
      </div>
    </a>
  );
}
