import { DateTime } from "luxon";

export const niceDtString = (iso) => {
  const dt = DateTime.fromISO(iso);
  const fmt = {
    ...DateTime.DATE_HUGE,
    ...(dt.hour == 0 && dt.minute == 0 ? {} : DateTime.TIME_SIMPLE),
  };
  return dt.toLocaleString(fmt);
};

export const timeOfDay = () => {
  const hrs = new Date().getHours();
  if (hrs < 4) {
    return "night";
  } else if (hrs < 12) {
    return "morning";
  } else if (hrs < 18) {
    return "afternoon";
  } else {
    return "evening";
  }
};
