import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Play, Trophy, Keyboard, Timer, Target } from "lucide-react";

const WORD_SETS = {
  easy: [
    { word: "가", hint: "ga" },
    { word: "나", hint: "na" },
    { word: "다", hint: "da" },
    { word: "라", hint: "ra" },
    { word: "마", hint: "ma" },
    { word: "바", hint: "ba" },
    { word: "사", hint: "sa" },
    { word: "아", hint: "a" },
    { word: "자", hint: "ja" },
    { word: "차", hint: "cha" },
    { word: "카", hint: "ka" },
    { word: "타", hint: "ta" },
    { word: "파", hint: "pa" },
    { word: "하", hint: "ha" },
  ],
  normal: [
    { word: "학교", hint: "school" },
    { word: "한국", hint: "Korea" },
    { word: "사과", hint: "apple" },
    { word: "바다", hint: "sea" },
    { word: "친구", hint: "friend" },
    { word: "가방", hint: "bag" },
    { word: "연필", hint: "pencil" },
    { word: "학생", hint: "student" },
    { word: "선생님", hint: "teacher" },
    { word: "의자", hint: "chair" },
    { word: "책상", hint: "desk" },
    { word: "우유", hint: "milk" },
    { word: "물", hint: "water" },
    { word: "커피", hint: "coffee" },
    { word: "시장", hint: "market" },
    { word: "집", hint: "house" },
    { word: "회사", hint: "company" },
    { word: "전화", hint: "phone" },
    { word: "자동차", hint: "car" },
    { word: "버스", hint: "bus" },
    { word: "지하철", hint: "subway" },
    { word: "오늘", hint: "today" },
    { word: "내일", hint: "tomorrow" },
    { word: "시간", hint: "time" },
    { word: "이름", hint: "name" },
    { word: "나라", hint: "country" },
    { word: "공부", hint: "study" },
    { word: "운동", hint: "exercise" },
    { word: "음식", hint: "food" },
    { word: "노래", hint: "song" },
  ],
  hard: [
    { word: "안녕하세요", hint: "hello" },
    { word: "감사합니다", hint: "thank you" },
    { word: "미안합니다", hint: "sorry" },
    { word: "반갑습니다", hint: "nice to meet you" },
    { word: "괜찮습니다", hint: "it's okay" },
    { word: "모르겠습니다", hint: "I don't know" },
    { word: "알겠습니다", hint: "I understand" },
    { word: "좋습니다", hint: "good" },
    { word: "싫습니다", hint: "dislike" },
    { word: "좋아합니다", hint: "like" },
    { word: "공부합니다", hint: "study" },
    { word: "운동합니다", hint: "exercise" },
    { word: "일합니다", hint: "work" },
    { word: "갑니다", hint: "go" },
    { word: "옵니다", hint: "come" },
    { word: "먹어요", hint: "eat" },
    { word: "마셔요", hint: "drink" },
    { word: "봐요", hint: "see/watch" },
    { word: "들어요", hint: "listen" },
    { word: "읽어요", hint: "read" },
    { word: "써요", hint: "write" },
    { word: "배워요", hint: "learn" },
    { word: "가르쳐요", hint: "teach" },
    { word: "만나요", hint: "meet" },
    { word: "전화해요", hint: "call" },
    { word: "준비해요", hint: "prepare" },
    { word: "연습해요", hint: "practice" },
    { word: "시작해요", hint: "start" },
    { word: "끝나요", hint: "finish" },
    { word: "기다려요", hint: "wait" },
  ],
};

const LEVEL_META = {
  easy: { label: "초급", time: 60 },
  normal: { label: "중급", time: 75 },
  hard: { label: "도전", time: 90 },
};

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getAccuracy(correct, wrong) {
  const total = correct + wrong;
  return total === 0 ? 100 : Math.round((correct / total) * 100);
}

function getRank(score) {
  if (score >= 120) return "S";
  if (score >= 90) return "A";
  if (score >= 60) return "B";
  if (score >= 30) return "C";
  return "D";
}

export default function HangulTypingGame() {
  const [level, setLevel] = useState("easy");
  const [gameWords, setGameWords] = useState(shuffle(WORD_SETS.easy));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(LEVEL_META.easy.time);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const inputRef = useRef(null);

  const current = gameWords[currentIndex] || { word: "", hint: "" };

  const progress = useMemo(() => {
    if (gameWords.length === 0) return 0;
    return (currentIndex / gameWords.length) * 100;
  }, [currentIndex, gameWords.length]);

  const accuracy = useMemo(
    () => getAccuracy(correctCount, wrongCount),
    [correctCount, wrongCount]
  );

  const rank = useMemo(() => getRank(score), [score]);

  const resetGame = (newLevel = level) => {
    const words = shuffle(WORD_SETS[newLevel]);
    setLevel(newLevel);
    setGameWords(words);
    setCurrentIndex(0);
    setInput("");
    setTimeLeft(LEVEL_META[newLevel].time);
    setIsPlaying(false);
    setIsFinished(false);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setStreak(0);
    setBestStreak(0);
  };

  const startGame = () => {
    setIsPlaying(true);
    setIsFinished(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  useEffect(() => {
    resetGame("easy");
  }, []);

  useEffect(() => {
    if (!isPlaying || isFinished) return;

    if (timeLeft <= 0) {
      setIsPlaying(false);
      setIsFinished(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, isFinished]);

  useEffect(() => {
    if (currentIndex >= gameWords.length && gameWords.length > 0) {
      setGameWords((prev) => [...prev, ...shuffle(WORD_SETS[level])]);
    }
  }, [currentIndex, gameWords.length, level]);

  const submitWord = () => {
    if (!input.trim() || !isPlaying || isFinished) return;

    const clean = input.trim();

    if (clean === current.word) {
      const nextStreak = streak + 1;
      const gained = 10 + Math.min(streak, 10);

      setScore((s) => s + gained);
      setCorrectCount((c) => c + 1);
      setStreak(nextStreak);
      setBestStreak((b) => Math.max(b, nextStreak));
      setCurrentIndex((i) => i + 1);
      setInput("");
    } else {
      setWrongCount((w) => w + 1);
      setStreak(0);
      setInput("");
    }

    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") submitWord();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]"
        >
          <Card className="rounded-3xl border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="mb-3 flex items-center gap-3">
                <img
                  src="logo.png"
                  alt="logo"
                  className="h-12 w-12 rounded-xl bg-white p-1 object-contain shadow"
                />
                <div className="text-lg font-semibold">
                  JOY Korean Language Center
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-3xl font-bold tracking-tight">
                    한글 타자 게임
                  </CardTitle>
                  <p className="mt-2 text-sm text-slate-500">
                    미얀마 학생들이 한글 읽기와 타자 연습을 할 수 있는 게임
                  </p>
                </div>

                <div className="flex gap-2">
                  {Object.keys(LEVEL_META).map((key) => (
                    <Button
                      key={key}
                      variant={level === key ? "default" : "outline"}
                      className="rounded-2xl"
                      onClick={() => resetGame(key)}
                    >
                      {LEVEL_META[key].label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-100 p-4">
                  <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
                    <Timer className="h-4 w-4" />
                    남은 시간
                  </div>
                  <div className="text-3xl font-bold">{timeLeft}s</div>
                </div>

                <div className="rounded-2xl bg-slate-100 p-4">
                  <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
                    <Trophy className="h-4 w-4" />
                    점수
                  </div>
                  <div className="text-3xl font-bold">{score}</div>
                </div>

                <div className="rounded-2xl bg-slate-100 p-4">
                  <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
                    <Target className="h-4 w-4" />
                    정확도
                  </div>
                  <div className="text-3xl font-bold">{accuracy}%</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>진행도</span>
                  <span>{correctCount}개 성공</span>
                </div>
                <Progress value={progress} className="h-3 rounded-full" />
              </div>

              <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-sky-100 to-blue-50 p-6 text-center shadow-inner md:p-10">
                <img
                  src="logo.png"
                  alt="watermark"
                  className="pointer-events-none absolute inset-0 m-auto h-40 w-40 select-none object-contain opacity-10"
                />

                <div className="relative z-10">
                  <div className="mb-3 text-sm text-slate-500">
                    아래 단어를 그대로 입력하세요
                  </div>

                  <div className="text-5xl font-black tracking-tight md:text-7xl">
                    {current.word}
                  </div>

                  <Badge
                    variant="secondary"
                    className="mt-4 rounded-full px-4 py-1 text-sm"
                  >
                    힌트: {current.hint}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="여기에 한글을 입력하세요"
                  className="h-14 rounded-2xl border-slate-200 bg-white text-lg"
                  disabled={!isPlaying || isFinished}
                />

                {!isPlaying ? (
                  <Button
                    onClick={startGame}
                    className="h-14 rounded-2xl px-6 text-base"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    시작
                  </Button>
                ) : (
                  <Button
                    onClick={submitWord}
                    className="h-14 rounded-2xl px-6 text-base"
                  >
                    <Keyboard className="mr-2 h-4 w-4" />
                    입력
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => resetGame(level)}
                  className="h-14 rounded-2xl px-6 text-base"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  다시
                </Button>
              </div>

              {isFinished && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-slate-200 bg-white p-6 text-center"
                >
                  <div className="text-sm text-slate-500">게임 종료</div>
                  <div className="mt-2 text-5xl font-black">Rank {rank}</div>
                  <div className="mt-3 text-lg">
                    최종 점수: <span className="font-bold">{score}</span>
                  </div>

                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <Badge className="rounded-full px-4 py-1">
                      정답 {correctCount}
                    </Badge>
                    <Badge
                      className="rounded-full px-4 py-1"
                      variant="secondary"
                    >
                      오답 {wrongCount}
                    </Badge>
                    <Badge className="rounded-full px-4 py-1" variant="outline">
                      최고 연속 {bestStreak}
                    </Badge>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">게임 방법</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
                <p>1. 난이도를 고릅니다.</p>
                <p>2. 시작 버튼을 누릅니다.</p>
                <p>3. 화면에 나온 한글 단어를 그대로 입력합니다.</p>
                <p>4. 엔터 또는 입력 버튼으로 제출합니다.</p>
                <p>5. 많이 맞출수록 점수가 올라갑니다.</p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">실시간 기록</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm text-slate-600">
                <div className="flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3">
                  <span>현재 연속 성공</span>
                  <strong>{streak}</strong>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3">
                  <span>최고 연속 성공</span>
                  <strong>{bestStreak}</strong>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3">
                  <span>현재 난이도</span>
                  <strong>{LEVEL_META[level].label}</strong>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">추천 활용법</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
                <p>• 초급반: 모음/자음 수업 뒤 5분 복습용</p>
                <p>• 학생 자율학습: 집에서 반복 연습</p>
                <p>• 수업 게임: 친구끼리 점수 대결</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
