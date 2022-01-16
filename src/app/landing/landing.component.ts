import { Component, Input, OnInit } from '@angular/core';
import { ApiServiceService } from '../shared/api-service.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HostListener } from '@angular/core';
import { TableData } from '../../assets/data';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  question_id: string;
  question: string;
  greenText: string;
  redText: string;
  id: number;
  displayQuesID: string = '';
  criteria: number;
  isPrevDisabled: boolean = false;
  isLastQues: boolean = false;
  dataPopulated: any;
  columnDefs: any;
  columnDefs2: any;
  fileData: any;
  rowData = [];
  rowData2= [];
  defaultRow;
  defaultRow2;
  routeSub: Subscription;
  isError: boolean = false;
  isSpinner: boolean = false;
  filesArray = [];
  isTextArea: boolean = false;
  isMultipleTable: boolean = false;
  firstTableHeading: string = '';
  secondTableHeading: string = '';
  firstTable = 'first-table';
  secondTable = 'second-table';
  // public context;
  constructor(private modalService: NgbModal, private apiService: ApiServiceService,
    private route: ActivatedRoute, private router: Router, private userService: UserService) {
      this.userService.isSideBarShown.next(true); 
    // this.context = { componentParent: this };
      this.routeSub = this.route.params.subscribe(params => {
        this.question_id = params['id'] //log the value of id
        this.userService.selectedNavTab.next(params['cid']);
      });
    }
  ngOnInit(): void {
    // this.filesArray = [];
    this.firstTableHeading = undefined;
    this.secondTableHeading = undefined;
    console.log(this);
    if(localStorage.getItem('firstTimeLogin') === 'true') {
      this.open();
    }
    if(this.question_id === '3_1_1') {
      this.isPrevDisabled = true;
    } else {
      this.isPrevDisabled = false;
    }
    if(this.question_id === '3_7_2' || this.question_id === '1_4_2') {
      this.isLastQues = true;
    } else {
      this.isLastQues = false;
    }
    let filteredQues;
    let resp = TableData.data;
    // this.apiService.getQuestionData().subscribe( resp => {
      this.dataPopulated = resp;
      filteredQues = this.dataPopulated.filter(element => { return element.questionid === this.question_id});
      if(filteredQues.length > 0) {
        this.question = filteredQues[0].question;
      this.greenText = filteredQues[0].greenText;
      this.redText = filteredQues[0].redText;
      this.id = filteredQues[0].id;
      this.displayQuesID = filteredQues[0].displayQuesID;
      localStorage.setItem('question', this.displayQuesID);
      this.isMultipleTable = filteredQues[0].isMultipleTable;
      this.criteria = filteredQues[0].criteria;
      localStorage.setItem('criteria', this.criteria.toString());
      let currentDate = new Date();
      let currentYear = currentDate.getFullYear();
      localStorage.setItem('year', currentYear.toString());
      if(this.id === 22) {
        this.columnDefs = filteredQues[0].columnDefs;
        this.columnDefs2 = filteredQues[0].columnDefs2;
        this.defaultRow = filteredQues[0].rowData;
        this.defaultRow2 = filteredQues[0].rowData2;
        this.firstTableHeading = filteredQues[0].firstTableHeading;
        this.secondTableHeading = filteredQues[0].secondTableHeading;
      } else {
        this.columnDefs = filteredQues[0].columnDefs;
        this.defaultRow = filteredQues[0].rowData;
      }
      this.isTextArea = filteredQues[0].isTextArea;
      localStorage.setItem('id', this.id.toString());
      this.getData();
      } else {
        console.log('No data found');
        alert('No data found');
      }
    // });
  }

  open() {
    const modalRef = this.modalService.open(NgbdModalContent, {size: 'lg', centered: true});
    // modalRef.componentInstance.name = this.popupData;
  }

  logout() {
    localStorage.clear();
    this.userService.isSideBarShown.next(false);
    this.router.navigateByUrl('login');
  }

  previous() {
    this.isSpinner = true;
    this.isError = false;
    let nextid = parseInt(localStorage.getItem('id'))-1;
    console.log(nextid);
    let prevQues = this.dataPopulated.filter(element => { return element.id === nextid});
    this.question_id = prevQues[0].questionid;
    this.router.navigateByUrl('landing/' + localStorage.getItem('criteria') + '/' + prevQues[0].questionid);
    this.rowData = [];
    this.rowData2 = [];
    this.filesArray = [];
    this.defaultRow = undefined;
    this.defaultRow2 = undefined;
    this.ngOnInit();
  }

  next() {
    this.isSpinner = true;
    localStorage.setItem('firstTimeLogin', 'false');
    let nextid = parseInt(localStorage.getItem('id'))+1;
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    localStorage.setItem('year', currentYear.toString());
    console.log(nextid);
    let nextQues = this.dataPopulated.filter(element => { return element.id === nextid});
    this.question_id = nextQues[0].questionid;
    localStorage.setItem('question', nextQues[0].displayQuesID);
    let dataEmpty = [];
    let body;
    let body2;
    if (this.id === 22) {
      // this.rowData = this.userService.getData();
      // this.rowData2 = this.userService.getSecondData();
      this.rowData.forEach(element => {
        element['q_no'] = this.displayQuesID.toString()+ '.1';
        element['user_id'] = parseInt(localStorage.getItem('user_id'));
        element['year'] = currentYear;
        element['timestamp'] = new Date().toString();
        element['criteria'] = this.criteria;
      });
      this.rowData2.forEach(element => {
        element['q_no'] = this.displayQuesID.toString()+'.2';
        element['user_id'] = parseInt(localStorage.getItem('user_id'));
        element['year'] = currentYear;
        element['timestamp'] = new Date().toString();
        element['criteria'] = this.criteria;
      });
      body = this.rowData;
      body2 = this.rowData2;
      body.forEach( element => {
        if(Object.values(element).includes(null || undefined || "")) {
          dataEmpty.length++;
        }
      });
      body2.forEach( element => {
        if(Object.values(element).includes(null || undefined || "")) {
          dataEmpty.length++;
        }
      });
    } else {
      if(!this.isTextArea) {
        this.rowData.forEach(element => {
          element['q_no'] = this.displayQuesID.toString();
          element['user_id'] = parseInt(localStorage.getItem('user_id'));
          element['year'] = currentYear;
          element['timestamp'] = new Date().toString();
          element['criteria'] = this.criteria;
        });
        this.rowData = this.userService.getData();
        body = this.rowData;
        body.forEach( element => {
          if(Object.values(element).includes(null || undefined || "")) {
            dataEmpty.length++;
          }
        });        
      } else {
        body = [{'SNO': 1,'textarea' : this.rowData, 'q_no': this.displayQuesID.toString(), 'user_id': parseInt(localStorage.getItem('user_id')), 
        'timestamp' : new Date().toString(), 'criteria' : this.criteria, 'year': currentYear}];
      }
    }
    let query = this.id.toString();
    if(dataEmpty.length === 0) {
      this.isError = false;
      if(this.id === 22) {
        this.apiService.saveQuestionnaireData(body).subscribe( resp => {
          console.log(resp);
          this.apiService.saveQuestionnaireData(body2).subscribe( response => {
            console.log(response);
            this.isSpinner = false;
          }, error => {
            this.isSpinner = false;
            console.log(error);
          })
        }, error => {
          this.isSpinner = false;
          console.log(error);
        });        
      } else {
        this.apiService.saveQuestionnaireData(body).subscribe( resp => {
          console.log(resp);
          this.isSpinner = false;
        });
      }
      this.router.navigateByUrl('landing/' + localStorage.getItem('criteria') + '/' + nextQues[0].questionid);
      this.rowData = [];
      this.rowData2 = [];
      this.defaultRow = undefined;
      this.defaultRow2 = undefined;
      this.ngOnInit();
    } else {
      this.isError = true;
      this.isSpinner = false;
    }
  }

  openConfirmation() {
    const modalRef = this.modalService.open(NgbdModalContentOpener);
    modalRef.componentInstance.parentScope = this;
  }

  save() {
    this.isSpinner = true;
    localStorage.setItem('firstTimeLogin', 'false');
    let nextid = 1;
    console.log(nextid);
    let dataEmpty = [];
    let body;
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    if(!this.isTextArea) {
      this.rowData.forEach(element => {
        element['q_no'] = this.displayQuesID.toString();
        element['user_id'] = parseInt(localStorage.getItem('user_id'));
        element['year'] = currentYear;
        element['timestamp'] = new Date().toString();
        element['criteria'] = this.criteria;
      });
      this.rowData = this.userService.getData();
      body = this.rowData;
    } else {
      body = [{'SNO': 1,'textarea' : this.rowData, 'q_no': this.displayQuesID.toString(), 'user_id': parseInt(localStorage.getItem('user_id')), 
      'timestamp' : new Date().toString(), 'criteria' : this.criteria, 'year': currentYear}];
    }
      body.forEach( element => {
        if(Object.values(element).includes(null || undefined || "")) {
          dataEmpty.length++;
        }
      });
    let query = this.id.toString();
    if(dataEmpty.length === 0) {
      this.isError = false;
        this.apiService.saveQuestionnaireData(body).subscribe( resp => {
          console.log(resp);
          this.isSpinner = false;
        });
        this.openConfirmation();
    } else {
      this.isError = true;
      this.isSpinner = false;
    }
  }

  afterCloseModal() {
    if(localStorage.getItem('criteria') === '1') {
      this.question_id = '1_1_1';
      this.router.navigateByUrl('landing/1/1_1_1');
      this.isLastQues = false;
      this.isPrevDisabled = true;
      this.rowData = [];
      this.rowData2 = [];
      this.defaultRow = undefined;
      this.defaultRow2 = undefined;
    } else if (localStorage.getItem('criteria') === '3') {
      this.question_id = '3_1_1';
      this.router.navigateByUrl('landing/3/3_1_1');
      this.isLastQues = false;
      this.isPrevDisabled = true;
      this.rowData = [];
      this.rowData2 = [];
      this.defaultRow = undefined;
      this.defaultRow2 = undefined;
    }
    this.ngOnInit();
  }

  upload(file) {
    this.fileData = file.target.files[0];
    console.log(file.target.files[0]);
    this.filesArray.push(file.target.files[0]); 
    console.log(this.filesArray);
  }

  delete(event, i) {
    this.filesArray.splice(i, 1);
    console.log(this.filesArray);
  }

  getData() {
    this.isSpinner = true;
    let requestParam;
    let requestParam2;
    if(this.id === 22) {
      requestParam = this.displayQuesID + '.1';
      requestParam2 = this.displayQuesID + '.2';
      this.apiService.getQuestionnaireData(requestParam, this.criteria).subscribe(resp => {
        console.log(resp);
        resp.forEach( element => {
          if(element['Filename'] === '' || !element['Filename']) {
            element['Filename'] = 'Not Available';
          }
        });
        this.isSpinner = false;
        if(resp.length > 0) {
            this.rowData = resp;
        }
        this.apiService.getQuestionnaireData(requestParam2, this.criteria).subscribe(response => {
          response.forEach( element => {
            if(element['Filename'] === '' || !element['Filename']) {
              element['Filename'] = 'Not Available';
            }
          });
          if(response.length > 0) {
            this.rowData2 = response;
            this.rowData2['secondData'] = true;
        }
        }, error => {
          this.isSpinner = false;
          console.log(error);
        });
      }, error => {
        this.isSpinner = false;
        console.log(error);
      });
    } else {
      requestParam = this.displayQuesID;
      this.apiService.getQuestionnaireData(requestParam, this.criteria).subscribe(resp => {
        console.log(resp);
        resp.forEach( element => {
          if(element['Filename'] === '' || !element['Filename']) {
            element['Filename'] = 'Not Available';
          }
        });
        this.isSpinner = false;
        if(resp.length > 0) {
            if(resp[0]['textarea']) {
              this.rowData = resp[0]['textarea'];
            } else {
              this.rowData = resp;
            }
        }
      }, error => {
        this.isSpinner = false;
        console.log(error);
      });
    }
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.routeSub = this.route.params.subscribe(params => {
      this.question_id = params['id'] //log the value of id
    });
    console.log(window.location.href.split('/').slice(-1)[0]);
    this.ngOnInit();
  }
}

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">PREAMBLE (Provided by us)</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      Criterion III – Research, Innovations and Extension 
      Instructions and terms and conditions
      Provided following instructions:<br>
      <ul><li>Data for Criteria 3.4.5, 3.4.6, 3.4.8, 3.4.9 (Research Publications) as per Calender Year -2020 (Jan-2020 to Dec-2020). For remaining points data is as per Academic Year 2020-21 (July-2020 to June-2021)</li>
      <li>Complete All information as per AQAR Guidelines and SOP.</li>
      <li>Do not keep anything blank. In case of NO data/Not applicable then mention 'NIL'.</li>
      <li>Do NOT change format and sequence of Excel sheets.</li>
      <li>You may add rows as per requirement.</li>
      <li>Do NOT delete columns.</li>
      <li>Wherever necessary upload relevant supporting documents and provide its link.</li>
      <li>Keep ready all other relevant supporting documents for uploading.</li></ul>
    </div>
    <div class="modal-footer">
      <button type="button" ngbAutofocus class="btn btn-primary" (click)="activeModal.close('Close click')">OK</button>
    </div>
  `
})
export class NgbdModalContent {

  constructor(public activeModal: NgbActiveModal) {}
}


@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Confirmation</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
    <input type="checkbox" style="margin-right: 10px" (change)="checkValue($event)">I am hereby declaring that I am Submitting the questionnaires. 
    </div>
    <div class="modal-footer">
      <button type="button" ngbAutofocus class="btn btn-primary confirmation-btn" (click)="closeModal()" [disabled]="isDisabled">OK</button>
    </div>
  `
})
export class NgbdModalContentOpener implements OnInit{
  isDisabled = true;
  @Input() public parentScope;
  constructor(public activeModal: NgbActiveModal) {}
  ngOnInit() {

  }

  checkValue(event) {
    if(event.currentTarget.checked) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }

  closeModal() {
    this.activeModal.close();
    this.parentScope.afterCloseModal();
  }
}