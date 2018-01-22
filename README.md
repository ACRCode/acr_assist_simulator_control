# ACR Assist Simulator

This applciation helps users to test their own modules againest ACR Assist Schema. 
## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Technical Specifications
*  Nodejs
* Angular 4
* Bootstrap
* JQuery
* Angular- CLI

### Prerequisites

Things you need to install to run this software
  ```
  Install Latest NodeJS 
  ```
### How to run application

* Install necessary configured node packages by running Node Package Manager (npm)
    ```
    $ cd AcrAssistSimulator
    $ npm install -d
    ```
* Run nodejs applciation.
    ```
    $ cd AcrAssistSimulator
    $ npm start
    ```
* Browse http://localhost:4200 to access application. 
 

### How to  deploy the application as a standalone web site

 * Download and install Nodejs.
* Install necessary configured node packages by running Node Package Manager (npm)
    ```
    $ cd AcrAssistSimulator
    $ npm install
    ```
 
* Run the following command to generate the files for deployment
    ```
    $ cd AcrAssistSimulator
    $ npm run build-ci
    ```

*  Copy the contents of the folder ~/AcrAssistSimulator/dist and deploy it as a website in any webserver(IIS / Apache)

### Installing Simulator as a control in existing application
##### Installing Simulator control in angular applciation

* Open project folder and type following commands to download latest simulator packages in to your application
    ```
        $ npm i acr-assist-simulator
    ```
* Import following modules in to your applciation
    ```
    import {SimulatorModule, SimulatorLoderModule } from 'acr-assist-simulator';
    ```
* Access simulator component using this html selector in your html
    ```
    <acr-assist-simulator templateContent="{{xmlfileContent}}" imagePath="{{xmlRelatedImagesPath}}"> Loading .... </acr-assist-simulator>
    ```