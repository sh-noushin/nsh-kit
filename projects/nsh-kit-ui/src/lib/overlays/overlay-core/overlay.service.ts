import {
  ApplicationRef,
  EnvironmentInjector,
  Injectable,
  createComponent,
  inject,
  type ComponentRef,
  type Type,
} from '@angular/core';

import type { NshOverlayConfig } from './overlay.types';
import { NshOverlayRef } from './overlay-ref';

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
    container.style.zIndex = 'var(--nsh-z-index-dropdown)';

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

    container.style.left = `${rect.left}px`;
    container.style.top = `${rect.bottom}px`;

    const matchWidth = config.matchWidth !== false;
    if (matchWidth) {
      container.style.width = `${rect.width}px`;
    } else {
      container.style.width = '';
    }
  }
}
