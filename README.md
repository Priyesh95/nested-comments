# Nested Comments

This Application is made in Javascript. To run the application.
1. Please navigate to the project folder and run npm install -g http-server. 
2. Run http-server in the command prompt. 
3. Thereafter open http://127.0.0.1:8080/index.html in browser.

## Code Architecture

The javascript file is divided into three parts 
1. GLOBAL CONTROLLER: Global controller initializes the application and renders comments if already present in ocal storage. This Controller is used as intermediate between the UI and comment controllers.
2. UI CONTROLLER: This controller makes any changes to the DOM and handles all UI functionalities.
3. COMMENT CONTROLLER: This controller has all the comment prototype and also maintains the comments data structure.

## Please Note

The comments are being stored in Local Storage of browser instaed of any db. Due to shortage of time I could not add server side and back end implementation. If required, please let me know and I will try to implement the remaining functionalities after office hours. 
