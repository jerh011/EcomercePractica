import {
  ApplicationRef,
  createComponent,
  Injectable,
  Injector,
  signal,
  Type,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ConfirmDialog } from '@shared/component/ui/confirm-dialog/confirm-dialog';
import { ConfirmDialogData } from '@shared/component/ui/confirm-dialog/confirm-dialog.types';
import { Dialog } from '@shared/component/ui/dialog/dialog';
import { IDialogComponent } from '@shared/component/ui/dialog/interfaces/dialog-component.interface';
import { DialogConfig } from '@shared/component/ui/dialog/models/dialog-config.model';
import { DialogRef } from '@shared/component/ui/dialog/models/dialog-ref.model';
import { Z_INDEX } from '@shared/constants/z-index.const';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  dialogs = signal<DialogRef<any, any>[]>([]);

  constructor(
    private readonly appRef: ApplicationRef,
    private readonly injector: Injector,
    private readonly router: Router,
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => this.closeAllImmediately());
  }

  open<T, R>(
    component: Type<IDialogComponent<T, R>>,
    data: T,
    config?: Partial<DialogConfig>,
  ): DialogRef<T, R> {
    const ref = createComponent(Dialog<T, R>, {
      environmentInjector: this.appRef.injector,
      elementInjector: this.injector,
    });
    ref.instance.child.set(component);
    let zIndex = config?.zIndex || Z_INDEX.MODAL + this.dialogs().length;
    const dialogConfig: DialogConfig = new DialogConfig({ ...config, zIndex });
    ref.instance.dialogConfig.set(dialogConfig);
    const dialogRef = new DialogRef<T, R>(data);
    ref.instance.dialogRef.set(dialogRef);
    this.appRef.attachView(ref.hostView);
    document.body.insertBefore(
      ref.location.nativeElement,
      document.body.firstChild,
    );
    ref.instance.closed$.subscribe(() => {
      this.appRef.detachView(ref.hostView);
      ref.destroy();
      this.dialogs.update((dialogs) => dialogs.filter((item) => item !== dialogRef));
    });
    this.dialogs.update((dialogs) => [...dialogs, dialogRef]);
    return dialogRef;
  }

  openConfirm(
    data?: ConfirmDialogData,
    config?: Partial<DialogConfig>,
  ): DialogRef<ConfirmDialogData | undefined, boolean> {
    return this.open(ConfirmDialog, data, {
      title: 'Confirmación',
      ...config,
    });
  }

  private closeAllImmediately(): void {
    const dialogs = [...this.dialogs()];
    this.dialogs.set([]);
    for (const dialogRef of dialogs) {
      dialogRef.finalizeClose();
    }
  }
}
