import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { UserService } from '../../../services/user.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  // Form Validation
  registerForm!: FormGroup
  submitted: boolean = false
  msgStatus: string = ''

  userData = {
    "username": "",
    "email": "",
    "password": ""
  }

  constructor(
    private route: Router,
    private http: UserService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    // Validate Form
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  // ฟังก์ชัน submitRegister
  submitRegister(){

    this.submitted = true

      if(this.registerForm.valid){

        // รับค่าจากฟอร์ม
        this.userData.username = this.registerForm.value.username
        this.userData.email = this.registerForm.value.email
        this.userData.password = this.registerForm.value.password

        // เรียกใช้งาน API
        this.http.Register(this.userData).subscribe((data: any) => {

          if(data['status'] == "Success"){
            this.msgStatus = "<p class='alert alert-success text-center'>Register Success</p>"
            setTimeout(() => {
              this.route.navigate(['/auth/login'])
            }, 2000)
          }else{
            this.msgStatus = "<p class='alert alert-danger text-center'>Register Fail!!</p>"
          }

        })

        
      }

    }

}
