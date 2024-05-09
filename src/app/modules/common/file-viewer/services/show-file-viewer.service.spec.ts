import { TestBed } from '@angular/core/testing';

import { ShowFileViewerService } from './show-file-viewer.service';

describe('ShowFileViewerService', () => {
  let service: ShowFileViewerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowFileViewerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
