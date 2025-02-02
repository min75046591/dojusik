// import './page.module.css'
import '../styles/globals.css'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <title>DoJuSik</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <header>
          {/* <h1>header</h1> */}
        </header>
        <main>{children}</main>
        <footer>
          {/* <p>Footer</p> */}
        </footer>
      </body>
    </html>
  );
}
