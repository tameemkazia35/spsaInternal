import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeWizardComponent } from './home-wizard.component';

describe('HomeWizardComponent', () => {
  let component: HomeWizardComponent;
  let fixture: ComponentFixture<HomeWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeWizardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
