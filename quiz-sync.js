(function () {
  const endpoint = "https://script.google.com/macros/s/AKfycbzqH5QKFC43b7KNHFvdNr_Fgm6LzQGqEjbIQDay6lJQEkKAIgz_T27y34bABo99tIg/exec";
  const teacherSheet = "https://docs.google.com/spreadsheets/d/1efAu7VwrzfGjTfsGxG1ZRERjJF50cR48fZLcLhFMCy4/edit";
  function submitAttempt({ name, quiz, questions, answers }) {
    const safeQuestions = Array.isArray(questions) ? questions : [];
    const safeAnswers = answers || {};
    const answered = safeQuestions.reduce((count, _q, i) =>
      count + (safeAnswers[i] === undefined || safeAnswers[i] === null ? 0 : 1), 0);
    const correct = safeQuestions.reduce((count, q, i) =>
      count + (safeAnswers[i] === q.correctIndex ? 1 : 0), 0);
    const unanswered = safeQuestions.length - answered;
    const wrong = answered - correct;
    const record = {
      name: String(name || "").trim().replace(/\s+/g, " "),
      quiz: String(quiz || "اختبار"),
      date: new Date().toISOString(),
      score: safeQuestions.length ? Math.round(correct * 100 / safeQuestions.length) : 0,
      correct,
      wrong,
      unanswered,
      questions: safeQuestions,
      answers: safeAnswers
    };
    try {
      fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify(record),
        keepalive: true
      });
    } catch (_error) {}
  }
  window.QuizSync = { submitAttempt, teacherSheet };
})();

