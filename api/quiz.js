const crypto = require("crypto");
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyARgaNZF8RJLTlen_k2cjWdQY46lcdWIxlfTpnZhXHdSdCh-43v8q0v-GEQeqlEV8D/exec";
function normalizeName(value) { return String(value || "").normalize("NFKC").trim().replace(/\s+/g, " "); }
async function callScript(payload) {
  const upstream = await fetch(SCRIPT_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=UTF-8" }, body: JSON.stringify(payload) });
  const text = await upstream.text();
  try { return JSON.parse(text); } catch (_error) { throw new Error("تعذر الاتصال بخدمة حفظ النتائج."); }
}
async function loginByName(name) {
  const key = crypto.createHash("sha256").update(name).digest("hex");
  const username = "n" + key.slice(0, 29);
  const password = crypto.createHash("sha256").update("quiz-name-only:" + name).digest("hex");
  let auth = await callScript({ action: "register", displayName: name, username, password });
  if (!auth.ok) auth = await callScript({ action: "login", username, password });
  return auth;
}
module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, message: "طريقة الطلب غير مدعومة." });
  const payload = req.body || {};
  try {
    if (payload.action === "submitByName") {
      const name = normalizeName(payload.name);
      if (name.length < 2 || name.length > 80) return res.status(400).json({ ok: false, message: "اكتب اسمك كاملًا من حرفين إلى 80 حرفًا." });
      let token = String(payload.token || "");
      if (token) {
        const prior = await callScript({ action: "submit", token, quiz: payload.quiz, questions: payload.questions, answers: payload.answers });
        if (prior.ok) return res.status(200).json({...prior, token});
        if (!String(prior.message || "").includes("انتهت الجلسة") && !String(prior.message || "").includes("الحساب غير موجود")) return res.status(400).json(prior);
      }
      const auth = await loginByName(name);
      if (!auth.ok || !auth.token) return res.status(400).json({ ok: false, message: auth.message || "تعذر تجهيز سجل الاسم." });
      token = auth.token;
      const result = await callScript({ action: "submit", token, quiz: payload.quiz, questions: payload.questions, answers: payload.answers });
      return res.status(result.ok ? 200 : 400).json(result.ok ? {...result, token} : result);
    }
    const result = await callScript(payload);
    return res.status(result.ok ? 200 : 400).json(result);
  } catch (_error) {
    return res.status(502).json({ ok: false, message: "تعذر الاتصال بخدمة الاختبارات. حاول مرة أخرى بعد قليل." });
  }
};
