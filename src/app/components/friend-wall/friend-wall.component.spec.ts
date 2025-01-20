import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendWallComponent } from './friend-wall.component';

describe('FriendWallComponent', () => {
  let component: FriendWallComponent;
  let fixture: ComponentFixture<FriendWallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FriendWallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendWallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
