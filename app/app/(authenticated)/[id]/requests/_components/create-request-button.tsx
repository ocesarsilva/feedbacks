"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

import { createRequest } from "@/lib/actions/request"
import { createRequestSchema } from "@/lib/validations/request"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"
import { CreateRequestForm } from "./create-request-form"

type Inputs = z.infer<typeof createRequestSchema>

export function CreateRequestButton({ workspaceId }: { workspaceId: string }) {
  const [loading, setLoading] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })

  async function onSubmit(inputs: Inputs) {
    setLoading(true)

    try {
      const { data, error } = await createRequest({
        title: inputs.title,
        description: inputs.description,
        workspaceId,
      })

      if (error) {
        toast.error(error)
      }

      if (data) {
        setOpen(false)
      }

      form.reset()
    } finally {
      setLoading(false)
    }
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            CRIAR
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Compartilhe seu feedback.</DialogTitle>
            <DialogDescription>
              Seu feedback é extremamente valioso para nós.
            </DialogDescription>
          </DialogHeader>
          <CreateRequestForm form={form} onSubmit={onSubmit}>
            <Button type="submit" className="mt-2" disabled={loading} size="sm">
              {loading && (
                <Loader2
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Enviar
              <span className="sr-only">Enviar</span>
            </Button>
          </CreateRequestForm>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="sm" variant="outline">
          CRIAR
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Compartilhe seu feedback.</DrawerTitle>
          <DrawerDescription>
            Seu feedback é extremamente valioso para nós.
          </DrawerDescription>
        </DrawerHeader>
        <CreateRequestForm form={form} onSubmit={onSubmit}>
          <Button type="submit" className="mt-2" disabled={loading} size="sm">
            {loading && (
              <Loader2
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Enviar
            <span className="sr-only">Enviar</span>
          </Button>
        </CreateRequestForm>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
