(function () {
  const sessionKey = "quiz_student_session_v1";

  async function request(payload) {
    const response = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    let result;
    try { result = await response.json(); } catch (_error) { throw new Error("تعذر قراءة رد الخادم."); }
    if (!response.ok || !result.ok) throw new Error(result.message || "تعذر تنفيذ الطلب.");
    return result;
  }

  function saveSession(session) {
    localStorage.setItem(sessionKey, JSON.stringify(session));
  }

  function getSession() {
    try { return JSON.parse(localStorage.getItem(sessionKey) || "null"); } catch (_error) { return null; }
  }

  async function authenticate({ mode, displayName, username, password }) {
    const result = await request({ action: mode, displayName, username, password });
    const session = { token: result.token, displayName: result.displayName, username: result.username };
    saveSession(session);
    return session;
  }

  async function resumeSession() {
    const session = getSession();
    if (!session || !session.token) return null;
    try {
      const result = await request({ action: "resume", token: session.token });
      const updated = { token: session.token, displayName: result.displayName, username: result.username };
      saveSession(updated);
      return updated;
    } catch (_error) {
      localStorage.removeItem(sessionKey);
      return null;
    }
  }

  function signOut() { localStorage.removeItem(sessionKey); }

  async function submitAttempt({ quiz, questions, answers }) {
    const session = getSession();
    if (!session || !session.token) throw new Error("انتهت جلسة الدخول. سجّل الدخول مرة أخرى ثم أعد تسليم الاختبار.");
    return request({ action: "submit", token: session.token, quiz, questions, answers });
  }

  window.QuizSync = { authenticate, resumeSession, signOut, submitAttempt };
})();

