import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[dr-cursor-pointer]'
})
export class CursorPointerDirective {
  constructor(private el: ElementRef) { }

  ngOnInit() {

    if (this.el && this.el.nativeElement) {
      const element = this.el.nativeElement as HTMLElement;
      element.style.cursor = "pointer";
    }
  }
}
