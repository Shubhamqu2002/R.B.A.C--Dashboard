/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5', // indigo-600
          dark: '#4338CA', // indigo-700
        },
        secondary: {
          DEFAULT: '#8B5CF6', // purple-500
          dark: '#7C3AED', // purple-600
        },
        success: {
          DEFAULT: '#10B981', // green-500
          dark: '#059669', // green-600
        },
        danger: {
          DEFAULT: '#EF4444', // red-500
          dark: '#DC2626', // red-600
        },
        warning: {
          DEFAULT: '#F59E0B', // amber-500
          dark: '#D97706', // amber-600
        },
        info: {
          DEFAULT: '#3B82F6', // blue-500
          dark: '#2563EB', // blue-600
        },
      },
    },
  },
  plugins: [],
}




