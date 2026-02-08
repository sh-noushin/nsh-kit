import { Injectable, inject, signal } from '@angular/core';

import type { NshOverlayRef } from '../overlay-core/overlay-ref';
import { NshOverlayService } from '../overlay-core/overlay.service';

import { NshSnackbarContainerComponent } from './snackbar-container.component';
import { NshSnackbarRef } from './snackbar-ref';
import type {
  NshSnackbarCloseReason,
  NshSnackbarConfig,
  NshSnackbarPosition,
  NshSnackbarVariant,
} from './snackbar.types';

const DEFAULT_DURATION_MS = 5000;
const DEFAULT_MAX_STACK = 3;

interface NshResolvedSnackbarConfig {
  durationMs: number | null;
  variant: NshSnackbarVariant;
  actionText: string | null;
  ariaLive: 'polite' | 'assertive';
  position: NshSnackbarPosition;
  maxStack: number;
}

interface NshSnackbarItem {
  id: number;
  message: string;
  config: NshResolvedSnackbarConfig;
  ref: NshSnackbarRef;
  timeoutId: number | null;
}

function normalizeActionText(value: string | null | undefined): string | null {
  const trimmed = (value ?? '').trim();
  return trimmed.length > 0 ? trimmed : null;
}

function resolveConfig(config?: NshSnackbarConfig): NshResolvedSnackbarConfig {
  const durationMs = config?.durationMs;

  return {
    durationMs: durationMs === null ? null : Math.max(0, durationMs ?? DEFAULT_DURATION_MS),
    variant: config?.variant ?? 'neutral',
    actionText: normalizeActionText(config?.actionText),
    ariaLive: config?.ariaLive ?? 'polite',
    position: config?.position ?? 'bottom-center',
    maxStack: Math.max(1, Math.floor(config?.maxStack ?? DEFAULT_MAX_STACK)),
  };
}

@Injectable({ providedIn: 'root' })
export class NshSnackbarService {
  private readonly overlay = inject(NshOverlayService);

  private readonly items = signal<ReadonlyArray<NshSnackbarItem>>([]);

  private overlayRef: NshOverlayRef<NshSnackbarContainerComponent> | null = null;
  private nextId = 0;

  readonly snackbars = this.items.asReadonly();

  open(message: string, config?: NshSnackbarConfig): NshSnackbarRef {
    const resolved = resolveConfig(config);
    const id = this.nextId++;
    const ref = new NshSnackbarRef((reason) => this.closeById(id, reason));

    const nextItem: NshSnackbarItem = {
      id,
      message,
      config: resolved,
      ref,
      timeoutId: null,
    };

    const current = this.items();
    const keepCount = Math.max(0, resolved.maxStack - 1);
    const kept = current.slice(Math.max(0, current.length - keepCount));
    const dropped = current.slice(0, current.length - kept.length);

    // Drop oldest snackbars to respect maxStack.
    for (const item of dropped) {
      this.finalizeClose(item, 'dismiss');
    }

    const next = [...kept, nextItem];
    this.items.set(next);
    this.detectChanges();

    this.ensureOverlay();
    this.scheduleTimeout(nextItem);

    return ref;
  }

  closeById(id: number, reason: NshSnackbarCloseReason): void {
    const current = this.items();
    const idx = current.findIndex((item) => item.id === id);
    if (idx < 0) {
      return;
    }

    const item = current[idx];
    const next = current.slice(0, idx).concat(current.slice(idx + 1));

    this.items.set(next);
    this.detectChanges();
    this.finalizeClose(item, reason);
    this.cleanupOverlayIfEmpty();
  }

  closeLatest(reason: NshSnackbarCloseReason = 'dismiss'): void {
    const current = this.items();
    if (current.length === 0) {
      return;
    }

    this.closeById(current[current.length - 1].id, reason);
  }

  private scheduleTimeout(item: NshSnackbarItem): void {
    if (item.config.durationMs === null) {
      return;
    }

    item.timeoutId = window.setTimeout(() => {
      item.timeoutId = null;
      this.closeById(item.id, 'timeout');
    }, item.config.durationMs);
  }

  private finalizeClose(item: NshSnackbarItem, reason: NshSnackbarCloseReason): void {
    if (item.timeoutId !== null) {
      window.clearTimeout(item.timeoutId);
      item.timeoutId = null;
    }

    item.ref._notifyClosed(reason);
  }

  private ensureOverlay(): void {
    if (this.overlayRef) {
      return;
    }

    const anchor = document.body;
    if (!anchor) {
      return;
    }

    const ref = this.overlay.attachComponent(NshSnackbarContainerComponent, {
      anchor,
      matchWidth: false,
      closeOnOutsidePointerDown: false,
      closeOnEscape: false,
      panelClass: 'nsh-snackbar-overlay',
      placement: 'bottom',
      clampToViewport: false,
      zIndex: 'var(--nsh-z-overlay)',
    });

    this.overlayRef = ref;
  }

  private cleanupOverlayIfEmpty(): void {
    if (this.items().length > 0) {
      return;
    }

    this.overlayRef?.close();
    this.overlayRef = null;
  }

  private detectChanges(): void {
    this.overlayRef?.componentRef.changeDetectorRef.detectChanges();
  }
}
