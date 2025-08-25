import {
    dashboardImg1,
    dashboardImg2,
    dashboardImg3,
    dashboardImg4,
    adminTemplate,
    createProject,
  } from "./../src/images";
  const menuItems = {
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
            id: "product",
            title: "Product",
            type: "collapse",
            icon: "feather icon-file-text",
            src: dashboardImg4,
  
            children: [
              {
                id: "product-category",
                title: "Product Features List",
                type: "item",
                // icon: "feather icon-file-text",
                // src: dashboardImg4,
                url: "/product/product-features",
              },
            ],
          },
          {
            id: "Packages",
            title: "Packages",
            type: "collapse",
            icon: "feather icon-file-text",
            src: dashboardImg4,
  
            children: [

              {
                id: "Feature Category",
                title: "Feature Category",
                type: "item",
                // icon: "feather icon-file-text",
                // src: dashboardImg4,
                url: "/packages/feature-category",
              },
              {
                id: "fixed-item-master",
                title: "Fixed Item Master",
                type: "item",
                // icon: "feather icon-file-text",
                // src: dashboardImg4,
                url: "/packages/fixed-item-master",
              },


              {
                id: "Addons",
                title: "Addons",
                type: "item",
                // icon: "feather icon-file-text",
                // src: dashboardImg4,
                url: "/packages/addons-list",
              },

              {
                id: "Add Package",
                title: "Add Package",
                type: "item",
                // icon: "feather icon-file-text",
                // src: dashboardImg4,
                url: "/packages/add-package",
              },
              {
                id: "Package List",
                title: "Package List",
                type: "item",
                // icon: "feather icon-file-text",
                // src: dashboardImg4,
                url: "/packages/package-list",
              },


            ],
          },
          {
            id: "custom",
            title: "Custom",
            type: "collapse",
            icon: "feather icon-file-text",
            src: dashboardImg4,
  
            children: [
              {
                id: "custom",
                title: "Custom List",
                type: "item",
                // icon: "feather icon-file-text",
                // src: dashboardImg4,
                url: "/custom/list",
              },
            ],
          },
          {
            id: "Theme",
            title: "Theme",
            type: "collapse",
            icon: "feather icon-file-text",
            src: dashboardImg4,
            children: [
              {
                id: "Theme",
                title: "Theme List",
                type: "item",
                // icon: "feather icon-file-text",
                // src: dashboardImg4,
                url: "/custom/theme",
              },
            ],
          },
          {
            id: "Editor",
            title: "Editor",
            type: "collapse",
            icon: "feather icon-file-text",
            src: dashboardImg4,
            children: [
              {
                id: "Editor",
                title: "Editor List",
                type: "item",
                // icon: "feather icon-file-text",
                // src: dashboardImg4,
                url: "/custom/editor",
              },
            ],
          },
          {
            id: "Knowledge",
            title: "Knowledge base",
            type: "collapse",
            icon: "feather icon-file-text",
            src: dashboardImg4,
  
            children: [

              {
                id: "Knowledge",
                title: "Category",
                type: "item",
                url: "/knowledge-base/category",
              },
              {
                id: "Knowledge",
                title: "Add Knowledge Base",
                type: "item",
                url: "/knowledge-base/add",
              },
              {
                id: "Knowledge",
                title: "Knowledge Base List",
                type: "item",
                url: "/knowledge-base/list",
              },
            ],
          },

          {
            id: "Coming Soon",
            title: "Coming Soon ",
            type: "collapse",
            icon: "feather icon-file-text",
            src: dashboardImg4,
  
            children: [

              {
                id: "Coming Soon",
                title: "Page Form ",
                type: "item",
                url: "/coming-soon/add",
              },

              {
                id: "Coming Soon",
                title: "Coming Soon page List",
                type: "item",
                url: "/coming-soon/list",
              },
            ],
          },
          
        ],
      },
    ],
  };

  export default menuItems;
  