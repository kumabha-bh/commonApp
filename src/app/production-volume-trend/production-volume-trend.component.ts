import { Component, OnInit, Input, ViewContainerRef, ViewChild} from '@angular/core';
import { PlotlyWrapperComponent } from './plotly-wrapper/plotly-wrapper.component';
import { ComponentLibraryModule } from '@bh-digitalsolutions/ui-toolkit-angular/dist';
import { CommonModule } from '@angular/common';
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-basic-dist-min';

PlotlyModule.plotlyjs = PlotlyJS;

@Component({
  selector: 'app-production-volume-trend',
  templateUrl: './production-volume-trend.component.html',
  styleUrls: ['./production-volume-trend.component.scss'],
  standalone: true,
  imports:[PlotlyWrapperComponent, PlotlyModule,ComponentLibraryModule, CommonModule]

})
export class ProductionVolumeTrendComponent implements OnInit {
  @Input() productionVolumeTrendIsLoading: boolean;
  @Input() productionVolTrend: any; 
  @Input() noDataFound: boolean;
  @Input() productionVolumeTrendTitles;
  @Input() circleSvgPath;
  @ViewChild('errorContent', { read: ViewContainerRef })
  errorContent!: ViewContainerRef;

  constructor() {
  }

  ngOnInit(): void {
  }

}