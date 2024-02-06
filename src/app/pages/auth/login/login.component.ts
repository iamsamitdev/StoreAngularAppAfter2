import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { UserService } from 'src/app/services/user.service'
import { Router } from '@angular/router'
import { AuthService } from 'src/app/services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // Form Validation
  loginForm!: FormGroup
  submitted: boolean = false
  msgStatus: string = ''

  // สร้างตัวแปรไว้เก็บข้อมูลผู้ใช้ผูกกับฟอร์ม
  userData = {
    "username": "",
    "password": ""
  }

  // สร้างตัวแปรเก็บข้อมูลการ Login
  userLogin = {
    "username": "",
    "email": "",
    "token": ""
  }

  constructor(
    private auth: AuthService,
    private route: Router,
    private http: UserService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    // Validate Form
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  // ฟังก์ชัน submitLogin
  submitLogin(){

    this.submitted = true

    if(this.loginForm.valid){
      this.userData.username = this.loginForm.value.username
      this.userData.password = this.loginForm.value.password
      console.log(this.userData)

      // เรียกใช้งาน API
      this.http.LogIn(this.userData).subscribe((data: any) => {

        // console.log(data);
        // ตรวจสอบค่าที่ได้จาก API ถ้า token มีค่าเป็น null หรือ undefined แสดงว่า login ไม่สำเร็จ
        if(data['token'] == null || data['token'] == undefined){
          //alert("Login Fail!!")
          this.msgStatus = "<p class='alert alert-danger text-center'>Login Fail!!</p>"
        }else{

          this.userLogin = {
            "username": data['username'],
            "email": data['email'],
            "token": data['token']
          }

          // บันทึกข้อมูลผู้ใช้ลง local storage
          this.auth.setUser(this.userLogin)

          // alert("Login Success")
          this.msgStatus = "<p class='alert alert-success text-center'>Login Success</p>"

          // delay 2 วินาที
          setTimeout(() => {
            // ลบข้อความแจ้งเตือน
            this.msgStatus = ''
            // Redirect ไปหน้า backend
            this.route.navigate(['backend'])
          }, 2000)
        }

      })

    }

  }

}
