import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareouselComponent } from './careousel.component';

describe('CareouselComponent', () => {
  let component: CareouselComponent;
  let fixture: ComponentFixture<CareouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareouselComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
