import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Injector,
  Type,
  effect,
  inject,
  input,
  runInInjectionContext,
  signal,
} from '@angular/core';

import {
  NshButtonComponent,
  NshDialogActionsComponent,
  NshDialogConfig,
  NshDialogContentComponent,
  NshDialogRef,
  NshDialogService,
  NshDialogTitleComponent,
  NshToolbarComponent,
  NshToolbarEndDirective,
  NshToolbarStartDirective,
} from 'nsh-kit-ui';

interface DialogDemoCase {
  key: string;
  title: string;
  description: string;
  component: Type<any>;
  config?: NshDialogConfig;
  inputs?: Record<string, unknown>;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NshDialogTitleComponent,
    NshDialogContentComponent,
    NshDialogActionsComponent,
    NshButtonComponent,
  ],
  template: `
    <nsh-dialog-title>{{ title() }}</nsh-dialog-title>
    <nsh-dialog-content>
      <p>{{ body() }}</p>
    </nsh-dialog-content>
    <nsh-dialog-actions>
      <nsh-button variant="text" (click)="close()">Close</nsh-button>
    </nsh-dialog-actions>
  `,
  styles: `
    p {
      margin: 0;
    }
  `,
})
class DialogBasicContentComponent {
  private readonly dialogRef = inject(NshDialogRef);

  readonly title = input('Dialog title');
  readonly body = input('Dialog content');

  close(): void {
    this.dialogRef.close();
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NshDialogTitleComponent,
    NshDialogContentComponent,
    NshDialogActionsComponent,
    NshButtonComponent,
  ],
  template: `
    <nsh-dialog-title>Long content</nsh-dialog-title>
    <nsh-dialog-content>
      @for (paragraph of paragraphs(); track paragraph) {
        <p>{{ paragraph }}</p>
      }
    </nsh-dialog-content>
    <nsh-dialog-actions>
      <nsh-button variant="text" (click)="close()">Close</nsh-button>
    </nsh-dialog-actions>
  `,
  styles: `
    p {
      margin: 0;
    }
  `,
})
class DialogLongContentComponent {
  private readonly dialogRef = inject(NshDialogRef);

  readonly paragraphs = signal<ReadonlyArray<string>>([
    'This dialog demonstrates scrollable content using dialog tokens.',
    'Each paragraph is rendered with consistent spacing via dialog content tokens.',
    'Add enough text to ensure the content area becomes scrollable inside the dialog.',
    'Tokens control size, padding, and typography so the component stays theme-friendly.',
    'Keep reading to see the scroll behavior in action without hard-coded sizes.',
    'This is another line to push the content length over the scroll threshold.',
    'One more paragraph to make sure the scroll container is engaged.',
  ]);

  close(): void {
    this.dialogRef.close();
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NshDialogTitleComponent,
    NshDialogContentComponent,
    NshDialogActionsComponent,
    NshButtonComponent,
  ],
  template: `
    <nsh-dialog-title>Return a result</nsh-dialog-title>
    <nsh-dialog-content>
      <p>Choose OK or Cancel to send a result back to the page.</p>
    </nsh-dialog-content>
    <nsh-dialog-actions align="end">
      <nsh-button variant="text" (click)="cancel()">Cancel</nsh-button>
      <nsh-button variant="filled" (click)="confirm()">OK</nsh-button>
    </nsh-dialog-actions>
  `,
  styles: `
    p {
      margin: 0;
    }
  `,
})
class DialogResultContentComponent {
  private readonly dialogRef = inject(NshDialogRef);

  cancel(): void {
    this.dialogRef.close('cancel');
  }

  confirm(): void {
    this.dialogRef.close('ok');
  }
}

@Component({
  selector: 'app-dialog-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NshToolbarComponent,
    NshToolbarEndDirective,
    NshToolbarStartDirective,
    NshButtonComponent,
  ],
  template: `
    <div class="dialog-page">
      <h1 class="dialog-page__title">Dialog</h1>
      <p class="dialog-page__subtitle">Service-driven modal dialog examples.</p>

      @for (demo of demos(); track demo.key) {
        <section class="dialog-page__card">
          <div class="dialog-page__card-header">
            <h2 class="dialog-page__h2">{{ demo.title }}</h2>
            <p class="dialog-page__hint">{{ demo.description }}</p>
          </div>

          <nsh-button variant="outlined" (click)="openDemo(demo)">Open dialog</nsh-button>
        </section>
      }

      <section class="dialog-page__card">
        <div class="dialog-page__card-header">
          <h2 class="dialog-page__h2">Toolbar launcher</h2>
          <p class="dialog-page__hint">Icon button inside toolbar opens a dialog.</p>
        </div>

        <nsh-toolbar color="surface" variant="surface" density="compact">
          <span nshToolbarStart class="dialog-page__toolbar-title">Toolbar</span>
          <nsh-button
            nshToolbarEnd
            ariaLabel="Open dialog"
            variant="text"
            size="sm"
            leadingIcon="menu"
            (click)="openToolbarDialog()"
          ></nsh-button>
        </nsh-toolbar>
      </section>

      <section class="dialog-page__card">
        <div class="dialog-page__card-header">
          <h2 class="dialog-page__h2">Latest result</h2>
          <p class="dialog-page__hint">Result emitted from the dialog after close.</p>
        </div>
        <div class="dialog-page__result">{{ lastResult() }}</div>
      </section>
    </div>
  `,
  styles: [
    `
      :host {
        --nsh-dialog-demo-wide: calc(var(--nsh-space-xl) * 26);
      }

      .dialog-page {
        display: grid;
        gap: var(--nsh-space-lg);
      }

      .dialog-page__title {
        margin: 0;
      }

      .dialog-page__subtitle {
        margin: 0;
        color: var(--nsh-color-text-muted);
      }

      .dialog-page__card {
        display: grid;
        gap: var(--nsh-space-md);
        padding: var(--nsh-space-md);
        border: calc(var(--nsh-space-xs) / 2) solid var(--nsh-color-outline);
        border-radius: var(--nsh-radius-md);
        background: var(--nsh-color-surface-0);
      }

      .dialog-page__card-header {
        display: grid;
        gap: var(--nsh-space-xs);
      }

      .dialog-page__h2 {
        margin: 0;
        font-size: var(--nsh-font-size-lg);
        font-weight: var(--nsh-font-weight-medium);
      }

      .dialog-page__hint {
        margin: 0;
        color: var(--nsh-color-text-muted);
        font-size: var(--nsh-font-size-sm);
      }

      .dialog-page__toolbar-title {
        font-size: var(--nsh-font-size-sm);
      }

      .dialog-page__result {
        font-size: var(--nsh-font-size-md);
        color: var(--nsh-color-text);
      }
    `,
  ],
})
export class DialogPageComponent {
  private readonly dialog = inject(NshDialogService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  readonly lastResult = signal<string>('No result yet.');

  readonly demos = signal<ReadonlyArray<DialogDemoCase>>([
    {
      key: 'basic',
      title: 'Basic dialog',
      description: 'Title, content, and actions with default close behavior.',
      component: DialogBasicContentComponent,
      inputs: {
        title: 'Basic dialog',
        body: 'This dialog uses the default backdrop + escape close behavior.',
      },
    },
    {
      key: 'long',
      title: 'Long content (scroll)',
      description: 'Scrollable content area for longer copy.',
      component: DialogLongContentComponent,
      config: {
        maxWidth: 'var(--nsh-dialog-demo-wide)',
      },
    },
    {
      key: 'backdrop',
      title: 'Backdrop click disabled',
      description: 'Backdrop click does not close this dialog.',
      component: DialogBasicContentComponent,
      config: {
        closeOnBackdropClick: false,
      },
      inputs: {
        title: 'Backdrop stays',
        body: 'Clicking the backdrop will not close this dialog.',
      },
    },
    {
      key: 'escape',
      title: 'Escape disabled',
      description: 'Escape key does not close this dialog.',
      component: DialogBasicContentComponent,
      config: {
        closeOnEscape: false,
      },
      inputs: {
        title: 'Escape disabled',
        body: 'Pressing Escape will not close this dialog.',
      },
    },
    {
      key: 'result',
      title: 'Return a result',
      description: 'OK/Cancel returns a result to the page.',
      component: DialogResultContentComponent,
    },
  ]);

  openDemo(demo: DialogDemoCase): void {
    const ref = this.dialog.open(demo.component, demo.config, demo.inputs);

    if (demo.key !== 'result') {
      return;
    }

    let effectRef: { destroy: () => void } | null = null;
    effectRef = runInInjectionContext(this.injector, () =>
      effect(
        () => {
          const result = ref.afterClosed();
          if (result === null) {
            return;
          }

          this.lastResult.set(`Dialog result: ${result}`);
          effectRef?.destroy();
        },
        { allowSignalWrites: true },
      ),
    );

    this.destroyRef.onDestroy(() => effectRef?.destroy());
  }

  openToolbarDialog(): void {
    this.dialog.open(DialogBasicContentComponent, undefined, {
      title: 'From toolbar',
      body: 'Opened from a toolbar icon button.',
    });
  }
}
