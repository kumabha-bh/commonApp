import { DatePipe } from '@angular/common';
import { Component, Inject, Input, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { chartTargetColorMapping, hoverLableBarChart, noDataFoundErrorObjStatus, otherErrorObjStatus, polyChartColors, svgFillCirclePath } from './constant/app.constant';
import { isUndefined, sum, map, isEmpty,uniq } from 'lodash';
import { ComponentLibraryModule } from '@bh-digitalsolutions/ui-toolkit-angular/dist/';
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-basic-dist-min';
import { CommonModule } from '@angular/common';
import { PlotlyWrapperComponent } from './plotly-wrapper/plotly-wrapper.component';
PlotlyModule.plotlyjs = PlotlyJS;


@Component({
  selector: 'app-trend-widget',
  templateUrl: './trend-widget.component.html',
  styleUrls: ['./trend-widget.component.scss'],
  standalone:true,
  imports:[PlotlyWrapperComponent, PlotlyModule,ComponentLibraryModule, CommonModule]

})
export class TrendWidgetComponent {
  @Input() productionVolumeTrendDetails: any;
  @Input() productionVolumeTrendIsLoading: boolean;
  @Input() missedOpportunityPerMonthDetails: any[];
  @Input() noDataFound: boolean = false;
  @Input() productionVolumeTrendTitles;
  @Input() errorObj = {};
  datePipe: DatePipe = new DatePipe('en-US');
  circleSvgPath: string = svgFillCirclePath;
  productionVolTrend: any;
  yAxisOptimized_potential: any[] = [];
  xAxisLabel: any = [];
  xAxisLabelToGetCurrentMonth: any = [];
  constructor() {
  }

  ngOnInit(): void {
    this.setProductionVolTrend(this.productionVolumeTrendDetails);
  }


  setProductionVolTrend(apiData: any) {
    this.createLayout()
    if (!this.productionVolumeTrendIsLoading) {
      if ((apiData != undefined)) {
        this.productionVolTrend.traces = [];
        this.productionVolTrend.error = false;
        this.setTraceData(apiData);
        this.setTracesColor();
      } else {
        this.productionVolTrend.error = true;
      }
    }
  }

  createLayout() {
    this.productionVolTrend = {
      layout: {
        barmode: "bar",
        hovermode: "closest",
        insidetextfont: {
          color: "var(--color-text-common-primary)"
        },
        xaxis: {
          color: polyChartColors.mappings.whiteColor,
          linewidth: "0.73px",
          linecolor: polyChartColors.mappings.whiteColor,
          title: "",

          tickfont: {
            family: "var(--font-family-body-small)",
            size: 12
          },
          tickcolor: polyChartColors.mappings.whiteColor,
          tickwidth: '0.73px',
          fixedrange: true,
          showline: true,

        },
        yaxis: {
          color: polyChartColors.mappings.whiteColor,
          rangemode: 'tozero',
          title:
          {
            text: this.productionVolumeTrendTitles.yAxisTitle,
            font: {
              family: 'var(--font-family-label-small)',
              size: 12,
              weight: 'var(--font-weight-label-small)'
            },
            standoff: 20

          },
          tickfont: {
            family: "var(--font-family-body-small)",
            size: 12
          },
          gridcolor: polyChartColors.mappings.gridColor,
          fixedrange: true,
          zeroline: false
        },
        showlegend: false,
        legend: { orientation: 'h', x: 0.5, "xanchor": "center", y: -0.6, entrywidth: 0, font: { color: "white" } },
        // height: 425,
        height: 380,
        margin: { t: 50, b: 50, l: 110, r: 51 },
        showline: false
      },
      config: {
        responsive: true,
        autosize: true,
        useResizeHandler: true,
        style: {
          width: '100%',
          height: '100%',
        },
        displaylogo: false,
        displayModeBar: null,
      },
      traces: []
    };
  }
  setOptimisedPotential() {
    const optimizedPotential = Array(this.xAxisLabel.length).fill(this.productionVolumeTrendTitles.NA, 0, this.xAxisLabel.length);
    if (!isEmpty(this.missedOpportunityPerMonthDetails)) {
      this.missedOpportunityPerMonthDetails.forEach((data: any) => {
        const index = this.xAxisLabel.indexOf(data.month);
        if (index > -1) {
          optimizedPotential.splice(index, 1, data.optimisedPotential);
        }
      });
    }
    return optimizedPotential;
  }

  setTraceData(apiData: any) {
    let sortedData = this.getDateWiseGroupData(apiData);
     const {yAxisTarget, yAxisActual}  = this.getTrendData(sortedData, ['Target', 'Actual']);
    this.yAxisOptimized_potential = this.setOptimisedPotential();
    let mergedData = isEmpty(yAxisActual) ? [] : yAxisActual.map((v,i) => [v, this.yAxisOptimized_potential[i]]);
    let template = "<span>Produced - %{customdata[0]}</span><br><span>Target - %{text}</span><extra></extra><br><span>Optimized - %{customdata[1]}</span>";
    this.productionVolTrend.traces.push({
      x: this.xAxisLabel,
      y: yAxisActual,
      text: yAxisTarget,
      textposition: "none",
      customdata: mergedData,
      type: "bar",
      name: "Produced",
      shape: 'square',
      marker: {
        color: chartTargetColorMapping.mappings.color_data_viz_comparison_primary.color
      },
      width: this.xAxisLabel.length * 0.025,
      hoverlabel: hoverLableBarChart,
      hovertemplate: template
    },
      {
        x: this.xAxisLabel,
        y: yAxisTarget,
        text: yAxisTarget,
        customdata: mergedData,
        mode: "markers",
        name: "Target",
        marker: {
          color: '',
          size: 30,
          symbol: "line-ew",
          line: {
            color: '',
            width: 3,
          },
        },

        hoverlabel: hoverLableBarChart,
        hovertemplate: template
      },

      {
        x: this.xAxisLabel,
        y: this.yAxisOptimized_potential,
        text: yAxisTarget,
        customdata: mergedData,
        mode: "markers",
        name: "Optimized Potential",
        marker: {
          color: '',
          size: 30,
          symbol: "line-ew",
          line: {
            color: '#DD7CC2',
            width: 3,
          },
        },
        hoverlabel: hoverLableBarChart,
        hovertemplate: template
      },

    );
  }

  getTrendData(res: any, trendTpe: string[]) {
    const yAxisTarget = [];
    const yAxisActual = [];
    this.xAxisLabel = [];
    this.xAxisLabelToGetCurrentMonth = [];
    res.map((v: any) => {
      this.xAxisLabel.push(this.datePipe.transform(v[0].date, "MMM"));
      this.xAxisLabelToGetCurrentMonth.push(this.datePipe.transform(v[0].date, "MMM YYYY"));
      yAxisTarget.push(Number((sum(map(v, trendTpe[0])) / 1000).toFixed(2)));
      yAxisActual.push(Number((sum(map(v, trendTpe[1])) / 1000).toFixed(2)));
    });
    return { yAxisTarget, yAxisActual };
  }

  setTracesColor() {
    let traceData = this.productionVolTrend.traces;
    if (traceData?.length > 0) {
      let isValid = this.isCurrentMonthYear(this.xAxisLabelToGetCurrentMonth.slice(-1)[0]);
      let produced_volume = traceData[0]?.y;

      traceData[1].marker.line.color = traceData[1]?.y?.map(function (target: number, index: number) {
        if (Number(target) <= Number(produced_volume[index])) {
          return chartTargetColorMapping.mappings.profit.color;
        }
        return (((traceData[1]?.y?.length - 1) == index) && (isValid)) ?
          chartTargetColorMapping.mappings.fill_data_viz_comparison_secondary.color : chartTargetColorMapping.mappings.loss.color;
      });

      if (isValid) {
        traceData[0].marker.color = produced_volume?.map(function (produced: any, index: number) {
          return (index == (produced_volume?.length - 1)) ? chartTargetColorMapping.mappings.curren_month.color :
            chartTargetColorMapping.mappings.color_data_viz_comparison_primary.color;
        });
      }
      traceData[1].color = chartTargetColorMapping.mappings.fill_data_viz_comparison_secondary.color;
      traceData[0].color = chartTargetColorMapping.mappings.color_data_viz_comparison_primary.color;
    }
  }

  isCurrentMonthYear(date: any) {
    return !!((new Date().getMonth() == new Date(date).getMonth()) &&
      (new Date().getFullYear() == new Date(date).getFullYear()))
  }

  
  getDateWiseGroupData(apiData: any) {
    let ref: any = {};
    let numOfYears = uniq(map(apiData, function (obj) {
      return new Date(obj.date).getFullYear();
    }));
    return apiData.reduce((arr1: any, o: any) => {
      let m = new Date(o.date).getMonth();
      let year = new Date(o.date).getFullYear();
      let index = (numOfYears[0] == year) ? m : (12 + m);
      if (!(index in ref)) {
        ref[index] = arr1.length;
        arr1.push([]);
      }
      arr1[ref[index]].push(o);
      return arr1;
    }, []);
  }

  
  //ngOnchange will not trigger if input value get changed through main application
  // ngOnChanges(changes: SimpleChanges) {
  //   if (isEmpty(changes)) {
  //     this.noDataFound = true;
  //     this.errorObj = otherErrorObjStatus;
  //   } else if (changes && changes.productionVolumeTrendDetails) {
  //     this.productionVolumeTrendDetails = changes.productionVolumeTrendDetails.currentValue;
  //     if (isUndefined(this.productionVolumeTrendDetails)) {
  //       this.noDataFound = true;
  //       this.errorObj = otherErrorObjStatus;
  //     } else if (isEmpty(this.productionVolumeTrendDetails)) {
  //       this.noDataFound = true;
  //       this.errorObj = noDataFoundErrorObjStatus;
  //     } else {
  //       this.noDataFound = false;
  //       this.setProductionVolTrend(this.productionVolumeTrendDetails);
  //     }
  //   }
  //   else {
  //     if (changes.missedOpportunityPerMonthDetails) {
  //       this.missedOpportunityPerMonthDetails = changes.missedOpportunityPerMonthDetails.currentValue;
  //       this.setProductionVolTrend(this.productionVolumeTrendDetails);
  //     } 
  //   }
  // }
}