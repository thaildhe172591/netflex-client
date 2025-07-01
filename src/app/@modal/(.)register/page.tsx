"use client";
import { RegisterForm } from "@/app/(auth)/register/_components/register-form";
import { Modal } from "../_components/modal";

export default function RegisterModal() {
  return (
    <Modal
      className="sm:max-w-sm"
      origin="/register"
      title="Create your account"
      description="Join us today! Enter your details below to create your new account."
    >
      <RegisterForm />
    </Modal>
  );
}
