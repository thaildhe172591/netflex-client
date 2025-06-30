"use client";
import { RegisterForm } from "@/app/(auth)/register/_components/register-form";
import { Modal } from "../_components/modal";

export default function RegisterModal() {
  return (
    <Modal className="sm:max-w-sm" origin="/register">
      <RegisterForm />
    </Modal>
  );
}
