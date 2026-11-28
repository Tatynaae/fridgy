# Welcome to your Expo app 👋

## Выбор фото из галереи

На экране сканирования кнопка «Загрузить из галереи» открывает Expo ImagePicker
для выбора одного изображения. Выбранное фото появляется в области предпросмотра
и в миниатюре кнопки. Фото пока не отправляется на сервер для распознавания.

Проверка:
1. Установите зависимости командой `npm i` и запустите приложение.
2. После входа откройте сканирование с главной страницы и нажмите «Загрузить из галереи».
3. На телефоне разрешите доступ к фото, выберите изображение и проверьте предпросмотр.
4. Повторите выбор с другим фото, затем откройте галерею и отмените выбор.
   При отмене предыдущее фото должно сохраниться.
5. Проверьте отказ в доступе. При запрете повторного запроса доступна кнопка перехода
   в настройки приложения. При ограниченном доступе на iOS можно выбирать разрешённые фото.
6. Проверьте кнопку «Сделать новое фото» после выбора из галереи.

На Web используется системное окно выбора файла без предварительного запроса разрешений.

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Авторизация

Экраны по макету Figma: `login`, `register`, `forgot-password` (+ «Проверьте почту»), `reset-password` (+ «Пароль обновлён») в `src/app/`, UI-компоненты — `src/components/auth/`. API — `src/api/`, состояние — `src/context/auth-context.tsx`.
`accessToken` хранится в **expo-secure-store** (Keychain / Keystore), см. `src/lib/token-storage.ts`. При запуске токен проверяется через `GET /auth/me`.

Запуск:
1. Бэкенд: `cd server && cp .env.example .env` (задать `DB_PASSWORD` и `SMTP_HOST/SMTP_USER/SMTP_PASSWORD` — без SMTP сервер не стартует), затем `npm install && npm run db:up && npm run start:dev`.
2. Клиент: `cd client && npm install && npx expo install expo-secure-store && npm start`.
3. Адрес API — `EXPO_PUBLIC_API_URL` (по умолчанию `http://localhost:3000`, на Android-эмуляторе `http://10.0.2.2:3000`).
4. Сброс пароля: в `server/.env` поставить `FRONTEND_URL` на адрес клиента (например, `http://localhost:8081` для web), письмо ведёт на `/reset-password?token=...`.
