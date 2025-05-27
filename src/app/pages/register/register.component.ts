import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { UiService } from '../../services/ui.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { RegisterFormData, UserRole, ApiError } from '../../models/auth.model';
import {
  USER_ROLES,
  VALIDATION_RULES,
  APP_CONFIG,
} from '../../core/constants/app.constants';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, IconComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  registerForm!: FormGroup;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';
  userRoles = USER_ROLES;
  appName = APP_CONFIG.name;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private uiService: UiService,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Verificar si ya está autenticado
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigate(['/dashboard']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group(
      {
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(VALIDATION_RULES.EMAIL.PATTERN),
          ],
        ],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(VALIDATION_RULES.USERNAME.MIN_LENGTH),
            Validators.maxLength(VALIDATION_RULES.USERNAME.MAX_LENGTH),
            Validators.pattern(VALIDATION_RULES.USERNAME.PATTERN),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(VALIDATION_RULES.PASSWORD.MIN_LENGTH),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        profileImage: [''],
        bio: ['', [Validators.maxLength(VALIDATION_RULES.BIO.MAX_LENGTH)]],
        role: ['AFICIONADO' as UserRole, [Validators.required]],
        acceptTerms: [false, [Validators.requiredTrue]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmPassword?.hasError('passwordMismatch')) {
      delete confirmPassword.errors!['passwordMismatch'];
      if (Object.keys(confirmPassword.errors!).length === 0) {
        confirmPassword.setErrors(null);
      }
    }

    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData: RegisterFormData = this.registerForm.value;

      // Preparar datos para el backend
      const registerData = {
        email: formData.email.trim(),
        username: formData.username.trim(),
        password: formData.password,
        role: formData.role,
        ...(formData.profileImage && {
          profileImage: formData.profileImage.trim(),
        }),
        ...(formData.bio && { bio: formData.bio.trim() }),
      };

      this.authService
        .register(registerData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.uiService.showNotification(
              '¡Registro exitoso! Bienvenido a Riffly',
              'success'
            );
            this.router.navigate(['/dashboard']);
          },
          error: (error: ApiError) => {
            this.errorMessage = error.message;
            this.isLoading = false;
          },
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);

    if (field?.touched && field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (field.errors['email']) {
        return VALIDATION_RULES.EMAIL.MESSAGE;
      }
      if (field.errors['minlength']) {
        return fieldName === 'password'
          ? VALIDATION_RULES.PASSWORD.MESSAGE
          : `${this.getFieldLabel(fieldName)} debe tener al menos ${
              field.errors['minlength'].requiredLength
            } caracteres`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldLabel(fieldName)} no puede exceder ${
          field.errors['maxlength'].requiredLength
        } caracteres`;
      }
      if (field.errors['pattern']) {
        return VALIDATION_RULES.USERNAME.MESSAGE;
      }
      if (field.errors['passwordMismatch']) {
        return 'Las contraseñas no coinciden';
      }
      if (field.errors['required'] && fieldName === 'acceptTerms') {
        return 'Debes aceptar los términos y condiciones';
      }
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      email: 'El email',
      username: 'El nombre de usuario',
      password: 'La contraseña',
      confirmPassword: 'La confirmación de contraseña',
      bio: 'La biografía',
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field?.touched && field?.errors);
  }
}
