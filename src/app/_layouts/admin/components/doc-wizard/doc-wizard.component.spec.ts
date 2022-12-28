import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocWizardComponent } from './doc-wizard.component';

describe('DocWizardComponent', () => {
  let component: DocWizardComponent;
  let fixture: ComponentFixture<DocWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocWizardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
