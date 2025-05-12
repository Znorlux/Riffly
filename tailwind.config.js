module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#FFD500",
          600: "#F5C400",
          700: "#E0AE00",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        heading: ["Nohemi-Bold", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
