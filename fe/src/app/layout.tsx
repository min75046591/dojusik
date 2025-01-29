// 모든페이지에서 공통레이아웃 ex. 헤더, 푸터 정의하는 컴포넌트 
// layout tsx는 디렉토리의 모든 페이지 wrapping 하는 구조
// 즉 page.tsx의 부모 컴포넌트에 해당 

// 동작:: layout은 동일한 디렉토리 또는 하위 디렉토리의 tsx page를  "자동으로 " 렌더링
// 반면 다른 디렉토리의 컴포넌트는 직접 호출해주어야함

// 라우팅 url은 app 의 하위 폴더 이름으로 매핑되며, 최하단 tsx이름은 무조건 page.tsx여야함 

import '../styles/globals.css';
import React,{} from 'react';

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
          <h1>두주식</h1>
        </header>
        <main>{children}</main>
        <footer>
          <p>Footer</p>
        </footer>
      </body>
    </html>
  );
}
