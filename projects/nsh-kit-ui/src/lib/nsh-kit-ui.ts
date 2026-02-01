import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'nsh-nsh-kit-ui',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <p>
      nsh-kit-ui works!
    </p>
  `,
  styles: ``,
})
export class NshKitUi {

}

