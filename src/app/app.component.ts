import { Component, isDevMode, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'fhir-prom-formio';

  public tmplNo = 20100;
  public replyInfo = {
    replyNo: 1,
    tmplNo: 20100,
    replyUser: 'A123456789',
    replyDesc: {
      fillInDate: '2021-11-01T12:00:00+08:00',
      ptName: '郭彥志',
      idNo: 'A123456789',
      sex: 'female',
      firstBlock: { Q1: '1', Q2: '3', Q3: '4', Q4: '4', Q5: '4', Q6: '4' },
    },
    replyTime: '2022-03-02T09:14:23.220',
    tranUser: 30666,
    tranTime: '2022-03-02T09:14:23.220',
    tranStatus: 30,
    tranUserName: '楊名棟',
  };

  public newReplyInfo = {
    tmplNo: -2126664499,

    subjectType: 10,
    subject: 'A123456789',
  };

  public editReplyInfo = {
    branchNo: 1,
    replyNo: -90225782,
    tmplNo: -1621400951,
    subjectType: 10,
    subject: 'B222378038',
    tranUser: 34944,
    owner: 34944,
    tranTime: new Date('2022-08-26 07:47:50.237'),
    tranStatus: 20,
    systemUser: 33878,
    systemTime: new Date('2022-08-26 07:47:50.630'),
    subjectName: '卓曉霜',
  };

  constructor() { }

  ngOnInit() {
    if (isDevMode()) {
    }
  }

  public showMsg(event) {
    console.log(event);
  }
}
