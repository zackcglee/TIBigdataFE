import { Component, OnInit } from '@angular/core';
import { SocialUser, AuthService } from 'angularx-social-login';
import { Router } from '@angular/router';
import { EPAuthService } from '../auth.service';
import { LoginComponent } from '../login/login.component';
import { HttpClient } from "@angular/common/http";
import { IpService } from 'src/app/ip.service'
import { IdControlService } from "../../../../homes/body/search/service/id-control-service/id-control.service";

@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.less'],
  providers: [LoginComponent]
})
export class UserpageComponent implements OnInit {

  private nowUser: SocialUser;
  private myDocs: string[] = [];
  // private myDocsNum : Number;
  private myHst: string[] = [];
  private isDocEmpty : boolean = false;

  constructor(
    private http: HttpClient, private ipService: IpService,    private idSvs : IdControlService,


    public _router: Router, private _auth: EPAuthService, private _login: LoginComponent, private _gauth: AuthService
  ) {

  }

  ngOnInit() {
    this._gauth.authState.subscribe((user) => {
      this.nowUser = user;
      this.getKeepDocs();
      this.getMyHst()
    });
  }

  gSignOut() {
    this._gauth.signOut();
  }
  showCookie() {
    alert(document.cookie);
  }

  changeCookie() {
    document.cookie = 'same-site-cookie=foo; SameSite=Lax';
    document.cookie = 'cross-site-cookie=bar; SameSite=None; Secure';
    alert(document.cookie);
  }

  async getKeepDocs() {
    this.myDocs = await this._auth.getMyDocs() as string[];
    if(this.myDocs.length == 1)
      this.isDocEmpty = true;
    // console.log(typeof(this.myDocs))
    // console.log(this.myDocs.length)
    // this.myDocsNum = this.myDocs.length;
  }

  deleteAllMyDocs(){
    console.log("문서 지우기")
     this._auth.eraseAllMyDoc().then(
       ()=>this.getKeepDocs()
     );
    
  }

  async getMyHst(){
    this.myHst = await this._auth.showSrchHst();
    console.log("my hist: ",this.myHst);
  }


  
  // //dashboard ts에도 동일한 함수 있음. 차후 idList ts으로 이동하여 합침. 
  // async convertID2Title() {
  //   this.idList = await this.auth.getMyDocs() as string[];
  //   return new Promise((resolve) => {
  //     this.es.searchByManyId(this.idList).then(res => {
  //       console.log(res);
  //       let articles = res["hits"]["hits"];
  //       for (let i = 0; i < articles.length; i++) {
  //         this.myDocsTitles[i] = articles[i]["_source"]["post_title"][0]
  //       }
  //     })
  //     resolve();
  //     // this.http.post<any>()
  //   })
  // }

}
