import { enableRipple } from '@syncfusion/ej2-base';
import * as React from 'react';
enableRipple(true);

export class SampleBase extends React.PureComponent {
  rendereComplete() {
    /**custom render complete function */
  }
  componentDidMount() {
    setTimeout(() => {
      this.rendereComplete();
    });
  }
}
export function updateSampleSection() {}
