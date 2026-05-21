import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { ConfirmDialog } from '@shared/components/ui/confirm-dialog/confirm-dialog';
import { DialogService } from './dialog.service';
import { Component } from '@angular/core';
import type { IDialogComponent } from '@shared/components/ui/dialog/interfaces/dialog-component.interface';
import { DialogRef } from '@shared/components/ui/dialog/models/dialog-ref.model';

@Component({
  template: '',
})
class TestDialogComponent implements IDialogComponent<undefined, boolean> {
  setDialogRef(_ref: DialogRef<undefined, boolean>): void {}
}

describe('DialogService', () => {
  let service: DialogService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'next', component: TestDialogComponent }])],
    });
    service = TestBed.inject(DialogService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open confirm dialog through openConfirm', () => {
    const openSpy = vi.spyOn(service, 'open').mockReturnValue({} as any);

    service.openConfirm({ message: 'Confirmar prueba' });

    expect(openSpy).toHaveBeenCalledWith(ConfirmDialog, { message: 'Confirmar prueba' }, {
      title: 'Confirmación',
    });
  });

  it('should close open dialogs on navigation start', async () => {
    const ref = service.open(TestDialogComponent, undefined, { title: 'Prueba' });
    const onCloseSpy = vi.fn();
    ref.onClose$.subscribe(onCloseSpy);

    await router.navigateByUrl('/next');

    expect(onCloseSpy).toHaveBeenCalledOnce();
    expect(service.dialogs()).toHaveLength(0);
  });
});
