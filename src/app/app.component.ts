import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import * as CanvasJS from './canvasjs.min';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'OSA';
  logic: any;
  requestOutput;
  poller;
  persistDataOption = 'N';
  chartData = [];
  numberOfLayers = 1;
  maxNumberOfLayers = 4;
  communicationText: any;
  isInterval = false;
  lineColors = ['#3BFF00', 'purple', '#FF0000', '#FFC300 '];
  constructor(private service: AppService) { }

  ngOnInit(): void {
    this.communicationText = new Date() + '-> Please wait! Starting the service... \n';
    this.onClickSingleTrace('notInterval');
  }

  onClickSingleTrace(Source) {
    this.service.getSingleTrace().subscribe((resdata: {}) => {
      if (typeof resdata['data'] != 'string' && resdata['code'] == 200) {
        if (Source == 'INTERVAL' && !this.isInterval) return;

        this.communicationText +=
          new Date() + '-> Graph plotted for the trace...\n';
        let xData = resdata['data']['xdata'];
        let yData = resdata['data']['ydata'];
        let lineColor = this.lineColors[0];

        if (xData.length != 0 && yData.length != 0) {
          this.communicationText +=
            new Date() +
            '-> Data fetched... \n';
          this.renderChart(xData, yData, lineColor);
        }

        else if (this.persistDataOption == 'Y') {
          this.communicationText +=
            new Date() +
            '-> Overlay successive plots is enabled but no data is received...\n';
          this.communicationText +=
            new Date() +
            '-> Again trying to fetch data!...\n';
          this.onClickSingleTrace('notInterval');
        }

        


        else {
          this.communicationText +=
            new Date() +
            '-> Overlay successive plot is disabled, no data received...\n';
        }
      }

      else {
        this.communicationText +=
          new Date() +
          '-> Invalid response received, please reload the page...\n';
      }
    });
  }

  onClickPersistDataOption(option?) {
    this.persistDataOption = option;
  }

  onClickGetData() {
    let payload = {
      query: this.logic,
    };
    this.requestOutput = 'Executing command: ' + this.logic;
    this.communicationText +=
      new Date() +
      '-> User queried : ' +
      this.logic +
      ' \n';
    this.service.getRequestData(payload).subscribe((resdata: {}) => {
      if (resdata['code'] == 200) {
        this.requestOutput = resdata['data'];
        if (this.isValidJSON(this.requestOutput)) {
          this.requestOutput = JSON.parse(this.requestOutput);
        }
      }
    });
  }

  isValidJSON(text) {
    return /^[\],:{}\s]*$/.test(
      text
        .replace(/\\["\\\/bfnrtu]/g, '@')
        .replace(
          /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
          ']'
        )
        .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
    );
  }

  renderChart(xData, yData, lineColor) {
    var dataSeries = { type: 'line' };
    var dataPoints = [];
    for (let i = 0; i < xData.length; i++) {
      dataPoints.push({ x: xData[i], y: yData[i] });
    }
    dataSeries['lineColor'] = lineColor;
    dataSeries['dataPoints'] = dataPoints;
    if (this.persistDataOption == 'N') {
      this.chartData = [];
      this.chartData.push(dataSeries);
    } else {
      dataSeries['lineColor'] = this.lineColors[this.numberOfLayers];
      this.chartData.push(dataSeries);
      this.numberOfLayers++;
      debugger;
      if (this.numberOfLayers > this.maxNumberOfLayers) {
        let color = this.chartData[0]['lineColor'];
        this.chartData.shift();
        this.chartData[this.chartData.length - 1]['lineColor'] = color;
      }
    }

    let chart = new CanvasJS.Chart('chartContainer', {
      zoomEnabled: true,
      exportEnabled: true,
      backgroundColor: "black",
      axisY: {
        title: "Signal (dBm)",
            lineColor: "#888888",
            tickColor: "#888888",
            labelFontColor: "#888888",
            gridDashType: "dash",
            gridColor: "#34495E ",
            titleFontColor: "#888888",
      },
      axisX: {
        title: 'Wavelength',
        lineColor: "#888888",
        tickColor: "#888888",
        gridColor: "#34495E ",
        gridDashType: "dash",
        labelFontColor: "#888888",
        titleFontColor: "#888888",

      },

      data: this.chartData,
    });
    chart.render();
  }

  onClickStartStop(clickType?) {
    this.chartData = [];
    if (clickType == 'START') {
      this.isInterval = true;
      this.communicationText += new Date() + '-> User clicked on START button...\n';
      this.poller = setInterval((_) => {
        this.onClickSingleTrace('INTERVAL');
      }, 1000);
    } else {
      this.isInterval = false;
      clearInterval(this.poller);
      this.communicationText += new Date() + '-> User clicked on STOP button...\n';
    }
  }
}