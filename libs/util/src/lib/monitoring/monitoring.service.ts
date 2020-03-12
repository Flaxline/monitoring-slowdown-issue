import { Injectable } from '@angular/core';
import { ApmBase } from '@elastic/apm-rum';
import {
  Event,
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { NGXLogger } from 'ngx-logger';

/**
 * @export
 */
@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  private readonly active: boolean = true;
  private navigationChangeSpan: any;
  constructor(
    private readonly router: Router,
    private readonly logger: NGXLogger,
    private readonly apmMonitoring: ApmBase
  ) {
    this.monitorRouterEvents();
  }

  public isActive(): boolean {
    return this.active;
  }

  public getMonitoring(): ApmBase {
    return this.apmMonitoring;
  }

  private monitorRouterEvents() {
    this.router.events.subscribe((event: Event) => {
      if (!this.isActive()) return;
      if (event instanceof NavigationStart) {
        this.handleNavigationStart(event);
      } else if (event instanceof NavigationEnd) {
        this.handleNavigationEnd(event);
      } else if (event instanceof NavigationCancel) {
        this.handleNavigationCancel(event);
      } else if (event instanceof NavigationError) {
        this.handleNavigationError(event);
      }
    });
  }

  private handleNavigationStart(event: NavigationStart) {
    this.apmMonitoring.startTransaction('routing', 'view-change');
    this.navigationChangeSpan = this.apmMonitoring.startSpan(
      this.getSpanName(event),
      'Navigation Timing'
    );
    this.logger.debug(`Navigation Start: ${event.url}`);
  }

  private getSpanName(event: NavigationStart) {
    return `Route to'${
      event.url.substring(1) === '' ? '<home>' : event.url.substring(1)
    }'`;
  }

  private handleNavigationError(event: NavigationError) {
    this.endMonitoring();
    this.logger.warn(`Navigation Error: ${event.error}`);
  }

  private handleNavigationCancel(event: NavigationCancel) {
    this.endMonitoring();
    this.logger.trace(`Navigation Canceled: ${event.url}`);
  }

  private handleNavigationEnd(event: NavigationEnd) {
    this.endMonitoring();
    this.logger.debug(`Navigation End: ${event.url}`);
  }

  private endMonitoring() {
    this.navigationChangeSpan.end();
    const currentTransaction = this.apmMonitoring.getCurrentTransaction();
    if (currentTransaction) {
      currentTransaction.end();
    }
  }
}
