module.exports = {
    useFileSystemPublicRoutes: false,
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    bg_light: "#eef2ff",
                    super_light: "#e0e7ff",
                    extra_light: "#c7d2fe",
                    semi_light: "#a5b4fc",
                    light: "#818cf8",
                    DEFAULT: "#6366f1",
                    dark: "#4f46e5",
                    semi_dark: "#4338ca",
                    extra_dark: "#3730a3",
                    super_dark: "#312e81",
                },
            },
            minHeight: {
                fullView: "88vh",
            },

            screens: {
                xs: "300px",
            },
        },
    },
    plugins: [require("@tailwindcss/forms")],
};
