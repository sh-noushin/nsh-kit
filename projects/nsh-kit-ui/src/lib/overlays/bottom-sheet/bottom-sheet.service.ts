import { Injectable, TemplateRef, Type, inject } from '@angular/core';

import { NshOverlayService } from '../overlay-core/overlay.service';

import { NshBottomSheetContainerComponent } from './bottom-sheet-container.component';
import { NshBottomSheetRef } from './bottom-sheet-ref';
import { NSH_BOTTOM_SHEET_DEFAULT_OPTIONS } from './bottom-sheet.tokens';
import type { NshBottomSheetConfig } from './bottom-sheet.types';

interface NshResolvedBottomSheetConfig {
  ariaLabel: string | null;
  closeOnBackdropClick: boolean;
  closeOnEscape: boolean;
  disableScroll: boolean;
  width: string | null;
  maxWidth: string | null;
  maxHeight: string | null;
  autoFocus: NshBottomSheetConfig['autoFocus'];
  data: unknown;
}

function resolveConfig(
  config?: NshBottomSheetConfig,
  defaults?: NshBottomSheetConfig | null,
): NshResolvedBottomSheetConfig {
  const merged = { ...(defaults ?? {}), ...(config ?? {}) };

  return {
    ariaLabel: merged.ariaLabel ?? null,
    closeOnBackdropClick: merged.closeOnBackdropClick ?? true,
    closeOnEscape: merged.closeOnEscape ?? true,
    disableScroll: merged.disableScroll ?? true,
    width: merged.width ?? null,
    maxWidth: merged.maxWidth ?? null,
    maxHeight: merged.maxHeight ?? null,
    autoFocus: merged.autoFocus ?? 'first-tabbable',
    data: merged.data ?? null,
  };
}

@Injectable({ providedIn: 'root' })
export class NshBottomSheetService {
  private readonly overlay = inject(NshOverlayService);
  private readonly defaultConfig = inject(NSH_BOTTOM_SHEET_DEFAULT_OPTIONS, {
    optional: true,
  });

  private scrollLockCount = 0;
  private previousBodyOverflow: string | null = null;

  open(
    component: Type<any>,
    config?: NshBottomSheetConfig,
    componentInputs?: Record<string, any>,
  ): NshBottomSheetRef<any> {
    return this.openInternal({
      component,
      template: null,
      config,
      componentInputs: componentInputs ?? null,
    });
  }

  openTemplate(template: TemplateRef<any>, config?: NshBottomSheetConfig): NshBottomSheetRef<any> {
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
    config?: NshBottomSheetConfig;
    componentInputs: Record<string, any> | null;
  }): NshBottomSheetRef<any> {
    const resolved = resolveConfig(opts.config, this.defaultConfig);
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    let dismissed = false;
    let overlayRef: { close: () => void; componentRef: any } | null = null;

    const finalizeDismiss = (result?: any) => {
      if (dismissed) {
        return;
      }

      dismissed = true;
      overlayRef?.close();

      if (resolved.disableScroll) {
        this.unlockScroll();
      }

      bottomSheetRef._notifyDismissed(result ?? null);
      this.restoreFocus(opener);
    };

    const bottomSheetRef = new NshBottomSheetRef<any>(finalizeDismiss);

    overlayRef = this.overlay.attachComponentToBody(NshBottomSheetContainerComponent, {
      panelClass: 'nsh-bottom-sheet-overlay',
      zIndex: 'var(--nsh-z-overlay, 1300)',
    });

    overlayRef.componentRef.setInput('bottomSheetRef', bottomSheetRef);
    overlayRef.componentRef.setInput('config', resolved);
    overlayRef.componentRef.setInput('contentComponent', opts.component);
    overlayRef.componentRef.setInput('contentTemplate', opts.template);
    overlayRef.componentRef.setInput('componentInputs', opts.componentInputs);
    overlayRef.componentRef.changeDetectorRef.detectChanges();

    if (resolved.disableScroll) {
      this.lockScroll();
    }

    return bottomSheetRef;
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
