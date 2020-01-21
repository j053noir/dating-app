import {
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
    @Output() cancelRegister = new EventEmitter();
    registerSubscription: Subscription;
    model: any = {};
    registerForm: FormGroup;
    bsConfig: Partial<BsDatepickerConfig>;

    constructor(
        private authService: AuthService,
        private alertifyService: AlertifyService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        const adultAge = new Date().setFullYear(new Date().getFullYear() - 18);
        this.bsConfig = {
            containerClass: 'theme-green',
            maxDate: new Date(adultAge),
        };
        this.createRegisterForm();
    }

    ngOnDestroy() {
        if (this.registerSubscription) {
            this.registerSubscription.unsubscribe();
        }
    }

    createRegisterForm() {
        this.registerForm = this.formBuilder.group(
            {
                gender: ['female'],
                username: ['', Validators.required],
                knownAs: ['', Validators.required],
                dateOfBirth: [null, Validators.required],
                city: ['', Validators.required],
                country: ['', Validators.required],
                password: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(4),
                        Validators.maxLength(8),
                    ],
                ],
                confirmPassword: ['', Validators.required],
            },
            { validators: this.passwordMatchValidator }
        );
    }

    passwordMatchValidator(formGroup: FormGroup) {
        return formGroup.get('password').value ===
            formGroup.get('confirmPassword').value
            ? null
            : { mismatch: true };
    }

    register() {
        this.registerSubscription = this.authService
            .register(this.registerForm.value)
            .subscribe(
                () => {
                    this.alertifyService.success(
                        'User registered successfully'
                    );
                },
                err => {
                    this.alertifyService.error(err);
                }
            );
    }

    cancel() {
        this.cancelRegister.emit(false);
    }
}
