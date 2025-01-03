"use client"

import type * as React from "react"
import type { UseFormReturn } from "react-hook-form"

import { cn } from "@/lib/utils"

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
import type { createRequestSchema } from "@/lib/validations/request"
import type { z } from "zod"

interface CreateRequestFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<z.infer<typeof createRequestSchema>>
  onSubmit: (data: z.infer<typeof createRequestSchema>) => void
}

export function CreateRequestForm({
  children,
  form,
  onSubmit,
  className,
  ...props
}: CreateRequestFormProps) {
  return (
    <Form {...form}>
      <form
        className={cn("grid w-full gap-4", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
        {...props}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o título do feedback aqui."
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
                  placeholder="Digite a descrição do feedback aqui."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {children}
      </form>
    </Form>
  )
}
