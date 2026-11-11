import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validates 10-digit Indian Permanent Account Number (PAN)
 * Format: 5 uppercase letters, 4 digits, 1 uppercase letter (e.g., ABCDE1234F)
 */
export function panValidator(): ValidatorFn {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const valid = panRegex.test(control.value.trim().toUpperCase());
    return valid ? null : { invalidPan: { value: control.value } };
  };
}

/**
 * Validates 15-character Goods and Services Tax Identification Number (GSTIN)
 * Format: 2 state digits, 10 PAN chars, 1 entity code, 1 Z, 1 check digit
 */
export function gstinValidator(): ValidatorFn {
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const valid = gstinRegex.test(control.value.trim().toUpperCase());
    return valid ? null : { invalidGstin: { value: control.value } };
  };
}

/**
 * Validates 14-digit FSSAI Food Safety License Number
 */
export function fssaiValidator(): ValidatorFn {
  const fssaiRegex = /^[0-9]{14}$/;
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const valid = fssaiRegex.test(control.value.trim());
    return valid ? null : { invalidFssai: { value: control.value } };
  };
}

/**
 * Validates 11-character Indian Financial System Code (IFSC)
 * Format: 4 bank alphabetic chars, 0, 6 branch alphanumeric chars
 */
export function ifscValidator(): ValidatorFn {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const valid = ifscRegex.test(control.value.trim().toUpperCase());
    return valid ? null : { invalidIfsc: { value: control.value } };
  };
}

/**
 * Validates 10-digit Indian Mobile Phone (+91 or plain 10 digits starting with 6,7,8,9)
 */
export function indianPhoneValidator(): ValidatorFn {
  const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const valid = phoneRegex.test(control.value.trim());
    return valid ? null : { invalidIndianPhone: { value: control.value } };
  };
}
