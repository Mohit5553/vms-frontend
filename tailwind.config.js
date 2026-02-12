// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // This line is important for scanning Tailwind classes in your code
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
