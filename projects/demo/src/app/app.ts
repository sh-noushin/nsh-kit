import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NshThemeDirective, type NshThemeConfig } from 'nsh-kit-ui';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NshThemeDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('demo');

  readonly demoTheme: NshThemeConfig = {
    mode: 'light',
    density: 'comfortable',
    tokens: {
      colors: {
        primary: '#1a73e8',
        secondary: '#0f60c6',
        tertiary: '#5f6d86',
        success: '#2e7d32',
        warn: '#f9a825',
        danger: '#c62828',
        surface: '#f3f5fa',
        surface1: '#ffffff',
        surface2: '#e8edf7',
        text: '#1f2533',
        textMuted: '#556176',
        textDisabled: '#9aa6b8',
        border: '#d9deea',
        outline: '#c9d1e0',
      },
      typography: {
        fontFamily: "'Roboto', 'Helvetica Neue', sans-serif",
      },
    },
  };
}
