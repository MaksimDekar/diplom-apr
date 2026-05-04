"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
    const [fullName, setFullName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const supabase = createClient()

        try {
            // Регистрируем пользователя
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        phone: phone,
                    }
                }
            })

            if (signUpError) throw signUpError

            // Входим сразу после регистрации
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (signInError) throw signInError

            // Теперь обновляем профиль — пользователь уже авторизован
            if (signInData.user) {
                await supabase
                    .from("profiles")
                    .update({ full_name: fullName, phone })
                    .eq("id", signInData.user.id)
            }

            router.push("/dashboard")
            router.refresh()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : JSON.stringify(err))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-muted/30 p-6">
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Регистрация</CardTitle>
                        <CardDescription>Создайте личный кабинет</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleRegister}>
                            <div className="flex flex-col gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="fullName">Ваше имя</Label>
                                    <Input
                                        id="fullName"
                                        placeholder="Иван Иванов"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Телефон</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+7 (999) 123-45-67"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="ivan@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Пароль</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        minLength={6}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                {error && <p className="text-sm text-destructive">{error}</p>}
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Регистрация...
                                        </>
                                    ) : (
                                        "Зарегистрироваться"
                                    )}
                                </Button>
                                <p className="text-center text-sm text-muted-foreground">
                                    Уже есть аккаунт?{" "}
                                    <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                                        Войти
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}     