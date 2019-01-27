import { Directive, OnInit, Input, ElementRef, Renderer, Optional } from '@angular/core';

@Directive({
  selector: '[appFocusDirective]'
})
export class FocusDirectiveDirective implements OnInit {
  @Input('appFocusDirective') isFocused: boolean;
  
  constructor( private hostElement?: ElementRef, private renderer?: Renderer) { }

  ngOnInit() {
    if (this.isFocused) {
      this.renderer.invokeElementMethod(this.hostElement.nativeElement, 'focus');      
    }
  }
}