# Welcome to your Expo app 👋

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

## Fridgy account screens

The app opens on **Войти** for guests. From there users can create an account
or request a password reset. After sign-in, use **Профиль → Выйти из аккаунта**
to sign out.

- Start the API using [the server setup](../server/README.md). In `client/`, run
  `npm ci` and `npm run ios:native` for an iOS simulator build.
- The iOS simulator uses `http://localhost:3000`. Android Emulator uses
  `http://10.0.2.2:3000`. On a physical device, put
  `EXPO_PUBLIC_API_URL=http://<computer-LAN-IP>:3000` in `client/.env.local`,
  connect the device to the same network, and restart Expo. Use HTTPS outside
  local development.
- For native password reset links, set `FRONTEND_URL=client://` on the server
  and open the link on a device with the installed native app. For Expo web,
  set `FRONTEND_URL` to the actual web origin, for example
  `http://localhost:8081`. Both variants require working SMTP.
- On iOS and Android the access token is stored in Expo SecureStore. The app
  validates it through `GET /auth/me` on launch and on returning to the
  foreground, and every 30 seconds while active. A temporary API failure at
  launch keeps the token and offers a retry. Token expiry and a rejection from
  the API both end the session.
- Signing out deletes the device token immediately and requests server
  revocation when the API is reachable. Access tokens expire after 15 minutes.
  Sign in again after expiry. Web sessions are kept in memory until reload.
- Google, Apple and email verification are unavailable in the current API.
  Password reset uses an emailed link with a token.

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
