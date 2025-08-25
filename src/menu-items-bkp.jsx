import React from "react";
import { useState,useEffect } from "react";
import {
  dashboardImg1,
  dashboardImg2,
  dashboardImg3,
  dashboardImg4,
  adminTemplate,
  createProject,
} from "./../src/images";

const MenuItems = () => {
  const [menuItems, setMenuItems] = useState({
    items: [
      {
        id: "navigation",
        title: "Navigation",
        type: "group",
        icon: "icon-navigation",
        children: [
          {
            id: "dashboard",
            title: "Dashboard",
            type: "item",
            icon: "feather icon-file-text",
            src: dashboardImg4,
            url: "/company/create-new-project",
          },
          {
            id: "module",
            title: "Module",
            type: "collapse",
            icon: "feather icon-file-text",
            src: dashboardImg4,
            children: [
              {
                id: "module-add",
                title: "Add Module",
                type: "item",
                url: "/module/add-module",
              },
              {
                id: "module-list",
                title: "Module List",
                type: "item",
                url: "/module/module-list",
              },
            ],
          },
          {
            id: "module-preview",
            title: "Module Preview",
            type: "collapse",
            icon: "feather icon-file-text",
            src: dashboardImg4,
            children: [
              {
                id: "module-preview-add",
                title: "Add Module Preview",
                type: "item",
                url: "/module-preview/add-module-preview",
              },
              {
                id: "module-preview-list",
                title: "Module List Preview",
                type: "item",
                url: "/module-preview/list-module-preview",
              },
            ],
          },
        ],
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/form/getall");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();

        // Generate dynamic menu items
        const dynamicMenuItems = result.page.map((item) => ({
          id: item.id,
          title: item.page_name,
          type: "collapse",
          icon: "feather icon-file-text",
          src: dashboardImg4,
          children: [
            {
              id: `${item.id}-add`,
              title: `Add ${item.page_name}`,
              type: "item",
              url: `/module-preview/add-${item.page_url}`,
            },
            {
              id: `${item.id}-list`,
              title: `${item.page_name} List`,
              type: "item",
              url: `/module-preview/list-${item.page_url}`,
            },
          ],
        }));

        // Update the menu items state
        setMenuItems((prevMenuItems) => ({
          ...prevMenuItems,
          items: [
            ...prevMenuItems.items,
            {
              id: "dynamic-data",
              title: "Dynamic Data",
              type: "group",
              children: dynamicMenuItems,
            },
          ],
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return menuItems;
};

export default MenuItems;
