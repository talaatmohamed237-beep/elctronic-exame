const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyARgaNZF8RJLTlen_k2cjWdQY46lcdWIxlfTpnZhXHdSdCh-43v8q0v-GEQeqlEV8D/exec";

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, message: "طريقة الطلب غير مدعومة." });
  try {
    const upstream = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify(req.body || {})
    });
    const text = await upstream.text();
    let result;
    try { result = JSON.parse(text); } catch (_error) { throw new Error("تعذر الاتصال بخدمة حفظ النتائج."); }
    return res.status(result.ok ? 200 : 400).json(result);
  } catch (_error) {
    return res.status(502).json({ ok: false, message: "تعذر الاتصال بخدمة الاختبارات. حاول مرة أخرى بعد قليل." });
  }
};

