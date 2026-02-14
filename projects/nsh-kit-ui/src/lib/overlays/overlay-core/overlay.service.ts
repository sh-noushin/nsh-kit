import {
  ApplicationRef,
  EnvironmentInjector,
  Injectable,
  createComponent,
  inject,
  type ComponentRef,
  type Type,
} from '@angular/core';

import type { NshBodyOverlayConfig, NshOverlayConfig } from './overlay.types';
import { NshOverlayRef } from './overlay-ref';

function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

function classListToString(panelClass: NshOverlayConfig['panelClass']): string {
  if (!panelClass) {
    return '';
  }
  return typeof panelClass === 'string' ? panelClass : panelClass.join(' ');
}

@Injectable({ providedIn: 'root' })
export class NshOverlayService {
  private readonly appRef = inject(ApplicationRef);
  private readonly envInjector = inject(EnvironmentInjector);

  attachComponent<TComponent>(
    component: Type<TComponent>,
    config: NshOverlayConfig,
  ): NshOverlayRef<TComponent> {
    const container = document.createElement('div');
    const extraClass = classListToString(config.panelClass);
    container.className = ['nsh-overlay', extraClass].filter(Boolean).join(' ');

    container.style.position = 'fixed';
    container.style.left = '0px';
    container.style.top = '0px';
    container.style.zIndex =
      config.zIndex ?? 'var(--nsh-z-dropdown, var(--nsh-z-index-dropdown, 1200))';

    container.dataset['placement'] = config.placement ?? 'bottom-start';

    document.body.appendChild(container);

    const componentRef = this.createAndAttachComponent(component, container);

    let destroyed = false;

    let rafPending = false;
    const schedulePositionUpdate = () => {
      if (destroyed || rafPending) {
        return;
      }
      rafPending = true;
      requestAnimationFrame(() => {
        rafPending = false;
        if (destroyed) {
          return;
        }
        this.updatePosition(container, config.anchor, config);
      });
    };

    // Initial placement.
    schedulePositionUpdate();

    const onWindowResize = () => schedulePositionUpdate();
    const onWindowScroll = () => schedulePositionUpdate();

    window.addEventListener('resize', onWindowResize, { passive: true });
    window.addEventListener('scroll', onWindowScroll, { passive: true, capture: true });

    const onDocPointerDown = (ev: Event) => {
      if (destroyed || config.closeOnOutsidePointerDown === false) {
        return;
      }

      const target = (ev as MouseEvent).target as Node | null;
      if (!target) {
        return;
      }

      if (container.contains(target)) {
        return;
      }

      if (config.anchor.contains(target)) {
        return;
      }

      overlayRef.close();
    };

    document.addEventListener('pointerdown', onDocPointerDown, { capture: true });

    const onDocKeyDown = (ev: KeyboardEvent) => {
      if (destroyed || config.closeOnEscape === false) {
        return;
      }

      if (ev.key !== 'Escape') {
        return;
      }

      overlayRef.close();
    };

    document.addEventListener('keydown', onDocKeyDown, { capture: true });

    const dispose = () => {
      if (destroyed) {
        return;
      }
      destroyed = true;

      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('scroll', onWindowScroll, { capture: true } as AddEventListenerOptions);

      document.removeEventListener('pointerdown', onDocPointerDown, { capture: true } as AddEventListenerOptions);
      document.removeEventListener('keydown', onDocKeyDown, { capture: true } as AddEventListenerOptions);

      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();

      container.remove();
    };

    const overlayRef = new NshOverlayRef<TComponent>(container, componentRef, dispose);

    // If the anchor disappears from the DOM, close.
    schedulePositionUpdate();

    return overlayRef;
  }

  attachComponentToBody<TComponent>(
    component: Type<TComponent>,
    config: NshBodyOverlayConfig = {},
  ): NshOverlayRef<TComponent> {
    const container = document.createElement('div');
    const extraClass = classListToString(config.panelClass);
    container.className = ['nsh-overlay', extraClass].filter(Boolean).join(' ');

    container.style.position = 'fixed';
    container.style.inset = '0px';
    container.style.zIndex = config.zIndex ?? 'var(--nsh-z-overlay, 1300)';

    document.body.appendChild(container);

    const componentRef = this.createAndAttachComponent(component, container);

    let destroyed = false;
    const dispose = () => {
      if (destroyed) {
        return;
      }
      destroyed = true;

      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();

      container.remove();
    };

    return new NshOverlayRef<TComponent>(container, componentRef, dispose);
  }

  private createAndAttachComponent<TComponent>(
    component: Type<TComponent>,
    container: HTMLElement,
  ): ComponentRef<TComponent> {
    const componentRef = createComponent(component, { environmentInjector: this.envInjector });
    this.appRef.attachView(componentRef.hostView);
    container.appendChild(componentRef.location.nativeElement);
    componentRef.changeDetectorRef.detectChanges();
    return componentRef;
  }

  private updatePosition(container: HTMLElement, anchor: HTMLElement, config: NshOverlayConfig): void {
    if (!anchor.isConnected) {
      // If the anchor is gone, hide the overlay container.
      container.style.display = 'none';
      return;
    }

    container.style.display = '';

    const rect = anchor.getBoundingClientRect();

    const matchWidth = config.matchWidth !== false;
    if (matchWidth) {
      container.style.width = `${rect.width}px`;
    } else {
      container.style.width = '';
    }

    const placement = config.placement ?? 'bottom-start';
    container.dataset['placement'] = placement;
    const offsetPx = Math.max(0, config.offsetPx ?? 0);

    const containerRect = container.getBoundingClientRect();
    const panelWidth = containerRect.width;
    const panelHeight = containerRect.height;

    let left = rect.left;
    let top = rect.bottom;

    switch (placement) {
      case 'bottom-start': {
        left = rect.left;
        top = rect.bottom + offsetPx;
        break;
      }
      case 'bottom': {
        left = rect.left + rect.width / 2 - panelWidth / 2;
        top = rect.bottom + offsetPx;
        break;
      }
      case 'bottom-end': {
        left = rect.right - panelWidth;
        top = rect.bottom + offsetPx;
        break;
      }
      case 'top-start': {
        left = rect.left;
        top = rect.top - panelHeight - offsetPx;
        break;
      }
      case 'top': {
        left = rect.left + rect.width / 2 - panelWidth / 2;
        top = rect.top - panelHeight - offsetPx;
        break;
      }
      case 'top-end': {
        left = rect.right - panelWidth;
        top = rect.top - panelHeight - offsetPx;
        break;
      }
      case 'left': {
        left = rect.left - panelWidth - offsetPx;
        top = rect.top + rect.height / 2 - panelHeight / 2;
        break;
      }
      case 'right': {
        left = rect.right + offsetPx;
        top = rect.top + rect.height / 2 - panelHeight / 2;
        break;
      }
    }

    if (config.clampToViewport) {
      const margin = Math.max(0, config.viewportMarginPx ?? 8);
      const maxLeft = Math.max(margin, window.innerWidth - panelWidth - margin);
      const maxTop = Math.max(margin, window.innerHeight - panelHeight - margin);
      left = clamp(left, margin, maxLeft);
      top = clamp(top, margin, maxTop);
    }

    container.style.left = `${left}px`;
    container.style.top = `${top}px`;
  }
}
