export const redirects = {
  toLogin: "/login",
  toSignup: "/register",
  toApp: "/",
  toReset: "/reset-password",
  toForgot: "/forgot-password",
  toOnboarding: "/onboarding",
  afterLogout: "/login",
} as const

export const unknownError =
  "Ocorreu um erro desconhecido. Tente novamente mais tarde."
