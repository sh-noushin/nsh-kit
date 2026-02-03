import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { NshThemeDirective } from 'nsh-kit-ui';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NshThemeDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('p');
}
