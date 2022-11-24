import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactWizardComponent } from './contact-wizard.component';

describe('ContactWizardComponent', () => {
  let component: ContactWizardComponent;
  let fixture: ComponentFixture<ContactWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactWizardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
