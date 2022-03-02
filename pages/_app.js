import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import fetcher from "../lib/client/fetcher";
import { SWRConfig } from "swr";
import HeadObject from "../components/head";
import Nav from "../components/nav";
function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider enableSystem="true" attribute="class">
      <HeadObject />
      <SWRConfig value={{ fetcher }}>
        <div className="transition ease-in-out dark:text-white light:text-black">
          <Nav />
          <Component {...pageProps} />
        </div>
      </SWRConfig>
    </ThemeProvider>
  );
}

export default MyApp;
