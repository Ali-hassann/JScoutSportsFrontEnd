import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-file-viewer',
  templateUrl: './show-file-viewer.component.html',
  styleUrls: ['./show-file-viewer.component.scss']
})
export class ShowFileViewerComponent implements OnInit {
  @Input() url: any = "";
  constructor(
  ) {
    this.url = "";
  }

  ngOnInit(): void {
  }

}
