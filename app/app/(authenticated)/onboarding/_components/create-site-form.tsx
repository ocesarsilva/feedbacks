"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { env } from "@/env"

import { createWorkspace } from "@/lib/actions/workspace"
import { createWorkspaceSchema } from "@/lib/validations/workspace"

export function CreateWorkspaceForm({
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter()
  const [isCreatePending, startCreateTransaction] = React.useTransition()

  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
    },
  })

  function onSubmit(input: z.infer<typeof createWorkspaceSchema>) {
    startCreateTransaction(async () => {
      const { data, error } = await createWorkspace({ ...input })

      if (error) {
        toast.error(error)
        return
      }

      if (data) {
        router.push(`${data.id}`)
      }
      form.reset()
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
        {...props}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o nome do seu site aqui."
                  autoFocus
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sub domínio</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input placeholder="acme-co" type="text" {...field} />
                  <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50">
                    .{env.NEXT_PUBLIC_ROOT_DOMAIN}
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite a descrição do seu site aqui."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isCreatePending}>
          {isCreatePending && <Loader2 className="mr-2 size-4 animate-spin" />}
          Continuar
        </Button>
      </form>
    </Form>
  )
}
