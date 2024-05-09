import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[BoldAmount]'
})

export class BoldAmountDirective {
  constructor(private el: ElementRef) { }

  ngOnInit() {
      

    if (this.el && this.el.nativeElement) {
      const element = this.el.nativeElement as HTMLElement;
      element.style.fontWeight='bold';
    }
  }
}
