# ShopBuddy Chrome Extension

쇼핑 도우미 크롬 확장 프로그램입니다. 이 확장 프로그램은 사용자의 쇼핑 경험을 향상시키기 위한 다양한 기능을 제공합니다.

## 주요 기능

- 상품 정보 자동 추출
- 상품 가격 추적
- 쇼핑 히스토리 관리
- 실시간 상품 모니터링

## 기술 스택

- TypeScript
- Chrome Extension API
- Webpack
- TailwindCSS

## 개발 환경 설정

1. 저장소 클론
```bash
git clone https://github.com/allmybestdev/shopbuddy-extensions.git
cd shopbuddy-extensions
```

2. 의존성 설치
```bash
npm install
```

3. 개발 모드 실행
```bash
npm run watch
```

4. 빌드
```bash
npm run build
```

## 크롬 확장 프로그램 설치 방법

1. Chrome 브라우저에서 `chrome://extensions` 페이지를 엽니다.
2. 개발자 모드를 활성화합니다.
3. "압축해제된 확장 프로그램을 로드합니다" 버튼을 클릭합니다.
4. 빌드된 `dist` 디렉토리를 선택합니다.

## 라이선스

ISC