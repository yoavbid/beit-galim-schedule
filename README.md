# פסטיבל בית גלים ה-15 - לוח אירועים

אתר אינטרנט להצגת לוח אירועי פסטיבל בית גלים השנתי.

## תכונות

- 🎨 עיצוב חגיגי ויפהפה
- 🔍 סינון אירועים לפי קטגוריה
- 📅 הוספת אירועים ליומן Google בקליק אחד
- 📱 מותאם לכל המכשירים (מובייל, טאבלט, מחשב)
- 🌊 אנימציות חלקות ועיצוב מודרני

## שימוש

פשוט פתח את הקובץ `index.html` בדפדפן!

או הרץ שרת מקומי:
```bash
# אופציה 1: Python
python3 -m http.server 8000

# אופציה 2: npx
npx serve
```

ואז פתח בדפדפן: `http://localhost:8000`

## מבנה הקבצים

- `index.html` - מבנה העמוד
- `style.css` - עיצוב וסגנון
- `script.js` - לוגיקה ופונקציונליות
- `schedule.json` - נתוני האירועים

## עדכון לוח האירועים

ערוך את הקובץ `schedule.json` להוספת/עדכון אירועים. הקובץ כולל:

```json
{
  "festival": {
    "name": "שם הפסטיבל",
    "location": "מיקום",
    "timezone": "Asia/Jerusalem",
    "dates": ["2025-10-09", "2025-10-10", "2025-10-11"]
  },
  "events": [
    {
      "date": "2025-10-09",
      "start": "10:00",
      "end": "11:00",
      "title": "שם האירוע",
      "category": "music",
      "venue": "מקום",
      "address": "כתובת"
    }
  ]
}
```

## קטגוריות זמינות

- music - מוזיקה
- tour - סיורים
- workshop - סדנאות
- theatre - תיאטרון
- lecture - הרצאות
- wellness - בריאות
- kids_family - ילדים ומשפחה
- dj - DJ
- sports - ספורט
- street_art - אמנות רחוב
- community - קהילה
- museum_tour - מוזיאון
- street_show - תיאטרון רחוב
- exhibition - תערוכה
- parade_music - תהלוכה מוזיקלית
- open_houses - בתים פתוחים

