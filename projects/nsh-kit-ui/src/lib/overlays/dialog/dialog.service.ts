import { Injectable, TemplateRef, Type, inject } from '@angular/core';

import { NshOverlayService } from '../overlay-core/overlay.service';

import { NshDialogContainerComponent } from './dialog-container.component';
import { NshDialogRef } from './dialog-ref';
import type { NshDialogConfig } from './dialog.types';

interface NshResolvedDialogConfig {
  ariaLabel: string | null;
  closeOnBackdropClick: boolean;
  closeOnEscape: boolean;
  width: string | null;
  maxWidth: string | null;
  disableScroll: boolean;
}

function resolveConfig(config?: NshDialogConfig): NshResolvedDialogConfig {
  return {
    ariaLabel: config?.ariaLabel ?? null,
    closeOnBackdropClick: config?.closeOnBackdropClick ?? true,
    closeOnEscape: config?.closeOnEscape ?? true,
    width: config?.width ?? null,
    maxWidth: config?.maxWidth ?? null,
    disableScroll: config?.disableScroll ?? true,
  };
}

@Injectable({ providedIn: 'root' })
export class NshDialogService {
  private readonly overlay = inject(NshOverlayService);

  private scrollLockCount = 0;
  private previousBodyOverflow: string | null = null;

  open(
    component: Type<any>,
    config?: NshDialogConfig,
    componentInputs?: Record<string, any>,
  ): NshDialogRef<any> {
    return this.openInternal({
      component,
      template: null,
      config,
      componentInputs: componentInputs ?? null,
    });
  }

  openTemplate(template: TemplateRef<any>, config?: NshDialogConfig): NshDialogRef<any> {
    return this.openInternal({
      component: null,
      template,
      config,
      componentInputs: null,
    });
  }

  private openInternal(opts: {
    component: Type<any> | null;
    template: TemplateRef<any> | null;
    config?: NshDialogConfig;
    componentInputs: Record<string, any> | null;
  }): NshDialogRef<any> {
    const resolved = resolveConfig(opts.config);
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    let closed = false;
    let overlayRef: { close: () => void; componentRef: any } | null = null;

    const finalizeClose = (result?: any) => {
      if (closed) {
        return;
      }

      closed = true;
      overlayRef?.close();

      if (resolved.disableScroll) {
        this.unlockScroll();
      }

      dialogRef._notifyClosed(result ?? null);
      this.restoreFocus(opener);
    };

    const dialogRef = new NshDialogRef<any>(finalizeClose);

    overlayRef = this.overlay.attachComponentToBody(NshDialogContainerComponent, {
      panelClass: 'nsh-dialog-overlay',
      zIndex: 'var(--nsh-z-overlay)',
    });

    overlayRef.componentRef.setInput('dialogRef', dialogRef);
    overlayRef.componentRef.setInput('config', resolved);
    overlayRef.componentRef.setInput('contentComponent', opts.component);
    overlayRef.componentRef.setInput('contentTemplate', opts.template);
    overlayRef.componentRef.setInput('componentInputs', opts.componentInputs);
    overlayRef.componentRef.changeDetectorRef.detectChanges();

    if (resolved.disableScroll) {
      this.lockScroll();
    }

    return dialogRef;
  }

  private lockScroll(): void {
    if (this.scrollLockCount === 0) {
      this.previousBodyOverflow = document.body.style.overflow || null;
      document.body.style.overflow = 'hidden';
    }

    this.scrollLockCount += 1;
  }

  private unlockScroll(): void {
    this.scrollLockCount = Math.max(0, this.scrollLockCount - 1);

    if (this.scrollLockCount > 0) {
      return;
    }

    document.body.style.overflow = this.previousBodyOverflow ?? '';
    this.previousBodyOverflow = null;
  }

  private restoreFocus(opener: HTMLElement | null): void {
    if (!opener || !opener.isConnected) {
      return;
    }

    opener.focus({ preventScroll: true });
  }
}
