# Setup Guide for Gemini API

## Quick Setup

1. **Get your Gemini API Key**
   - Visit: https://aistudio.google.com/app/apikey
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy your API key

2. **Create `.env` file**
   - In the `health-app` directory, create a file named `.env`
   - Add the following line:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
   - Replace `your_api_key_here` with your actual API key

3. **Restart the development server**
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` again

## Troubleshooting

### "API key not configured" error
- Make sure the `.env` file is in the `health-app` directory (not the root)
- Make sure the variable name is exactly `VITE_GEMINI_API_KEY`
- Restart the dev server after creating/modifying `.env`

### API errors
- Check your API key is valid
- Verify you haven't exceeded quota limits
- Check browser console for detailed error messages

### Still not working?
- Open browser developer tools (F12)
- Check the Console tab for error messages
- Look for messages starting with "API Key:" or "Gemini API Error:"

