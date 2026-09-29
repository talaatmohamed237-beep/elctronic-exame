(function () {
  async function submitAttempt({ name, quiz, questions, answers }) {
    const response = await fetch("/api/quiz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "submitByName", name, quiz, questions, answers }) });
    let result;
    try { result = await response.json(); } catch (_error) { throw new Error("تعذر قراءة رد الخادم."); }
    if (!response.ok || !result.ok) throw new Error(result.message || "تعذر حفظ المحاولة.");
    return result;
  }
  window.QuizSync = { submitAttempt };
})();
