import { TestBed } from '@angular/core/testing';

import { ExecRoleService } from './exec-role.service';

describe('ExecRoleService', () => {
  let service: ExecRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExecRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
