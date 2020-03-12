import { Component } from '@angular/core';
import { MonitoringService } from '@sample/util';
import { NGXLogger, NgxLoggerLevel } from 'ngx-logger';

@Component({
  selector: 'sample-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angularapp';

  constructor(
    private readonly logger: NGXLogger,
    private readonly monitoringService: MonitoringService
  ) {
    this.logger.info(`Monitoring: ${this.monitoringService.isActive()}`);
  }
}
