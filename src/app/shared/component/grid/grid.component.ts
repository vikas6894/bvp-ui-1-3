import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ApiServiceService } from '../../api-service.service';
import { UserService } from '../../user.service';
import { GridactionComponent } from '../gridaction/gridaction.component';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, OnChanges {

  gridApi;
  gridColumnApi;
  @Input() columnDefs;
  @Input() rowData;
  @Input() defaultRow;
  @Input() tableHeading;
  @Input() tableType;
  previousRowData;
  lastSavedRowData;
  index: number;
  public frameworkComponents;
  public context;
  isSpinner;
  constructor(private userService: UserService, private apiService: ApiServiceService) { 
    this.context = { componentParent: this };
    this.frameworkComponents = {
      GridactionComponent: GridactionComponent,
    };
  }

  ngOnInit(): void {
    console.log(this);
    // this.gridApi.setColumnDefs(this.columnDefs);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.tableType);
    this.previousRowData = [...this.rowData];
    if(this.rowData['secondData'] === true) {
      this.userService.setSecondData(this.rowData);
    } else {
      this.userService.setData(this.rowData);
    }
    console.log('changes>>>>');
    this.index = this.rowData.length + 1;
    if(changes.rowData) {
      this.addInitialRow();
    }
    if(changes.defaultRow) {
      this.addInitialRow();
    }
    // this.gridOptions.api.sizeColumnsToFit();
    // this.gridApi.sizeColumnsToFit();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // this.gridApi.sizeColumnsToFit();
    this.addInitialRow();
  }

  addInitialRow() {
    if(this.defaultRow && this.rowData && this.gridApi) {
      if(this.rowData.length === 0) {
        this.addRow();
      }
    }
  }

  addRow() {
    let tempdata = JSON.parse(JSON.stringify(this.defaultRow));
    tempdata['SN'] = this.index;
    this.rowData.push(tempdata);
    this.index++;
    this.gridApi.setRowData(this.rowData);
    if(this.rowData['secondData'] === true) {
    this.userService.setSecondData(this.rowData);
    } else {
      this.userService.setData(this.rowData);
    }
  }

  clear() {
    let secondTable = this.rowData['secondData']
    let tempArray = [...this.rowData];
    this.rowData = [];
    tempArray.forEach( (element, index) => {
      if(Object.values(element).includes(null || undefined || "")) {
        // console.log(element);
      } else {
        this.rowData.push(element);
      }
    });
    this.rowData['secondData'] = secondTable;
    // console.log(this.rowData);
    // this.rowData = [...this.previousRowData];
    this.index = this.rowData.length + 1;
    if(this.rowData['secondData'] === true) {
      this.rowData.forEach( (element,i) => {
        element['SN'] = i+1;
      });
      this.userService.setSecondData(this.rowData);
      this.gridApi.setRowData(this.rowData);
      } else {
        this.rowData.forEach( (element,i) => {
          element['SN'] = i+1;
        });
        this.userService.setData(this.rowData);
        this.gridApi.setRowData(this.rowData);
      }
  }

  uploadFiles(params, fileElement) {
    this.isSpinner = true;
    let sno = params.SN;
    let currentDate = new Date();
      this.apiService.uploadFile(fileElement, sno).subscribe( response2 => {
        console.log(response2);
        this.isSpinner = false;
        this.rowData[sno-1]['Filename'] = fileElement.name;
        this.gridApi.setRowData(this.rowData);
      }, error => {
        this.isSpinner = false;
        console.log(error);
      });
  }
}
