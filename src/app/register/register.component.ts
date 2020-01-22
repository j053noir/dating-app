import {
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { Subscription, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../_models/user';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
    @Output() cancelRegister = new EventEmitter();
    registerSubscription: Subscription;
    user: User;
    registerForm: FormGroup;
    bsConfig: Partial<BsDatepickerConfig>;

    constructor(
        private authService: AuthService,
        private alertifyService: AlertifyService,
        private formBuilder: FormBuilder,
        private router: Router
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
        if (this.registerForm.valid) {
            this.user = { ...this.registerForm.value };
            this.registerSubscription = this.authService
                .register(this.user)
                .pipe(
                    switchMap(response => {
                        if (response && response.id != null) {
                            return this.authService.login({
                                username: this.user.username,
                                password: this.user.password,
                            });
                        }
                        return throwError(
                            'There was a problem creating your user.'
                        );
                    })
                )
                .subscribe(
                    () => {
                        this.alertifyService.success(
                            'Registration successfully'
                        );
                        this.router.navigate(['/members']);
                    },
                    err => {
                        this.alertifyService.error(err);
                    }
                );
        }
    }

    cancel() {
        this.cancelRegister.emit(false);
    }
}
