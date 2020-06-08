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
  commandIp: any;
  queryResult;
  poller;
  persistDataOption = 'N';
  graphData = [];
  numberOfLayers = 1;
  maxNumberOfLayers = 4;
  logsContent: any;
  isPollerActive = false;
  lineColors = ['#3BFF00', 'purple', '#FF0000', '#FFC300 '];
  constructor(private _appService: AppService) { }

  ngOnInit(): void {
    this.logsContent = new Date() + '-> Please wait! Starting the service... \n';
    this.onClickSingleTrace('NOT_POLLER');
  }

  onClickSingleTrace(requestFrom) {
    this._appService.getDataForSingleInstance().subscribe((resdata: {}) => {
      if (typeof resdata['data'] != 'string' && resdata['code'] == 200) {
        if (requestFrom == 'POLLER' && !this.isPollerActive) return;

        this.logsContent +=
          new Date() + '-> Graph plotted for the trace...\n';
        let xData = resdata['data']['xdata'];
        let yData = resdata['data']['ydata'];
        let lineColor = this.lineColors[0];

        if (xData.length != 0 && yData.length != 0) {
          this.logsContent +=
            new Date() +
            '-> Data fetched... \n';
          this.renderChart(xData, yData, lineColor);
        }

        else if (this.persistDataOption == 'Y') {
          this.logsContent +=
            new Date() +
            '-> Overlay successive plots is enabled but no data is received...\n';
          this.logsContent +=
            new Date() +
            '-> Again trying to fetch data!...\n';
          this.onClickSingleTrace('NOT_POLLER');
        }

        


        else {
          this.logsContent +=
            new Date() +
            '-> Overlay successive plot is disabled, no data received...\n';
        }
      }

      else {
        this.logsContent +=
          new Date() +
          '-> Invalid response received, please reload the page...\n';
      }
    });
  }

  onClickRadioBtn(option?) {
    this.persistDataOption = option;
  }

  onClickGetData() {
    let payload = {
      query: this.commandIp,
    };
    this.queryResult = 'Executing command: ' + this.commandIp;
    this.logsContent +=
      new Date() +
      '-> User queried : ' +
      this.commandIp +
      ' \n';
    this._appService.getDataForQuery(payload).subscribe((resdata: {}) => {
      if (resdata['code'] == 200) {
        this.queryResult = resdata['data'];
        if (this.isTextJSON(this.queryResult)) {
          this.queryResult = JSON.parse(this.queryResult);
        }
      }
    });
  }

  isTextJSON(text) {
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
      this.graphData = [];
      this.graphData.push(dataSeries);
    } else {
      dataSeries['lineColor'] = this.lineColors[this.numberOfLayers];
      this.graphData.push(dataSeries);
      this.numberOfLayers++;
      debugger;
      if (this.numberOfLayers > this.maxNumberOfLayers) {
        let color = this.graphData[0]['lineColor'];
        this.graphData.shift();
        this.graphData[this.graphData.length - 1]['lineColor'] = color;
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

      data: this.graphData,
    });
    chart.render();
  }

  onClickStartStop(clickType?) {
    this.graphData = [];
    if (clickType == 'START') {
      this.isPollerActive = true;
      this.logsContent += new Date() + '-> User clicked on START button...\n';
      this.poller = setInterval((_) => {
        this.onClickSingleTrace('POLLER');
      }, 1000);
    } else {
      this.isPollerActive = false;
      clearInterval(this.poller);
      this.logsContent += new Date() + '-> User clicked on STOP button...\n';
    }
  }
}