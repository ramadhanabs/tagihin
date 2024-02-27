import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createTheme, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Notifications } from "@mantine/notifications";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase";

const queryClient = new QueryClient();

const theme = createTheme({
  /** Put your mantine theme override here */
});

interface IContext {
  isShowDetailDrawer: boolean;
  selectedId: string;
  userData: User | null;

  setSelectedId: Dispatch<SetStateAction<string>>;
  setIsShowDetailDrawer: Dispatch<SetStateAction<boolean>>;
}

export const Context = createContext<IContext>({
  isShowDetailDrawer: false,
  selectedId: "",
  userData: null,

  setSelectedId: () => {},
  setIsShowDetailDrawer: () => {},
});

const ContextProvider = ({ children }: PropsWithChildren) => {
  const [isShowDetailDrawer, setIsShowDetailDrawer] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setUserData(user);
      }
    });
  }, []);

  return (
    <Context.Provider
      value={{ isShowDetailDrawer, selectedId, userData, setIsShowDetailDrawer, setSelectedId }}
    >
      {children}
    </Context.Provider>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <ContextProvider>
        <QueryClientProvider client={queryClient}>
          <div className="max-w-[500px] mx-auto">
            <Notifications />
            <Component {...pageProps} />
          </div>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-left" />
        </QueryClientProvider>
      </ContextProvider>
    </MantineProvider>
  );
}
