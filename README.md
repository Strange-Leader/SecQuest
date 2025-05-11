# SecQuest - Mobile Security CTF

A collection of mobile security challenges designed to teach various aspects of mobile application security through hands-on practice.

## Challenges Overview

### Challenge 1: Basic Authentication Bypass
- **Goal**: Bypass basic authentication
- **Learning**: Client-side security, hardcoded credentials
- **Solution**: Find hardcoded credentials in the code
- **Flag**: `CTF{BASIC_AUTH_BYPASS_123}`

### Challenge 2: Token Manipulation
- **Goal**: Bypass admin access control
- **Learning**: Token-based authentication, client-side validation
- **Solution**: Modify the token from `user-token` to `admin-token`
- **Flag**: `CTF{ADMIN_ACCESS_GRANTED}`

### Challenge 3: Log Injection
- **Goal**: Inject malicious log entries
- **Learning**: Input validation, log injection
- **Solution**: Use newline characters to bypass validation
- **Flag**: `CTF{LOG_INJECTION_SUCCESS}`

### Challenge 4: 2FA Bypass
- **Goal**: Bypass two-factor authentication
- **Learning**: 2FA security, backup codes
- **Solution**: Use backup codes or bypass token validation
- **Flag**: `CTF{2FA_BYPASS_SUCCESS}`

### Challenge 5: TLS Bypass
- **Goal**: Bypass TLS security
- **Learning**: SSL/TLS security, certificate validation
- **Solution**: Intercept and modify traffic
- **Flag**: `CTF{TLS_BYPASS_SUCCESS}`

### Challenge 6: License Bypass
- **Goal**: Bypass license validation
- **Learning**: Client-side validation, encryption
- **Solution**: Use hardcoded key "CHANGEME"
- **Flag**: `CTF{LICENSE_BYPASS_SUCCESS}`

### Challenge 7: AI Model Security
- **Goal**: Bypass AI model access control
- **Learning**: AI security, access control
- **Solution**: Modify access headers
- **Flag**: `CTF{AI_MODEL_BYPASS_SUCCESS}`

### Challenge 8: Local Storage Exploit
- **Goal**: Extract data from local storage
- **Learning**: Local storage security, encryption
- **Solution**: Use weak encryption key
- **Flag**: `CTF{LOCAL_STORAGE_EXPLOIT_SUCCESS}`

### Challenge 9: Crypto Implementation
- **Goal**: Break weak encryption
- **Learning**: Cryptography, encryption flaws
- **Solution**: Exploit ECB mode and static IV
- **Flag**: `CTF{CRYPTO_IMPLEMENTATION_FLAWS}`

## Detailed Walkthrough
For detailed step-by-step solutions and explanations for each challenge, please refer to the `CTF Challenge Walkthrough.txt` file in the project root directory.

## Setup Instructions

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
