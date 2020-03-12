import { async, TestBed } from '@angular/core/testing';
import { UtilModule } from './util.module';

describe('UtilModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UtilModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(UtilModule).toBeDefined();
  });
});
