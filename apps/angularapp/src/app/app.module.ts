import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ApmBase, apm } from '@elastic/apm-rum';
import { MonitoringModule } from '@sample/util';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { AppComponent } from './app.component';
import { from } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
export const initializeApp = () => {
  return () => {
    // initialize APM with correct configuration
    const traceId = `e2e-run-${Date.now()}`;
    localStorage.setItem('traceId', traceId);
    apm.init({
      // Active flag of monior service controls activation of elastic APM agent
      active: true,
      // Set custom APM Server URL (default: http://localhost:8200)
      serverUrl: 'http://localhost:8200',
      // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
      serviceName: 'Sample Service',
      // Set service version (required for sourcemap feature)
      serviceVersion: '0.0.1-placeholder',
      // Set name of page load transaction (empty per default) - used to distinguish captured performance metrics
      pageLoadTransactionName: 'transaction-placeholder',
      pageLoadTraceId: traceId
    });
  };
};
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    HttpClientModule,
    MonitoringModule.forRoot(),
    LoggerModule.forRoot({
      serverLoggingUrl: 'http://localhost:3000',
      serverLogLevel: NgxLoggerLevel.OFF,
      level: NgxLoggerLevel.DEBUG,
      disableConsoleLogging: false
    }),
    AppRoutingModule
  ],
  providers: [    
    { provide: ApmBase, useValue: apm },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ApmBase],
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule {}
