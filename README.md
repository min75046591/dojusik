# dojusik
모의투자 웹 서비스 
```
SpringBoot 3x
Next.js 15
typescript
tailwind.css  
```
```
** 기본 작업 순서 **
0. 작업할 fe 또는 be 브랜치를 pull 받는다. 
1. 해당 브랜치에서 로컬 브랜치를 생성한다
    ex. feature/login 
2. 로컬 브랜치에서 작업 완료 후 fe 또는 be 브랜치에 merge 

* 배포시 develop 브랜치에 fe와 be를 push 한다. 
```

1. 브랜치 컨벤션

:white_check_mark: master[배포 브랜치] 
- 배포 중인 버전 관리 브랜치

:white_check_mark: develop[기본 개발 브랜치] 
- 현재 개발 중인 브랜치 
- 기능 개발시 ```develop``` 에서 생성 후 ```develop``` 으로 병합 

    - FE [프론트엔드 브랜치]
    - BE [백엔드 브랜치]

:white_check_mark: release[테스트 브랜치]
- 개발 내용 테스트 브랜치 
- ```develop```에서 생성, 테스트 완료 후 master로 병합
- develop 에서 생성 후 develop 으로 병합 

:white_check_mark: hotfix
- 전역에서 긴급 오류 해결할 필요 있을 경우 ```master```에서 생성  

<br>



2. 커밋 컨벤션

:white_check_mark: 메시지 50글자 이내

:white_check_mark: 마침표, 특수기호 사용하지 않기

:white_check_mark: **하나의 커밋에 변경사항 1개**
    
- feat : 새로운 기능 추가
- fix : 버그 수정
- docs: 문서 수정
- style: 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
- refactor: 코드 리팩토링
- test: 테스트 코드, 리팩토링 테스트 코드 추가
- chore: 빌드 업무 수정, 패키지 매니저 수정, production code와 무관한 부분들 (.gitignore, build.gradle 같은)
- comment: 주석 추가 및 변경
- remove: 파일, 폴더 삭제
- rename: 파일, 폴더명 수정

   -------
