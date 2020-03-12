import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitoringService } from './monitoring.service';

@NgModule({
  declarations: [],
  imports: [CommonModule]
})
export class MonitoringModule {
  public static forRoot(): ModuleWithProviders<MonitoringModule> {
    return {
      ngModule: MonitoringModule,
      providers: [MonitoringService]
    };
  }
}
