import Swal from 'sweetalert2';

// Use your brand green for general alerts
const BRAND_GREEN = '#00C853'; 
const DANGER_RED = '#d33';
const NEUTRAL_GREY = '#757575';

export const showAlert = (title, text, icon = 'info') => {
    return Swal.fire({
        title,
        text,
        icon,
        confirmButtonColor: BRAND_GREEN, // Matches your app
    });
};

export const showConfirm = (title, text, isDestructive = false) => {
    return Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        // This is the key: it tells Swal NOT to use its own button math
        buttonsStyling: false, 
        customClass: {
            confirmButton: isDestructive ? 'swal-btn-destructive' : 'swal-btn-brand',
            cancelButton: 'swal-btn-cancel'
        },
    });
};