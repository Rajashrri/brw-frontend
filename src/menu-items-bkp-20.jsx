import { useState,useEffect } from "react";
import {
  dashboardImg1,
  dashboardImg2,
  dashboardImg3,
  dashboardImg4,
  adminTemplate,
  createProject,
} from "./../src/images";
import { useAuth } from 'store/auth';


const menuItems = async () => {
  const [dynamicMenuItems, setDynamicMenuItems] = useState([]); 

  try {
    const response = await fetch("http://localhost:5000/api/form/getall");
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const result = await response.json();

    // Generate new dynamic menu items
    const menuItemss  = result.page.map((item) => ({
      id: item.page_name,
      title: item.page_name,
      type: "collapse",
      icon: "feather icon-file-text",
      src: dashboardImg4,
      children: [
        {
          id: `${item.page_name}-add`,
          title: `Add ${item.page_name}`,
          type: "item",
          url: `/module-preview/add-${item.page_url}`,
        },
        {
          id: `${item.page_name}-list`,
          title: `${item.page_name} List`,
          type: "item",
          url: `/module-preview/list-${item.page_url}`,
        },
      ],
    }));
    setDynamicMenuItems(menuItemss);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
    const menuItems1 = {

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
                  id: "module",
                  title: "Add Module",
                  type: "item",
                  // icon: "feather icon-file-text",
                  // src: dashboardImg4,
                  url: "/module/add-module",
                },
                {
                  id: "module",
                  title: "Module List",
                  type: "item",
                  // icon: "feather icon-file-text",
                  // src: dashboardImg4,
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
                  id: "module-preview",
                  title: "Add Module Preview",
                  type: "item",
                  // icon: "feather icon-file-text",
                  // src: dashboardImg4,
                  url: "/module-preview/add-module-preview",
                },
                {
                  id: "module-preview",
                  title: "Module List Preview",
                  type: "item",
                  // icon: "feather icon-file-text",
                  // src: dashboardImg4,
                  url: "/module-preview/list-module-preview",
                },
              ],
            },
            ...dynamicMenuItems,
          ],
        },
      ],
    };
    // return menuItems1;
// };

export default menuItems1;
