declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      src?: string;
      alt?: string;
      ar?: boolean;
      'ar-modes'?: string;
      'camera-controls'?: boolean;
      'tone-mapping'?: string;
      poster?: string;
      'shadow-intensity'?: string;
      exposure?: string;
      'shadow-softness'?: string;
      'camera-orbit'?: string;
      'field-of-view'?: string;
      'min-camera-orbit'?: string;
      'max-camera-orbit'?: string;
      'min-field-of-view'?: string;
      'max-field-of-view'?: string;
      'camera-target'?: string;
    }, HTMLElement>;
  }
}
