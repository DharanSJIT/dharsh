# Rural Health App

A React + Vite application for rural health assistance with AI-powered chat and voice features.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Gemini API Key

The app requires a Google Gemini API key to function. Follow these steps:

1. Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey) or [MakerSuite](https://makersuite.google.com/app/apikey)

2. Create a `.env` file in the root of the `health-app` directory:

```bash
cd health-app
touch .env
```

3. Add your API key to the `.env` file:

```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

**Important:** Never commit your `.env` file to version control. It should already be in `.gitignore`.

### 3. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in the terminal).

## Features

- **Voice Assistant**: Speak your health concerns and get instant advice
- **Chat Assistant**: Text-based health consultation
- **Multi-language Support**: Hindi, English, Bengali, and Telugu
- **Health Tracking**: Monitor your health metrics
- **Nutrition Planning**: Get personalized nutrition advice
- **Emergency Services**: Quick access to emergency contacts

## Troubleshooting

### Gemini Assistant Not Working

If the Gemini assistant is not responding:

1. **Check API Key**: Ensure `VITE_GEMINI_API_KEY` is set in your `.env` file
2. **Verify API Key**: Make sure your API key is valid and has not expired
3. **Check Console**: Open browser developer tools (F12) and check the console for error messages
4. **API Quota**: Ensure you haven't exceeded your API quota limits
5. **Network**: Check your internet connection

### Common Issues

- **"API key not configured"**: Create a `.env` file with your `VITE_GEMINI_API_KEY`
- **"API Error 400"**: Check if your API key is valid
- **"API Error 429"**: You've exceeded the rate limit, wait a few minutes
- **"Response blocked by safety settings"**: The query triggered safety filters, try rephrasing

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technologies Used

- React 19
- Vite
- Tailwind CSS
- Google Gemini API
- React Router
