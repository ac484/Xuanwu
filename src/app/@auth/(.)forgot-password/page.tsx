import { LoginPage } from '@/features/core/auth';

export default function ForgotPasswordModal() {
    return <LoginPage mode="modal" initialAction="forgot-password" />;
}
