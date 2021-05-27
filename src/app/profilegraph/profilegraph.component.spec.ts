import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilegraphComponent } from './profilegraph.component';

describe('ProfilegraphComponent', () => {
  let component: ProfilegraphComponent;
  let fixture: ComponentFixture<ProfilegraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilegraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilegraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
