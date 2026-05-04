import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Политика конфиденциальности - АбсолютПрофРемонт",
  description: "Политика обработки и защиты персональных данных",
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8">Политика конфиденциальности</h1>

              <Card>
                <CardContent className="p-8 prose prose-slate max-w-none">
                  <section className="mb-8">
                    <h2 className="font-serif text-2xl font-bold mb-4">1. Общие положения</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Настоящая Политика конфиденциальности персональных данных действует в отношении всей информации,
                      которую ООО "АбсолютПрофРемонт" может получить о пользователе во время использования сайта.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="font-serif text-2xl font-bold mb-4">2. Собираемая информация</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      При заполнении форм на сайте пользователь предоставляет следующую персональную информацию:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                      <li>Фамилия, имя, отчество</li>
                      <li>Контактный телефон</li>
                      <li>Адрес электронной почты</li>
                      <li>Информация о проекте</li>
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h2 className="font-serif text-2xl font-bold mb-4">3. Цели сбора информации</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Персональные данные пользователя используются в целях:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                      <li>Связи с пользователем для консультации</li>
                      <li>Подготовки коммерческого предложения</li>
                      <li>Улучшения качества предоставляемых услуг</li>
                      <li>Информирования о новых услугах и акциях</li>
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h2 className="font-serif text-2xl font-bold mb-4">4. Защита информации</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Компания принимает все необходимые меры для защиты персональных данных пользователя от
                      несанкционированного доступа, изменения, раскрытия или уничтожения.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="font-serif text-2xl font-bold mb-4">5. Права пользователя</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Пользователь имеет право на получение информации, касающейся обработки его персональных данных, а
                      также право требовать уточнения, блокирования или удаления своих персональных данных.
                    </p>
                  </section>

                  <section>
                    <h2 className="font-serif text-2xl font-bold mb-4">6. Контактная информация</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      По всем вопросам, касающимся политики конфиденциальности, обращайтесь:
                    </p>
                    <p className="text-muted-foreground">
                      Email: apr.info@bk.ru
                      <br />
                      Телефон: +7 (905) 094-32-16
                    </p>
                  </section>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
