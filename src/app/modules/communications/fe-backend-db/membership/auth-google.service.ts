import { Injectable, Injector } from "@angular/core";
import { IpService } from 'src/app/ip.service';
import { HttpClient } from "@angular/common/http";
import { logStat, UserProfile } from "./user.model";
import { Auth } from "./userAuth.model";
import { Router } from "@angular/router";
import { DocumentService } from "../../../homes/body/search/service/document/document.service";

import {
  AuthService,
  GoogleLoginProvider,
} from "angularx-social-login";

class storeToken {
  type: logStat;
  token: string;

  constructor(type: logStat, token: string) {
    this.type = type;
    this.token = token
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthGoogleService extends Auth {
  getProfile(user: any) {
    throw new Error("Method not implemented.");
  }

  protected user: UserProfile;

  protected URL = this.ipService.get_FE_DB_ServerIp();

  private GOOGLE_REG_URL = this.URL + "/gUser/gRegister";
  private GOOGLE_CHECK_OUR_USER_URL = this.URL + "/gUser/check_is_our_g_user";
  private GOOGLE_VERIFY_TOKEN_URL = this.URL + "/gUser/verifyGoogleToken";
  private GOOGLE_USER_INFO_URL = this.URL + "/gUser/getUserInfo";
  constructor(
    private injector: Injector,
    private ipService: IpService,
    http: HttpClient,
    router: Router,
    private gauth: AuthService,
    private docSvc: DocumentService,
  ) {
    super(router, http);
  }

  /**
   * @function getInstance()
   * @returns google auth 인스턴스를 반환. 싱글턴 패턴 사용.
   */
  getInstance() {
    return this;
  }

  async register(user): Promise<any> {
    /* call http request with email address to check db. */
    let isOurUser = await super.postIsOurUser(user, this.GOOGLE_CHECK_OUR_USER_URL);

    if (isOurUser.succ) {
      alert("이미 등록되어 있는 id 입니다. 로그인 페이지로 이동합니다.");
      this.router.navigateByUrl("/login");
    }
    else {
      /* call http request with user information to register new user */
      let res = await this.http.post<any>(this.GOOGLE_REG_URL, user).toPromise();
      return res.succ;
    }
  }

  async logIn(): Promise<any> {
    let singInResult = await this.googleSignIn();

    //check if this user is our user already
    let isOurUser = await super.postIsOurUser(singInResult, this.GOOGLE_CHECK_OUR_USER_URL)

    if (!isOurUser.succ) {
      alert("아직 KUBiC 회원이 아니시군요? 회원가입 해주세요! :)");
      this.router.navigateByUrl("/register");
    }
    else {
      let res = await this.http.post<any>(this.GOOGLE_USER_INFO_URL, singInResult).toPromise();
      alert("돌아오신 걸 환영합니다, " + singInResult.name + "님. 홈 화면으로 이동합니다.");
      localStorage.setItem('token', JSON.stringify(new storeToken(logStat.google, singInResult.idToken)));
      this.user = new UserProfile(logStat.google, res.payload.email, res.payload.name, res.payload.nickname, res.payload.inst, res.payload.api, singInResult.idToken);
      console.log(this.user);
      super.confirmUser(this.user);


      this.router.navigate(['/homes'])
    }
  }

  /**
   * @description 루글 로그인 : google login api 사용
   */
  async googleSignIn() {
    let platform = GoogleLoginProvider.PROVIDER_ID;
    return await this.gauth.signIn(platform);
  }


  /**
   * @description 구글 로그아웃
   */
  logOut(): void {
    localStorage.removeItem("token");
    this.gauth.signOut();
    // this.isLogIn = logStat.unsigned;
  }

  //verify if this token is from google
  async verifyToken(token: string): Promise<any> {
    var client = this.injector.get("GOOGLE PROVIDER ID"); //get google api client id from angular injector
    return await this.http.post<any>(this.GOOGLE_VERIFY_TOKEN_URL, { token: token, client: client }).toPromise();
  }
}
