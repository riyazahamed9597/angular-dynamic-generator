import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTableGenerateComponent } from './dynamic-table-generate.component';

describe('DynamicTableGenerateComponent', () => {
  let component: DynamicTableGenerateComponent;
  let fixture: ComponentFixture<DynamicTableGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicTableGenerateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicTableGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
