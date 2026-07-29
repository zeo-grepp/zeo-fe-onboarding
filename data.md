과제에 사용될 api 및 데이터입니다.

## 1. 문제 목록
### api 경로
`/lists`
### 데이터
```
[
  {
    id: 1,
    title: '팰린드롬',
  },
  {
    id: 2,
    title: '자릿수 더하기'
  }
]
```

## 2. 문제 상세
### api 경로
`/details/{id}`  
이때 {id}는 lists의 id값 입니다.  
아래 데이터 항목에서 id별 리턴값을 확인해주세요  
### 데이터
#### id = 1
```
{
  id: 1,
  description: '앞에서부터 읽을 때와 뒤에서부터 읽을 때 똑같은 단어를 팰린드롬(palindrome)이라고 합니다. 예를들어서 racecar, 10201은 팰린드롬 입니다.\n두 자연수 n, m이 매개변수로 주어질 때, n 이상 m 이하의 자연수 중 팰린드롬인 숫자의 개수를 return 하도록 solution 함수를 완성해 주세요.\n제한사항 - m은 500,000이하의 자연수이며, n은 m 이하의 자연수입니다.',
  languages: [
    {
      id: 1,
      language: 'javascript',
      initialCode: 'function solution(n, m){\n\tvar answer = 0\n\treturn answer\n}'
    },
    {
      id: 2,
      language: 'java',
      initialCode: 'class Solution {\n\tpublic int solution(int n, int m) {\n\t\tint answer = 0;\n\t\treturn answer;\n\t}\n}'
    }
  ]
}
```
#### id = 2
```
{
  id: 2,
  description: '자연수 N이 주어지면, N의 각 자릿수의 합을 구해서 return 하는 solution 함수를 만들어 주세요.\n예를들어 N = 123이면 1 + 2 + 3 = 6을 return 하면 됩니다.\n제한사항 - N의 범위 : 100,000,000 이하의 자연수',
  languages: [
    {
      id: 3,
      language: 'javascript',
      initialCode: 'function solution(n){\n\tvar answer = 0;\n\treturn answer;\n}'
    },
    {
      id: 4,
      language: 'c',
      initialCode: '#include <stdio.h>\n#include <stdbool.h>\n#include <stdlib.h>\n\nint solution(int n) {\n\tint answer = 0;\n\treturn answer;\n}'
    }
  ]
}
```

### 3. 문제 제출
### api 경로
`/submit`
### request body
problemId - 문제 id  
languageId - 언어 id  
code - 작성된 코드  
```
{
  problemId: number,
  languageId: number,
  code: string
}
```
### 데이터
languageId가 2, 4일때 (javascript가 아닐때)
```
{
  msg: '제출 완료되었습니다'
}
```
### javascript 코드 실행
#### languageId = 1
parameters  
n = 1, m = 100  
기댓값은 18  
ex)  
```js
// 제출한 코드가 아래와 같을시, arguments에 각각 1, 100을 입력후 코드 실행
// 결과값 101이 기댓값 18과 다르므로 리턴값은
// {
//  msg: '실행한 값 101은(는) 기댓값 18와(과) 다릅니다'
// }
function solution(n, m){
  return n + m;
}
```
#### language = 3
parameters  
n = 123  
기댓값은 6  
ex)  
```js
// 제출한 코드가 아래와 같을시, arguments에 123을 입력후 코드 실행
// 결과값 246이 기댓값 6과 다르므로 리턴값은.
// {
//  msg: '실행한 값 246은(는) 기댓값 6와(과) 다릅니다'
// }
function solution(n){
  return n * 2;
}
```
