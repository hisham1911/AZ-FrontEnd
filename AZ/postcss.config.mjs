/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          // تقليل حجم CSS بشكل كبير
          minifyFontValues: true,
          minifySelectors: true,
          colormin: true,
        }],
      },
    } : {}),
  },
};

export default config;
