/**
 * script.js  —  Student Registration Portal (Practical 05)
 *
 * PURPOSE: UI enhancements ONLY.
 * - Password show/hide toggle
 * - Submit button loading spinner
 * - Auto-scroll to the first error
 *
 * IMPORTANT: This file performs NO validation.
 * All validation is done server-side in server.js → validateStudent().
 * Even if this file is deleted, the application will still work correctly.
 */

'use strict';

document.addEventListener('DOMContentLoaded', function () {

  // ── 1. Password Visibility Toggles ──────────────────────
  /**
   * Each password field has a <button class="toggle-pw"> next to it.
   * Clicking it switches the input type between "password" and "text".
   */
  document.querySelectorAll('.toggle-pw').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = btn.getAttribute('data-target');
      var inputEl  = document.getElementById(targetId);
      if (!inputEl) return;

      var isHidden = inputEl.type === 'password';
      inputEl.type = isHidden ? 'text' : 'password';

      // Update accessible label
      btn.setAttribute('aria-label',
        isHidden ? 'Hide password' : 'Show password'
      );

      // Swap icon: open eye ↔ closed eye
      var svgPath = btn.querySelector('path');
      if (svgPath) {
        if (isHidden) {
          // "Eye off" path
          svgPath.setAttribute('d',
            'M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z'
          );
        } else {
          // "Eye open" path
          svgPath.setAttribute('d',
            'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'
          );
        }
      }
    });
  });


  // ── 2. Submit Button — Loading State ─────────────────────
  /**
   * When the form is submitted, change the button text to show a spinner.
   * This prevents double-clicks and gives the user feedback.
   * The button is NOT disabled via JS here because that would prevent
   * the form from submitting in some browsers. The server handles
   * everything; this is purely cosmetic feedback.
   */
  var form      = document.getElementById('registrationForm');
  var submitBtn = document.getElementById('submitBtn');

  if (form && submitBtn) {
    form.addEventListener('submit', function () {
      var btnText = submitBtn.querySelector('.btn-text');
      var btnIcon = submitBtn.querySelector('.btn-icon');

      if (btnText) btnText.textContent = 'Submitting…';
      if (btnIcon) {
        // Replace arrow icon with spinner
        btnIcon.outerHTML = '<span class="spinner" aria-hidden="true"></span>';
      }
      submitBtn.disabled = true;
    });
  }


  // ── 3. Auto-scroll to First Error ────────────────────────
  /**
   * If there are validation errors on the page (after a failed submission),
   * smoothly scroll the first error message into view so the user can
   * immediately see what went wrong.
   */
  var firstError = document.querySelector('.field-error');
  if (firstError) {
    // Small delay so the page fully renders before scrolling
    setTimeout(function () {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  }


  // ── 4. Auto-dismiss Success Banner after 10 seconds ──────
  var successBanner = document.getElementById('successBanner');
  if (successBanner) {
    setTimeout(function () {
      successBanner.style.transition = 'opacity 0.6s ease';
      successBanner.style.opacity = '0';
      setTimeout(function () {
        successBanner.style.display = 'none';
      }, 600);
    }, 10000); // 10 seconds
  }

}); // end DOMContentLoaded
