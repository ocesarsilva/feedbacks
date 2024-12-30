import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { HelpCircle } from "lucide-react"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const workspaceId = (await params).id

  const colorOptions = [
    { value: "slate", label: "Cinza Escuro", class: "bg-slate-600" },
    { value: "red", label: "Vermelho", class: "bg-red-600" },
    { value: "blue", label: "Azul", class: "bg-blue-600" },
    { value: "green", label: "Verde", class: "bg-green-600" },
    { value: "purple", label: "Roxo", class: "bg-purple-600" },
    { value: "orange", label: "Laranja", class: "bg-orange-600" },
  ]

  return (
    <div className="w-full grid gap-5 pb-10 pt-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Identidade Visual
          </CardTitle>
          <CardDescription>
            Altere as configurações da sua marca.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="logo" className="text-base font-medium">
                Logo
              </Label>
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" alt="Logo da marca" />
                <AvatarFallback>C</AvatarFallback>
              </Avatar>
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor="name" className="text-base font-medium">
                Nome
              </Label>
              <Input
                id="name"
                defaultValue="Cesar Silva"
                className="max-w-[200px]"
              />
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor="primary-color" className="text-base font-medium">
                Cor Primária
              </Label>
              <div className="flex items-center space-x-2">
                <Select defaultValue="gray">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Selecione a cor" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center">
                          <div
                            className={cn(
                              "w-4 h-4 rounded-full mr-2",
                              color.class,
                            )}
                          />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Label htmlFor="theme" className="text-base font-medium">
                  Tema
                </Label>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <Select defaultValue="dynamic">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Selecione o tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dynamic">Sistema</SelectItem>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="w-full">
            <div className="flex-1" />
            <Button variant="secondary" className="ml-auto">
              Salvar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
