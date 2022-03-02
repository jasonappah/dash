import { CgDarkMode } from "react-icons/cg";
import { useTheme } from "next-themes";

export default function Nav() {
  const { theme, setTheme } = useTheme();
  return (
    <nav className="flex flex-row dark:text-white gap-10 items-center">
      <button
        onClick={() => {
          setTheme(theme === "dark" ? "light" : "dark");
          document
            .querySelector("#theme_toggle")
            .classList.toggle("rotate-180");
        }}
        className="p-2 m-2 rounded-full hover:bg-black dark:hover:bg-white hover:bg-opacity-10 dark:hover:bg-opacity-10 transform duration-200 align-self-end"
        id="theme_toggle"
      >
        <CgDarkMode size={24} />
      </button>
      <a href="https://github.com/jasonappah/dash">Source</a>
      {process.env.NEXT_PUBLIC_NOTION_DB_ID && <a href={`https://notion.so/${process.env.NEXT_PUBLIC_NOTION_DB_ID}`}>Notion</a>}
    </nav>
  );
}
