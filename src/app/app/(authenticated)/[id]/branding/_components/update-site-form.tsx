"use client"

import * as React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
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
import type { Site } from "@/db/schema"
import { updateSite } from "@/lib/actions/site"
import { updateSiteSchema } from "@/lib/validations/site"

interface UpdateSiteFormProps {
  site: Site
}

export function UpdateSiteForm({ site, ...props }: UpdateSiteFormProps) {
  const [isCreatePending, startCreateTransaction] = React.useTransition()

  const form = useForm<z.infer<typeof updateSiteSchema>>({
    resolver: zodResolver(updateSiteSchema),
    defaultValues: {
      name: site.name ?? "",
      description: site.description ?? "",
    },
  })

  function onSubmit(input: z.infer<typeof updateSiteSchema>) {
    startCreateTransaction(async () => {
      const { error } = await updateSite({ ...input, siteId: site.id })

      if (error) {
        toast.error(error)
        return
      }
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

        <Button type="submit" disabled={isCreatePending} className="ml-auto">
          {isCreatePending && <Loader2 className="mr-2 size-4 animate-spin" />}
          Continuar
        </Button>
      </form>
    </Form>
  )
}
