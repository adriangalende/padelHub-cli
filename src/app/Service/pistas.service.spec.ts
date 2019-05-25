import { TestBed } from '@angular/core/testing';

import { PistasService } from './pistas.service';

describe('PistasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PistasService = TestBed.get(PistasService);
    expect(service).toBeTruthy();
  });
});
