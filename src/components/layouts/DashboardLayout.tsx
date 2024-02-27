import React, { PropsWithChildren, useContext } from "react";
import { FaPlus, FaSignOutAlt } from "react-icons/fa";
import { Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import MainLayoutDrawer from "../modules/MainLayoutDrawer/MainLayoutDrawer";
import DetailCreditorDrawer from "../modules/DetailCreditorDrawer/DetailCreditorDrawer";
import { Context } from "@/pages/_app";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { notifications } from "@mantine/notifications";

const DashboardLayout = ({ children }: PropsWithChildren) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { isShowDetailDrawer, setIsShowDetailDrawer, userData } = useContext(Context);

  const handleSignOut = async () => {
    await signOut(auth)
      .then(() => {
        notifications.show({
          title: "Success logout",
          message: "Redirecting to login page...",
          color: "green",
        });

        setTimeout(() => {
          window.location.replace("/login");
        }, 1000);
      })
      .catch(error => {
        notifications.show({
          title: "Failed to logout",
          message: error,
          color: "red",
        });
      });
  };

  return (
    <div>
      <nav className="w-full max-w-[500px] fixed top-0 border-b border-gray-700 flex items-center justify-between p-4 bg-black">
        <p className="text-sm">
          Hai, <strong>{userData?.email}</strong>
        </p>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <button className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold">
              RB
            </button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item onClick={handleSignOut} leftSection={<FaSignOutAlt />}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </nav>

      <div className="h-[65px]"></div>
      <div className="h-[calc(100vh-65px)] relative">
        {children}
        <div className="absolute bottom-5 right-5">
          <button
            onClick={open}
            className="w-14 h-14 rounded-full flex items-center justify-center bg-white/10 border border-white/30 group hover:bg-cyan-500/10 hover:border-cyan-500/50"
          >
            <FaPlus className="w-6 h-6 group-hover:text-cyan-500" />
          </button>
        </div>

        <MainLayoutDrawer opened={opened} close={close} />
        <DetailCreditorDrawer
          opened={isShowDetailDrawer}
          close={() => setIsShowDetailDrawer(false)}
        />
      </div>
    </div>
  );
};

export default DashboardLayout;
