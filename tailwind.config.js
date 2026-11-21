// Tailwind CSS configuration
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgb(184,37,37)", // Primary Red
        background: "rgb(247,230,228)" // Background color
      }
    }
  },
  plugins: []
};
