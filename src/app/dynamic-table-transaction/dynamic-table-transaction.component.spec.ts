import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTableTransactionComponent } from './dynamic-table-transaction.component';

describe('DynamicTableTransactionComponent', () => {
  let component: DynamicTableTransactionComponent;
  let fixture: ComponentFixture<DynamicTableTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicTableTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicTableTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
