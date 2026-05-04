"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Pencil, X, Check } from "lucide-react"

interface EditProfileFormProps {
    userId: string
    initialName: string
    initialPhone: string
}

export function EditProfileForm({ userId, initialName, initialPhone }: EditProfileFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState(initialName)
    const [phone, setPhone] = useState(initialPhone)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSave = async () => {
        setIsLoading(true)
        setError(null)

        const supabase = createClient()
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ full_name: name, phone })
            .eq("id", userId)

        if (updateError) {
            setError(updateError.message)
        } else {
            setIsOpen(false)
            router.refresh()
        }

        setIsLoading(false)
    }

    if (!isOpen) {
        return (
            <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Редактировать
            </Button>
        )
    }


    return (
        <Card className="w-full sm:w-72">
            <CardContent className="pt-4 space-y-3">
                <div className="space-y-1">
                    <Label className="text-xs">Имя</Label>
                    <Input
                        placeholder="Иван Иванов"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">Телефон</Label>
                    <Input
                        type="tel"
                        placeholder="+7 (999) 123-45-67"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                {error && <p className="text-xs text-destructive">{error}</p>}
                <div className="flex gap-2">
                    <Button size="sm" onClick={handleSave} disabled={isLoading} className="flex-1">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="mr-1 h-4 w-4" />Сохранить</>}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}