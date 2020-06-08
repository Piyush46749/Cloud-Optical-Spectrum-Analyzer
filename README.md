# Cloud Optical Spectrum Analyzer

Cloud OSA is a basic text command interface of the legacy laboratory system that visualizes the data fetched from OSA within specified limits.

## Deployment (http://54.237.44.5/)
* Deployed on AWS using EC2.

## Demo Link (https://streamable.com/4yepc9)
* This video gives the overview of Cloud OSA application.

## Built Using 

* **Python Flask**
* **Angular 9.1.1**

## Tools Used

* **Visual Studio Code 1.45.1**
* **PyCharm Community 2020.1.2**
*  **Sublime Text 3.2.1**

## Installation

1. Open command prompt and clone the repository using:
```bash
git clone https://github.com/Piyush46749/Cloud-Optical-Spectrum-Analyzer.git
```
2. Navigate to the cloned folder and install the packages used in Angular using the command:
```bash
npm install
```
3. To install the python packages, locate the requirements.txt file (present in the folder named "flask_files") using cmd and run:
```bash
pip install -r requirements.txt
```
4. Locate the project.py file (present in folder named "flask_files") using cmd and run the command:
```bash
python project.py
```
Now your flask app is serving on http://localhost:5000/

5. Finally, open a separate command prompt and navigate inside the cloned folder. Now, run the command:
```bash
ng serve
```

Project is serving on http://localhost:4200/


## Features

* This application has 3 buttons (SINGLE, START, and STOP) that control the visualization workflow. 
   1. **SINGLE**- Retrieves a single trace from the virtual OSA and plots the graph based on the data received.
   2. **START**- Initiates the continuous (repetitive) acquisition with a ~1Hz refresh rate.
   3. **STOP**- Stops the continuous (repetitive) acquisition.

* **Plot Persistence**- There is a maximum of 4 layers (Green, Purple, Red, and Yellow) in the plot since overlaying more layers will make the entire plot too clumsy and noncomprehensive. 
Upon reaching the limit of 4 layers, the **oldest plot is replaced with the latest one**, and the cycle goes on.

In this manner, the user can efficiently **compare the last 4 traces** and even **Print** or **Save** the same in **PNG** or **JPEG*** format.

Users can overlay the plots with the help of both **SINGLE** and **START** button, if overlay is enabled using radio button.

NOTE: By default, the graph is plotted (in Green colour) for a single trace on page load.

```bash
If the user enables the "Overlay Successive Plots" (clicks on Yes) and then clicks on the "SINGLE" button, then the graph with the "Purple" colour will be plotted on top of the previous one.
If the user still keeps on clicking on "SINGLE" button, consecutive graphs will be plotted with different colours (Red and Yellow) on each click.
```

```bash
If the user enables the "Overlay Successive Plots" (clicks on Yes) and then clicks on the "START" button, each second, a new graph will be plotted on top of the previous one. 
Once the limit is reached to 4 plots, the oldest plot will be replaced by the latest one.
Users can click on the "STOP" button at any point in time.
```

```bash
If the user disables the "Overlay Successive Plots" (clicks on No), then "SINGLE" and "START" buttons will behave normally, that is, each time a new graph will be plotted with "Green" colour.
```

* **Execute Query**- It has a text area and a button, named "EXECUTE", to send and query the command entered by the user.

```bash
For instance- If the user writes "TRACE" and clicks on the "EXECUTE" button, the data is fetched and displayed in the scrollable area.
```
* **REST endpoint**- User can send query via my endpoint and get the data.

```bash
For instance- http://54.237.44.5:5000/api/TRACE will retrieve the JSON response.
```

* **Zoom, Pan, Save (PNG, JPEG), Print, and Read Data Values of the Plot**- Upon plotting the graph, the user can select the specific area on the plot (using the mouse) and have that area zoomed.
Once the plot is zoomed, the user can **PAN**, **READ VALUES** of the graph, **RESET** the graphs, or click on **More Options** button (top-right of the plot) to **PRINT**, or **SAVE** the plot in **JPEG** or **PNG** format.
```bash
I have provided the "PRINT", and "SAVE" functionality so that user can save the graph instantly and keep it as a record whenever needed.
```

* **Communication Logs**- It provides a scrollable text area with a communication log between instrument & user (useful for debugging hardware issues in the laboratory).
The logs are provided with the date, time, and the time-zone in which this application is being used.
