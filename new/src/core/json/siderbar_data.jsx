import React from "react";

import * as Icon from "react-feather";

export const SidebarData = [
  // {
  //   label: "Main",
  //   submenuOpen: true,
  //   showSubRoute: false,
  //   submenuHdr: "Main",
  //   submenuItems: [
  //     {
  //       label: "Dashboard",
  //       icon: <Icon.Grid />,
  //       submenu: true,
  //       showSubRoute: false,

  //       // submenuItems: [
  //       //   { label: "Dashboard", link: "/Home/Dashboard" },
  //       //   { label: "Branch Dashboard", link: "/sales-dashboard" },
  //       // ],
  //       submenuItems: [
  //         { label: "Admin Dashboard", link: "/admin-dashboard" },
          
  //       ],
  //     },
  //     // {
  //     //   label: "Application",
  //     //   icon: <Icon.Smartphone />,
  //     //   submenu: true,
  //     //   showSubRoute: false,
  //     //   submenuItems: [
  //     //     { label: "Chat", link: "/chat", showSubRoute: false },
  //     //     {
  //     //       label: "Call",
  //     //       submenu: true,
  //     //       submenuItems: [
  //     //         { label: "Video Call", link: "/video-call" },
  //     //         { label: "Audio Call", link: "/audio-call" },
  //     //         { label: "Call History", link: "/call-history" },
  //     //       ],
  //     //     },
  //     //     { label: "Calendar", link: "/calendar", showSubRoute: false },
  //     //     { label: "Email", link: "/email", showSubRoute: false },
  //     //     { label: "To Do", link: "/todo", showSubRoute: false },
  //     //     { label: "Notes", link: "/notes", showSubRoute: false },
  //     //     { label: "File Manager", link: "/file-manager", showSubRoute: false },
  //     //   ],
  //     // },
  //   ],
  // },
  // {
  //   label: "Inventory",
  //   submenuOpen: true,
  //   showSubRoute: false,
  //   submenuHdr: "Inventory",
  // },

  {
    label: "Masters",
    submenuOpen: true,
    submenuHdr: "Masters",
    showSubRoute: false,
    submenuItems: [
      {
        label: "Event",
        link: "/event",
        icon: <Icon.ShoppingBag />,
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Category",
        link: "/category",
        icon: <Icon.FileMinus />,
        showSubRoute: false,
        submenu: false,
      },
      // {
      //   label: "Racer",
      //   link: "/racer",
      //   icon: <Icon.RefreshCw />,
      //   showSubRoute: false,
      //   submenu: false,
      // },
      
    ],
  },
  {
    label: "Transaction",
    submenuOpen: true,
    submenuHdr: "Transaction",
    showSubRoute: false,
    submenuItems: [
      // {
      //   label: "Event Registration",
      //   link: "/event-register",
      //   icon: <Icon.ShoppingBag />,
      //   showSubRoute: false,
      //   submenu: false,
      // },
      {
        label: "Tyre Registration",
        link: "/tyre-registrationlist",
        icon: <Icon.FileMinus />,
        showSubRoute: false,
        submenu: false,
      },
      // {
      //   label: "Purchase Return",
      //   link: "/purchase-returns",
      //   icon: <Icon.RefreshCw />,
      //   showSubRoute: false,
      //   submenu: false,
      // },
    ],
  },
  {
    label: "Reports",
    submenuOpen: true,
    submenuHdr: "Reports",
    showSubRoute: false,
    submenuItems: [
      
      {
        label: "Tyre Registration Reports",
        link: "/tyre-register-reports",
        icon: <Icon.FileMinus />,
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Tyre Issue Reports",
        link: "/tyre-reports",
        icon: <Icon.FileMinus />,
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Tyre Scanning Detail",
        link: "/tyre-scan-detail",
        icon: <Icon.FileMinus />,
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Tyre Scanning Reports",
        link: "/TyreScann-report",
        icon: <Icon.ShoppingBag />,
        showSubRoute: false,
        submenu: false,
      },
      {
        label: "Rejection Reports",
        link: "/rejection-Reports",
        icon: <Icon.RefreshCw />,
        showSubRoute: false,
        submenu: false,
      },
    ],
  },
  {
    label: "User Administration ",
    submenuOpen: true,
    submenuHdr: "User Administration",
    showSubRoute: false,
    submenuItems: [
      {
        label: "User",
        link: "/user-list",
        icon: <Icon.ShoppingBag />,
        showSubRoute: false,
        submenu: false,
      },
     
      
    ],
  },
];
