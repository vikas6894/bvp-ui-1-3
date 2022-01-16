import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-gridaction',
  templateUrl: './gridaction.component.html',
  styleUrls: ['./gridaction.component.scss']
})
export class GridactionComponent implements ICellRendererAngularComp {

  public params: any;
  constructor() { }

  agInit(params: any): void {
    this.params = params;
  }

  ngOnInit(): void {
  }

  public onFileSelected(event) {
    this.params.context.componentParent.uploadFiles(this.params.data, event.target.files[0]);
  }

  refresh(): boolean {
    return false;
  }

  invokeUploadFile() {
    
  }
}
