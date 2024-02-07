import { Component, ElementRef, HostListener, Input, SimpleChanges, ViewChild } from '@angular/core';
import { of, debounceTime, BehaviorSubject } from 'rxjs';
import { cloneDeep } from 'lodash';
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-basic-dist-min';
import { CommonModule } from '@angular/common';
PlotlyModule.plotlyjs = PlotlyJS;

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  standalone: true,
  imports:[PlotlyModule, CommonModule]
})
export class ChartComponent {
  _defaultTrace: any;
  _traces: any;
  _layout: any = {};
  _defaultLayout: any;
  @Input() set traces(traces: any) {
    this._defaultTrace = cloneDeep(traces);
    this._traces = traces;
  }
  @Input() set layout(layout: any) {
    this._defaultLayout = cloneDeep(layout);
    this._layout = layout;
    this.setMultiChartLayout(this._layout);
    this.setMultiChartConfig(this.config);
  }
  @Input() customHeight: any;
  @Input() config: any = {
    responsive: true,
    autosize: true,
    useResizeHandler: true,
    style: { width: '100%', height: '100%' },
    displaylogo: false,
    displayModeBar: null,
  };

  @Input() widgetId: string;
  @Input() heightRatio: number = 0;
  @ViewChild('plotlyWidthDiv', { static: false }) plotlyWidthDiv: ElementRef;
  public graphHeight: number = 215;
  public graphWidth: number = 215;
public customData: BehaviorSubject<boolean>  = new BehaviorSubject<boolean>(true);
public liveData: BehaviorSubject<any>  = new BehaviorSubject<any>(null);
  @HostListener('window:resize', ['$event'])
  @HostListener('window:mouseover', ['$event'])
  onResize() {
    this.checkSize();
  }
  ngOnInit(): void {
    this.customData.subscribe((data) => {
      if (data) {
        this.setData();
      } else {
        this.clearData();
      }
    })
    this.widgetId = this.widgetId ? this.widgetId : "defaultPlotlyWidgetId";
    this.setMultiChartLayout(this._layout);
    this.setMultiChartConfig(this.config);
    this.checkSize();
    this.liveData.subscribe((val) => {
      if (val) {
        this._traces = val.traces;
        this._layout = val.layout;
        this.config = val.config;
      }
    });
  }

  clearData() {
    this.customHeight = 380;
    this._traces = [];
    this._layout = [];
    this.config = [];
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?._layout?.firstChange && changes?._layout?.currentValue) {
      this.setMultiChartLayout(this._layout);
    }

    if (!changes?.config?.firstChange) {
      this.setMultiChartConfig(this.config);
    }
    this.checkSize();

    of(true).pipe(debounceTime(500)).subscribe(() => {
      this.checkSize();
    });

  }

  ngAfterViewInit(): void {
    this.checkSize();
  }

  setMultiChartLayout(layout: any = {}) {
    if (layout) {
      layout = {
        ...layout,
        ...{ plot_bgcolor: 'transparent', paper_bgcolor: 'transparent', ...layout, height: this.graphHeight, width: this.graphWidth, autosize: true },
      };
      this._layout = cloneDeep(layout);
    }
  }

  setMultiChartConfig(config: any = {}) {
    this.config = {
      ...{
        responsive: true,
        autosize: true,
        useResizeHandler: true,
        style: { width: '100%', height: '100%' },
        displaylogo: false,
        displayModeBar: null,
      },
      ...config
    }
  }
  checkSize() {
    of(true).pipe(debounceTime(1)).subscribe(() => {
      let height = 215, width = 215;
      const plotlyWidthDiv = this.plotlyWidthDiv?.nativeElement?.getBoundingClientRect();
      width = plotlyWidthDiv?.width || width;
      if (height !== this.graphHeight || width !== this.graphWidth) {
        if (this.heightRatio <= 0) {
          if (this.customHeight) {
            this.graphHeight = this.customHeight;
          } else {
            this.graphHeight = height;
          }
        }
        else {
          this.graphHeight = width * this.heightRatio;
        }
        this.graphWidth = width;
        this.setMultiChartLayout(this._layout);
      }
    })
  }


  setData() {
    this.customHeight = 380;
    this.layout = {
      "barmode": "bar",
      "hovermode": "closest",
      "insidetextfont": {
        "color": "var(--color-text-common-primary)"
      },
      "xaxis": {
        "color": "#ffffff",
        "linewidth": "0.73px",
        "linecolor": "#ffffff",
        "title": "",
        "tickfont": {
          "family": "var(--font-family-body-small)",
          "size": 12
        },
        "tickcolor": "#ffffff",
        "tickwidth": "0.73px",
        "fixedrange": true,
        "showline": true
      },
      "yaxis": {
        "color": "#ffffff",
        "rangemode": "tozero",
        "title": {
          "text": "Kilotonnes",
          "font": {
            "family": "var(--font-family-label-small)",
            "size": 12,
            "weight": "var(--font-weight-label-small)"
          },
          "standoff": 20
        },
        "tickfont": {
          "family": "var(--font-family-body-small)",
          "size": 12
        },
        "gridcolor": "#595959",
        "fixedrange": true,
        "zeroline": false
      },
      "showlegend": false,
      "legend": {
        "orientation": "h",
        "x": 0.5,
        "xanchor": "center",
        "y": -0.6,
        "entrywidth": 0,
        "font": {
          "color": "white"
        }
      },
      "height": 380,
      "margin": {
        "t": 50,
        "b": 50,
        "l": 110,
        "r": 51
      },
      "showline": false
    };
    this.traces = [
      {
        "x": [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Sep",
          "Sep"
        ],
        "y": [
          139.84,
          128.44,
          139.17,
          135.85,
          112.41,
          108.64,
          142.24,
          137.32,
          70.12,
          32.58,
          34.48
        ],
        "text": [
          136.61,
          122.62,
          136.11,
          131.52,
          135.12,
          108.89,
          135.67,
          127.94,
          68.15,
          32.3,
          31.81
        ],
        "textposition": "none",
        "customdata": [
          [
            139.84,
            54.513
          ],
          [
            128.44,
            5.857
          ],
          [
            139.17,
            "N/A"
          ],
          [
            135.85,
            "N/A"
          ],
          [
            112.41,
            "N/A"
          ],
          [
            108.64,
            "N/A"
          ],
          [
            142.24,
            "N/A"
          ],
          [
            137.32,
            "N/A"
          ],
          [
            70.12,
            "N/A"
          ],
          [
            32.58,
            "N/A"
          ],
          [
            34.48,
            "N/A"
          ]
        ],
        "type": "bar",
        "name": "Produced",
        "shape": "square",
        "marker": {
          "color": "rgba(119, 128, 211,1)"
        },
        "width": 0.275,
        "hoverlabel": {
          "namelength": 20,
          "align": "left",
          "bgcolor": "rgb(65, 65, 65)",
          "bordercolor": "rgba(248, 248, 248, 1)",
          "font": {
            "family": "var(--font-family-body-small)",
            "color": "var(--color-text-common-primary)",
            "size": 12
          }
        },
        "hovertemplate": "<span>Produced - %{customdata[0]}</span><br><span>Target - %{text}</span><extra></extra><br><span>Optimized - %{customdata[1]}</span>",
        "color": "rgba(119, 128, 211,1)"
      },
      {
        "x": [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Sep",
          "Sep"
        ],
        "y": [
          136.61,
          122.62,
          136.11,
          131.52,
          135.12,
          108.89,
          135.67,
          127.94,
          68.15,
          32.3,
          31.81
        ],
        "text": [
          136.61,
          122.62,
          136.11,
          131.52,
          135.12,
          108.89,
          135.67,
          127.94,
          68.15,
          32.3,
          31.81
        ],
        "customdata": [
          [
            139.84,
            54.513
          ],
          [
            128.44,
            5.857
          ],
          [
            139.17,
            "N/A"
          ],
          [
            135.85,
            "N/A"
          ],
          [
            112.41,
            "N/A"
          ],
          [
            108.64,
            "N/A"
          ],
          [
            142.24,
            "N/A"
          ],
          [
            137.32,
            "N/A"
          ],
          [
            70.12,
            "N/A"
          ],
          [
            32.58,
            "N/A"
          ],
          [
            34.48,
            "N/A"
          ]
        ],
        "mode": "markers",
        "name": "Target",
        "marker": {
          "color": "",
          "size": 30,
          "symbol": "line-ew",
          "line": {
            "color": [
              "rgb(205, 239, 108)",
              "rgb(205, 239, 108)",
              "rgb(205, 239, 108)",
              "rgb(205, 239, 108)",
              "rgb(250, 153, 139)",
              "rgb(250, 153, 139)",
              "rgb(205, 239, 108)",
              "rgb(205, 239, 108)",
              "rgb(205, 239, 108)",
              "rgb(205, 239, 108)",
              "rgb(205, 239, 108)"
            ],
            "width": 3
          }
        },
        "hoverlabel": {
          "namelength": 20,
          "align": "left",
          "bgcolor": "rgb(65, 65, 65)",
          "bordercolor": "rgba(248, 248, 248, 1)",
          "font": {
            "family": "var(--font-family-body-small)",
            "color": "var(--color-text-common-primary)",
            "size": 12
          }
        },
        "hovertemplate": "<span>Produced - %{customdata[0]}</span><br><span>Target - %{text}</span><extra></extra><br><span>Optimized - %{customdata[1]}</span>",
        "color": "rgba(208, 208, 208,1)"
      },
      {
        "x": [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Sep",
          "Sep"
        ],
        "y": [
          54.513,
          5.857,
          "N/A",
          "N/A",
          "N/A",
          "N/A",
          "N/A",
          "N/A",
          "N/A",
          "N/A",
          "N/A"
        ],
        "text": [
          136.61,
          122.62,
          136.11,
          131.52,
          135.12,
          108.89,
          135.67,
          127.94,
          68.15,
          32.3,
          31.81
        ],
        "customdata": [
          [
            139.84,
            54.513
          ],
          [
            128.44,
            5.857
          ],
          [
            139.17,
            "N/A"
          ],
          [
            135.85,
            "N/A"
          ],
          [
            112.41,
            "N/A"
          ],
          [
            108.64,
            "N/A"
          ],
          [
            142.24,
            "N/A"
          ],
          [
            137.32,
            "N/A"
          ],
          [
            70.12,
            "N/A"
          ],
          [
            32.58,
            "N/A"
          ],
          [
            34.48,
            "N/A"
          ]
        ],
        "mode": "markers",
        "name": "Optimized Potential",
        "marker": {
          "color": "",
          "size": 30,
          "symbol": "line-ew",
          "line": {
            "color": "#DD7CC2",
            "width": 3
          }
        },
        "hoverlabel": {
          "namelength": 20,
          "align": "left",
          "bgcolor": "rgb(65, 65, 65)",
          "bordercolor": "rgba(248, 248, 248, 1)",
          "font": {
            "family": "var(--font-family-body-small)",
            "color": "var(--color-text-common-primary)",
            "size": 12
          }
        },
        "hovertemplate": "<span>Produced - %{customdata[0]}</span><br><span>Target - %{text}</span><extra></extra><br><span>Optimized - %{customdata[1]}</span>"
      }
    ];
    this.config = {
      "responsive": true,
      "autosize": true,
      "useResizeHandler": true,
      "style": {
        "width": "100%",
        "height": "100%"
      },
      "displaylogo": false,
      "displayModeBar": null
    };
  }
}
