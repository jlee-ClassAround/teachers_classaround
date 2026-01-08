// prettier.config.js
module.exports = {
  // 1. 기본 스타일 설정
  semi: true,            // 문장 끝에 세미콜론 추가
  singleQuote: true,     // 홑따옴표 사용
  tabWidth: 2,           // 들여쓰기 2칸
  trailingComma: 'all',  // 배열/객체 마지막 요소 뒤에 콤마 추가
  printWidth: 100,       // 한 줄 최대 길이 (너무 짧으면 가독성이 떨어짐)
  arrowParens: 'always', // 화살표 함수 인자 시 괄호 필수

  // 2. 테일윈드 플러그인 설정
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindConfig: './tailwind.config.ts', // 테일윈드 설정 파일 경로 명시 (권장)
};