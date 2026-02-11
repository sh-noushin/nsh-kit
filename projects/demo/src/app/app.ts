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
        secondary: '#0b5cad',
        tertiary: '#6b7a90',
        success: '#2e7d32',
        warn: '#f9a825',
        danger: '#d32f2f',
        surface: '#f5f7fb',
        surface1: '#ffffff',
        surface2: '#eef2f8',
        text: '#1d2433',
        textMuted: '#5f6b7a',
        textDisabled: '#9aa3b2',
        border: '#e1e6ef',
        outline: '#d6dde8',
      },
      typography: {
        fontFamily: "'Sora', 'Segoe UI', sans-serif",
      },
    },
  };
}
