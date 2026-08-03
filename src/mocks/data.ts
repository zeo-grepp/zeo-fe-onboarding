export interface Problem {
  id: number;
  title: string;
}

export interface ProblemLanguage {
  id: number;
  language: string;
  initialCode: string;
}

export interface ProblemDetail {
  id: number;
  description: string;
  languages: ProblemLanguage[];
}

export const problemList: Problem[] = [
  { id: 1, title: "팰린드롬" },
  { id: 2, title: "자릿수 더하기" },
];

export const problemDetails: ProblemDetail[] = [
  {
    id: 1,
    description:
      "앞에서부터 읽을 때와 뒤에서부터 읽을 때 똑같은 단어를 팰린드롬(palindrome)이라고 합니다. 예를들어서 racecar, 10201은 팰린드롬 입니다.\n두 자연수 n, m이 매개변수로 주어질 때, n 이상 m 이하의 자연수 중 팰린드롬인 숫자의 개수를 return 하도록 solution 함수를 완성해 주세요.\n제한사항 - m은 500,000이하의 자연수이며, n은 m 이하의 자연수입니다.",
    languages: [
      {
        id: 1,
        language: "javascript",
        initialCode:
          "function solution(n, m){\n\tvar answer = 0\n\treturn answer\n}",
      },
      {
        id: 2,
        language: "java",
        initialCode:
          "class Solution {\n\tpublic int solution(int n, int m) {\n\t\tint answer = 0;\n\t\treturn answer;\n\t}\n}",
      },
    ],
  },
  {
    id: 2,
    description:
      "자연수 N이 주어지면, N의 각 자릿수의 합을 구해서 return 하는 solution 함수를 만들어 주세요.\n예를들어 N = 123이면 1 + 2 + 3 = 6을 return 하면 됩니다.\n제한사항 - N의 범위 : 100,000,000 이하의 자연수",
    languages: [
      {
        id: 3,
        language: "javascript",
        initialCode:
          "function solution(n){\n\tvar answer = 0;\n\treturn answer;\n}",
      },
      {
        id: 4,
        language: "c",
        initialCode:
          "#include <stdio.h>\n#include <stdbool.h>\n#include <stdlib.h>\n\nint solution(int n) {\n\tint answer = 0;\n\treturn answer;\n}",
      },
    ],
  },
];

interface JavascriptExecutionCase {
  languageId: number;
  args: number[];
  expected: number;
}

export const javascriptExecutionCases: JavascriptExecutionCase[] = [
  { languageId: 1, args: [1, 100], expected: 18 },
  { languageId: 3, args: [123], expected: 6 },
];
