import type { Metadata } from "next"

import { ForgotPasswordForm } from "@/app/app/(unauthenticated)/_components/forgot-password-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Esqueci a Senha",
  description: "Insira seu e-mail para redefinir sua senha",
}

export default function ForgotPasswordPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Esqueci a senha</CardTitle>
        <CardDescription>
          Insira seu endereço de e-mail e enviaremos um link para redefinição de
          senha
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
    </Card>
  )
}
