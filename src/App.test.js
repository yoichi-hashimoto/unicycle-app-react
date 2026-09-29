import {
  beginnerSteps,
  readBeginnerProgress,
  saveBeginnerProgress,
} from "./features/beginner/beginnerProgress";

beforeEach(() => localStorage.clear());

test("初心者コースは卵からひよこまで6段階ある", () => {
  expect(beginnerSteps).toHaveLength(6);
  expect(beginnerSteps[0].image).toContain("stage-01-egg.webp");
  expect(beginnerSteps[5].image).toContain("stand_chick");
});

test("未ログインの進捗を端末に保存できる", () => {
  saveBeginnerProgress(4);
  expect(readBeginnerProgress()).toEqual({ enabled: true, step: 4 });
});
