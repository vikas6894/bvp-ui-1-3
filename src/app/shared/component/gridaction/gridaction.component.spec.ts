import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridactionComponent } from './gridaction.component';

describe('GridactionComponent', () => {
  let component: GridactionComponent;
  let fixture: ComponentFixture<GridactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
