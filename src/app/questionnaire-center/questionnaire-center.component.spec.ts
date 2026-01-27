import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireCenterComponent } from './questionnaire-center.component';

describe('QuestionnaireCenterComponent', () => {
  let component: QuestionnaireCenterComponent;
  let fixture: ComponentFixture<QuestionnaireCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionnaireCenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnaireCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
