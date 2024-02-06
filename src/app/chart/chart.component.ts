import { Component, ElementRef, HostListener, Input, SimpleChanges, ViewChild } from '@angular/core';
import { of, debounceTime } from 'rxjs';
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

  @HostListener('window:resize', ['$event'])
  @HostListener('window:mouseover', ['$event'])
  onResize() {
    this.checkSize();
  }

  ngOnInit(): void {
    this.widgetId = this.widgetId ? this.widgetId : "defaultPlotlyWidgetId";
    this.setMultiChartLayout(this._layout);
    this.setMultiChartConfig(this.config);
    this.checkSize();
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
}
