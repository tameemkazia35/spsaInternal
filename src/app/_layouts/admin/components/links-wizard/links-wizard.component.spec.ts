import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinksWizardComponent } from './links-wizard.component';

describe('LinksWizardComponent', () => {
  let component: LinksWizardComponent;
  let fixture: ComponentFixture<LinksWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinksWizardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinksWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
