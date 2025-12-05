import { toast, Notification } from '@/components/ui'; // Adjust import based on your UI library

// Reusable toast notification function
const showToast = (message = '', type = 'success', duration = 3000, placement = 'top-center') => {
    toast.push(
        <Notification type={type} duration={duration}>
            {message}
        </Notification>,
        { placement }
    );
};

// Specific success message trigger
const triggerMessageSuccessfully = (msg = 'Operation Successful!') => {
    showToast(msg, 'success');
};

// Specific error message trigger (example)
const triggerMessageError = (msg = 'Operation Failed!') => {
    showToast(msg, 'danger');
};

export { showToast, triggerMessageSuccessfully, triggerMessageError };