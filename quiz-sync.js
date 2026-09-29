(function () {
  const sessionKey = "quiz_name_only_session_v1";
  function normalizeName(value) { return String(value || "").normalize("NFKC").trim().replace(/\s+/g, " "); }
  function sessionFor(name) {
    try {
      const saved = JSON.parse(localStorage.getItem(sessionKey) || "null");
      return saved && saved.name === normalizeName(name) && saved.token ? saved : null;
    } catch (_error) { return null; }
  }
  async function submitAttempt({ name, quiz, questions, answers }) {
    const cleanName = normalizeName(name);
    const saved = sessionFor(cleanName);
    const response = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({ action: "submitByName", name: cleanName, quiz, questions, answers, token: saved && saved.token })
    });
    let result;
    try { result = await response.json(); } catch (_error) { throw new Error("تعذر قراءة رد الخادم."); }
    if (!response.ok || !result.ok) throw new Error(result.message || "تعذر حفظ المحاولة.");
    if (result.token) {
      try { localStorage.setItem(sessionKey, JSON.stringify({name:cleanName, token:result.token})); } catch (_error) {}
    }
    return result;
  }
  window.QuizSync = { submitAttempt };
})();
