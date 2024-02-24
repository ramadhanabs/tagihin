import "@mantine/core/styles.css";

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createTheme, MantineProvider } from "@mantine/core";

const theme = createTheme({
  /** Put your mantine theme override here */
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <div className="max-w-[500px] mx-auto">
        <Component {...pageProps} />
      </div>
    </MantineProvider>
  );
}
