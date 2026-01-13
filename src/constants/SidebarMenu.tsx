import React from "react";

import { Banknote, BookText, GridIcon, PackageIcon } from "lucide-react";

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

export const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [{ name: "Ecommerce", path: "/", pro: false }],
  },
  {
    name: "강의",
    icon: <BookText />,
    subItems: [{ name: "강의 목록", path: "/courses", pro: false }],
  },
  {
    name : '결제',
    icon : <Banknote />,
    subItems : [{name : '결제 목록', path: '/payments', pro: false}]
  },
  {
    name: "Pages",
    icon: <PackageIcon />,
    subItems: [
      { name: "Blank Page", path: "/blank", pro: false },
      { name: "404 Error", path: "/error-404", pro: false },
    ],
  },
];

