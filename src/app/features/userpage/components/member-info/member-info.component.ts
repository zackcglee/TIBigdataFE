import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "src/app/core/services/authentication-service/authentication.service";
import { UserProfile } from "src/app/core/models/user.model";

@Component({
  selector: 'app-member-info',
  templateUrl: './member-info.component.html',
  styleUrls: ['./member-info.component.less']
})
export class MemberInfoComponent implements OnInit {

  private userProfile: UserProfile;

  constructor(
    private authenticationService: AuthenticationService,
  ) {
    this.authenticationService.getCurrentUserChange().subscribe((currentUser) => {
      this.userProfile = currentUser;
      console.log(this.userProfile);
    });

  }

  ngOnInit(): void {

  }

}