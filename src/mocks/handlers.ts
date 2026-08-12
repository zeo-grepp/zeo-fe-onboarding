import { http, HttpResponse } from "msw";
import { javascriptExecutionCases, problemDetails, problemList } from "./data";

export interface SubmitParams {
  problemId: number;
  languageId: number;
  code: string;
}

const runJavascriptSolution = (code: string, args: number[]): number => {
  const createSolution = new Function(`${code}\nreturn solution;`);
  const solution = createSolution();

  return solution(...args);
};

export const handlers = [
  http.get("/lists", () => {
    return HttpResponse.json(problemList);
  }),

  http.get("/details/:id", ({ params }) => {
    const id = Number(params.id);
    const detail = problemDetails.find((problem) => problem.id === id);

    if (!detail) {
      return HttpResponse.json(
        { message: "존재하지 않는 문제입니다" },
        { status: 404 },
      );
    }

    return HttpResponse.json(detail);
  }),

  http.post("/submit", async ({ request }) => {
    const { languageId, code } = (await request.json()) as SubmitParams;

    const executionCase = javascriptExecutionCases.find(
      (testCase) => testCase.languageId === languageId,
    );

    if (!executionCase) {
      return HttpResponse.json({ msg: "제출 완료되었습니다." });
    }

    try {
      const result = runJavascriptSolution(code, executionCase.args);

      if (result === executionCase.expected) {
        return HttpResponse.json({ msg: "성공하였습니다." });
      }

      return HttpResponse.json({
        msg: `실행한 값 ${result}은(는) 기댓값 ${executionCase.expected}와(과) 다릅니다.`,
      });
    } catch {
      return HttpResponse.json({ msg: "오류가 발생했습니다." });
    }
  }),
];
