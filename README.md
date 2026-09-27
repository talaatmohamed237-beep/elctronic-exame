# elctronic-exame

صفحات اختبارات القدرات الكمية المنشورة على Vercel.

## تسجيل المحاولات

صفحات `index.html` و`quiz2.html` و`quiz4.html` و`quiz5.html` و`quiz6.html` تستخدم ملف `quiz-sync.js` المشترك لإرسال كل محاولة إلى سجل Google Sheets نفسه. يجب إبقاء رابط السكربت في `<head>`، وإرسال بيانات المحاولة من `handleFinish` بعد جمع اسم الطالب والإجابات.

عند إضافة اختبار جديد، انسخ صفحة اختبار موجودة، ثم حدّث `QUIZ_TITLE` و`QUIZ_SUBTITLE` و`QUESTIONS` مع الإبقاء على شاشة اسم الطالب واستدعاء `window.QuizSync.submitAttempt({name, quiz, questions, answers})`. انشر ملف HTML الجديد من خلال GitHub إلى Vercel؛ `quiz-sync.js` يرسل درجاته ومحاولاته إلى سجل المعلم المشترك.

سجل المعلم: https://docs.google.com/spreadsheets/d/1efAu7VwrzfGjTfsGxG1ZRERjJF50cR48fZLcLhFMCy4/edit

اسم الطالب يجمع المحاولات بين الاختبارات المختلفة؛ اطلب من الطلاب استخدام الاسم نفسه في كل مرة. هذا التسجيل يحتفظ بكل محاولة، لكنه لا يثبت هوية الطالب ولا يمنع تعديل بيانات الطلب من المتصفح.

