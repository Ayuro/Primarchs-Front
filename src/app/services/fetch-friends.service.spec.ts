import { TestBed } from '@angular/core/testing';

import { FetchFriendsService } from './fetch-friends.service';

describe('FetchFriendsService', () => {
  let service: FetchFriendsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchFriendsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
