import { LoginForm } from "@/app/(auth)/login/_components/login-form";
import { Modal } from "../_components/modal";

export default function LoginModal() {
  return (
    <Modal
      className="sm:max-w-sm"
      origin="/login"
      title="Login to your account"
      description="Enter your email below to login to your account"
    >
      <LoginForm />
    </Modal>
  );
}
