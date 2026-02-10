$ErrorActionPreference = 'Stop'

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$distPath = Join-Path $repoRoot 'dist\nsh-kit-ui'
$tmpRoot = Join-Path $repoRoot '.tmp'
$consumerPath = Join-Path $tmpRoot 'consumer-app'
$externalPath = Join-Path ([System.IO.Path]::GetTempPath()) 'nsh-kit-consumer-app'

function Write-Section([string]$message) {
  Write-Host "`n== $message =="
}

try {
  Write-Section 'Build library'
  Push-Location $repoRoot
  npx ng build nsh-kit-ui --configuration production
  Pop-Location

  Write-Section 'Pack library'
  if (-not (Test-Path $distPath)) {
    throw "Dist folder not found at $distPath"
  }
  Push-Location $distPath
  $tgzName = (npm pack | Select-Object -Last 1)
  Pop-Location

  if (-not $tgzName -or -not $tgzName.EndsWith('.tgz')) {
    throw 'npm pack did not produce a .tgz file'
  }

  $tgzPath = Join-Path $distPath $tgzName
  if (-not (Test-Path $tgzPath)) {
    throw "Packed file not found at $tgzPath"
  }

  Write-Section 'Create consumer app'
  if (Test-Path $externalPath) {
    Remove-Item -Recurse -Force $externalPath
  }
  if (Test-Path $consumerPath) {
    Remove-Item -Recurse -Force $consumerPath
  }
  if (-not (Test-Path $tmpRoot)) {
    New-Item -ItemType Directory -Path $tmpRoot | Out-Null
  }

  $tempBase = [System.IO.Path]::GetTempPath()
  Push-Location $tempBase
  npx --yes -p @angular/cli@latest ng new consumer-app --standalone --style=scss --skip-git --directory nsh-kit-consumer-app --no-interactive
  Pop-Location

  Move-Item -Path $externalPath -Destination $consumerPath

  Push-Location $consumerPath

  Write-Section 'Install packed library'
  npm i $tgzPath

  Write-Section 'Patch AppComponent'
  $appComponentPath = Join-Path $consumerPath 'src\app\app.component.ts'
  @'
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NshButtonComponent, NshIconComponent, NshInputComponent } from 'nsh-kit-ui';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NshButtonComponent, NshIconComponent, NshInputComponent],
  template: `
    <div class="demo">
      <h1 class="demo__title">NSH Kit Smoke Test</h1>
      <div class="demo__row">
        <nsh-icon name="star" size="1.25rem"></nsh-icon>
        <nsh-button variant="filled">Primary action</nsh-button>
      </div>

      @if (showInput()) {
        <div class="demo__row">
          <nsh-input ariaLabel="Name" placeholder="Your name"></nsh-input>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .demo {
        display: grid;
        gap: var(--nsh-space-md);
        padding: var(--nsh-space-lg);
        font-family: var(--nsh-font-family);
      }

      .demo__title {
        margin: 0;
        font-size: var(--nsh-font-size-lg);
        line-height: var(--nsh-line-height-tight);
      }

      .demo__row {
        display: inline-flex;
        align-items: center;
        gap: var(--nsh-space-sm);
      }
    `,
  ],
})
export class AppComponent {
  protected readonly showInput = signal(true);
}
'@ | Set-Content -Path $appComponentPath -Encoding UTF8

  Write-Section 'Build consumer app'
  npx ng build

  Write-Section 'Test consumer app'
  npx ng test --watch=false

  Write-Host "`nVERIFY PACKAGE: SUCCESS"
  exit 0
} catch {
  Write-Host "`nVERIFY PACKAGE: FAILED"
  Write-Host $_
  exit 1
} finally {
  Pop-Location -ErrorAction SilentlyContinue
}
