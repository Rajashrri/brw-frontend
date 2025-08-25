import React, { useState, useEffect, useRef,useMemo } from "react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";

import grapesjs from "grapesjs";
import gjsPresetWebpage from 'grapesjs-preset-webpage';

import "grapesjs/dist/css/grapes.min.css"; 
import "grapesjs-preset-webpage"; 
import "grapesjs-blocks-basic";
import "grapesjs-plugin-forms";
import "grapesjs-component-countdown";
import "grapesjs-tabs";
import "grapesjs-custom-code";
import "grapesjs-tooltip";
import "grapesjs-style-bg";


const Editor = () => {
    const editorRef = useRef(null);

    // useEffect(() => {
    //     const editor = grapesjs.init({
    //       container: "#gjs",
    //       fromElement: true,
    //       height: "100vh",
    //       width: "100%",
    //       storageManager: { autoload: false },
    //       plugins: ["gjs-preset-webpage"], // Adds basic webpage components
    //       blockManager: {
    //         appendTo: "#blocks",
    //       },
    //     });
    
    //     // Add basic blocks
    //     editor.BlockManager.add("text", {
    //       label: "Text Block",
    //       content: "<p>This is a text block</p>",
    //     });
    
    //     editor.BlockManager.add("image", {
    //       label: "Image Block",
    //       content: "<img src='https://via.placeholder.com/150' width='100%'/>",
    //     });
    
    //     editorRef.current = editor;
    
    //     editor.DomComponents.addType("my-custom-type", {
    //         model: {
    //           defaults: {
    //             tagName: "div",
    //             draggable: true,
    //             stylable: true,
    //             content: "Editable Component",
    //             traits: [{ name: "id", label: "ID" }],
    //           },
    //         },
    //       });

    //     return () => editor.destroy();
    //   }, []);

    useEffect(() => {
        const editor = grapesjs.init({
            container: "#gjs",
            height: "100vh",
            width: "100%",
            storageManager: { autoload: false },
            plugins: [
                gjsPresetWebpage,
                "grapesjs-blocks-basic",
                "grapesjs-plugin-forms",
                "grapesjs-component-countdown",
                "grapesjs-tabs",
                "grapesjs-custom-code",
                "grapesjs-tooltip",
                "grapesjs-style-bg",
            ],
            blockManager: { appendTo: "#blocks" },
        });

        // SECTION
        editor.BlockManager.add("section", {
            label: "Section",
            content: `<section class="section-block" style="padding:20px; background:#f3f3f3; min-height:100px; display:flex; flex-direction:column; gap:10px;">Drop elements here</section>`,
            category: "Basic",
            attributes: { class: "fa fa-square" },
            selectable: true,
            droppable: true,
        });

        // TEXT
        editor.BlockManager.add("text", {
            label: "Text",
            content: `<p class="text-block" style="font-size:16px;">Drag me inside a section</p>`,
            category: "Basic",
            attributes: { class: "fa fa-font" },
        });

        // IMAGE
        editor.BlockManager.add("image", {
            label: "Image",
            content: `<img class="image-block" src="https://via.placeholder.com/150" width="100%" style="max-width:200px;"/>`,
            category: "Basic",
            attributes: { class: "fa fa-image" },
        });

        // BUTTON
        editor.BlockManager.add("button", {
            label: "Button",
            content: `<button class="btn-block" style="padding:10px 20px; background:#007BFF; color:#fff; border:none; cursor:pointer;">Click Me</button>`,
            category: "Basic",
            attributes: { class: "fa fa-hand-pointer" },
        });

        // LINK
        editor.BlockManager.add("link", {
            label: "Link",
            content: `<a href="#" class="link-block" style="color:#007BFF; text-decoration:underline;">Click here</a>`,
            category: "Basic",
            attributes: { class: "fa fa-link" },
        });

        // QUOTE
        editor.BlockManager.add("quote", {
            label: "Quote",
            content: `<blockquote class="quote-block" style="border-left:5px solid #007BFF; padding:10px;">"This is a quote."</blockquote>`,
            category: "Basic",
            attributes: { class: "fa fa-quote-left" },
        });

        // FORM INPUT
        editor.BlockManager.add("input", {
            label: "Input Field",
            content: `<input type="text" class="input-block" placeholder="Enter text here" style="width:100%; padding:8px; border:1px solid #ccc;" />`,
            category: "Forms",
            attributes: { class: "fa fa-keyboard" },
        });

        // TEXTAREA
        editor.BlockManager.add("textarea", {
            label: "Textarea",
            content: `<textarea class="textarea-block" rows="4" placeholder="Enter text here" style="width:100%; padding:8px; border:1px solid #ccc;"></textarea>`,
            category: "Forms",
            attributes: { class: "fa fa-align-left" },
        });

        // SELECT DROPDOWN
        editor.BlockManager.add("select", {
            label: "Select Dropdown",
            content: `<select class="select-block" style="width:100%; padding:8px; border:1px solid #ccc;">
                        <option value="">Select an option</option>
                        <option value="1">Option 1</option>
                        <option value="2">Option 2</option>
                      </select>`,
            category: "Forms",
            attributes: { class: "fa fa-list" },
        });

        // CHECKBOX
        editor.BlockManager.add("checkbox", {
            label: "Checkbox",
            content: `<label class="checkbox-block"><input type="checkbox"> Check me</label>`,
            category: "Forms",
            attributes: { class: "fa fa-check-square" },
        });

        // VIDEO
        editor.BlockManager.add("video", {
            label: "Video",
            content: `<video width="320" height="240" controls>
                        <source src="movie.mp4" type="video/mp4">
                      </video>`,
            category: "Media",
            attributes: { class: "fa fa-video" },
        });

        // COUNTDOWN
        editor.BlockManager.add("countdown", {
            label: "Countdown",
            content: `<div class="countdown-block" data-time="2025-12-31 00:00:00"></div>`,
            category: "Advanced",
            attributes: { class: "fa fa-hourglass" },
        });

        // TABLE
        editor.BlockManager.add("table", {
            label: "Table",
            content: `<table border="1" width="100%">
                        <tr><th>Header 1</th><th>Header 2</th></tr>
                        <tr><td>Row 1</td><td>Row 2</td></tr>
                      </table>`,
            category: "Advanced",
            attributes: { class: "fa fa-table" },
        });

        // TABS
        editor.BlockManager.add("tabs", {
            label: "Tabs",
            content: `<div class="tabs-block">
                        <ul>
                            <li><a href="#">Tab 1</a></li>
                            <li><a href="#">Tab 2</a></li>
                        </ul>
                        <div>Content for Tab 1</div>
                        <div>Content for Tab 2</div>
                      </div>`,
            category: "Advanced",
            attributes: { class: "fa fa-folder" },
        });

        // SAVING REFERENCE
        editorRef.current = editor;

        return () => editor.destroy();
    }, []);


      const saveContent = () => {
        const html = editorRef.current.getHtml();
        localStorage.setItem("savedPage", html);
      };

      const loadContent = () => {
        const savedHtml = localStorage.getItem("savedPage");
        if (savedHtml) {
          editorRef.current.setComponents(savedHtml);
        }
      };
      
  return (
    <Container>
      <Row>
        <Col lg={12}>
          <Card className="create_new_page_card add-module module-list">
            <Card.Header>
              <Row className="justify-content-between">
                <Col md={12}>
                  <h3>Editor</h3>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
            <div style={{ display: "flex", height: "100vh" }}>
                <div id="blocks" style={{ width: "250px", background: "#f8f9fa", padding: "10px" }}></div>
                <div id="gjs" style={{ flexGrow: 1 }}></div>
            </div>
            <button className="btn btn-outline-secondary" onClick={saveContent}>Save</button>
            <button className="btn btn-outline-secondary"  onClick={loadContent}>Load</button>
            </Card.Body>
          </Card>
        </Col>
      </Row>


    </Container>

    
  );
};

export default Editor;
