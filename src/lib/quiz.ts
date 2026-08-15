import { formatBirth } from "@/lib/numerology";

export type QuizAnswers = Record<string, string>;

export type FieldType = "text" | "date" | "textarea" | "radio";

export interface FieldOption {
  id: string;
  label: string;
  /** Points this option adds to each result type. */
  score?: Record<string, number>;
}

export interface QuizField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  help?: string;
  required: boolean;
  /** Lay the radio buttons out in two columns. */
  columns?: number;
  /** Include this answer in the short summary shown on /result. */
  summary?: boolean;
  options?: FieldOption[];
}

export const FIELDS: QuizField[] = [
  {
    "id": "name",
    "type": "text",
    "label": "Как вас зовут",
    "placeholder": "Имя",
    "required": true,
    "summary": true
  },
  {
    "id": "birth",
    "type": "date",
    "label": "Дата рождения",
    "help": "Нужна для расчёта числа судьбы и дополнительного слоя разбора.",
    "required": true,
    "summary": true
  },
  {
    "id": "gender",
    "type": "radio",
    "label": "Пол",
    "required": true,
    "columns": 2,
    "options": [
      {
        "id": "female",
        "label": "Женский",
        "score": {
          "impostor": 1
        }
      },
      {
        "id": "male",
        "label": "Мужской",
        "score": {
          "proof": 1
        }
      }
    ]
  },
  {
    "id": "q1",
    "type": "radio",
    "label": "1. Что происходит, когда вам предлагают задачу на вырост?",
    "required": true,
    "options": [
      {
        "id": "a",
        "label": "Соглашаюсь, но потом доказываю, что достойна",
        "score": {
          "proof": 3
        }
      },
      {
        "id": "b",
        "label": "Сразу вижу, как всё пойдёт не так",
        "score": {
          "catastrophe": 3
        }
      },
      {
        "id": "c",
        "label": "Думаю, что меня переоценили",
        "score": {
          "impostor": 3
        }
      },
      {
        "id": "d",
        "label": "Жду, чтобы кто-то подтвердил, что мне можно",
        "score": {
          "permission": 3
        }
      }
    ]
  },
  {
    "id": "q2",
    "type": "radio",
    "label": "2. Чем вы объясняете свои успехи?",
    "required": true,
    "options": [
      {
        "id": "a",
        "label": "Тем, что очень много работала",
        "score": {
          "proof": 2
        }
      },
      {
        "id": "b",
        "label": "Тем, что в этот раз повезло",
        "score": {
          "impostor": 3
        }
      },
      {
        "id": "c",
        "label": "Тем, что рядом были нужные люди",
        "score": {
          "permission": 2
        }
      },
      {
        "id": "d",
        "label": "Успехами это назвать сложно",
        "score": {
          "defeat": 3
        }
      }
    ]
  },
  {
    "id": "q3",
    "type": "radio",
    "label": "3. Что вы чувствуете перед важным делом?",
    "required": true,
    "options": [
      {
        "id": "a",
        "label": "Обязанность выступить безупречно",
        "score": {
          "proof": 3
        }
      },
      {
        "id": "b",
        "label": "Прокручиваю худшие сценарии",
        "score": {
          "catastrophe": 3
        }
      },
      {
        "id": "c",
        "label": "Страх, что сейчас всё поймут про меня",
        "score": {
          "impostor": 3
        }
      },
      {
        "id": "d",
        "label": "Заранее уверена, что не выйдет",
        "score": {
          "defeat": 3
        }
      }
    ]
  },
  {
    "id": "q4",
    "type": "radio",
    "label": "4. Как вы принимаете решение начать что-то новое?",
    "required": true,
    "options": [
      {
        "id": "a",
        "label": "Долго готовлюсь, чтобы не опозориться",
        "score": {
          "proof": 2,
          "catastrophe": 1
        }
      },
      {
        "id": "b",
        "label": "Считаю риски и обычно отказываюсь",
        "score": {
          "catastrophe": 3
        }
      },
      {
        "id": "c",
        "label": "Жду, пока кто-то скажет, что я справлюсь",
        "score": {
          "permission": 3
        }
      },
      {
        "id": "d",
        "label": "Вспоминаю прошлые провалы и не начинаю",
        "score": {
          "defeat": 3
        }
      }
    ]
  },
  {
    "id": "q5",
    "type": "radio",
    "label": "5. Какая фраза звучит в голове чаще всего?",
    "required": true,
    "options": [
      {
        "id": "a",
        "label": "«Надо ещё лучше»",
        "score": {
          "proof": 3
        }
      },
      {
        "id": "b",
        "label": "«А вдруг не получится»",
        "score": {
          "catastrophe": 3
        }
      },
      {
        "id": "c",
        "label": "«Скоро поймут, что я не тяну»",
        "score": {
          "impostor": 3
        }
      },
      {
        "id": "d",
        "label": "«У меня всё равно не выйдет»",
        "score": {
          "defeat": 3
        }
      }
    ]
  }
];

/** Radio fields start unselected on purpose — the answer has to be a real one. */
export const DEFAULTS: QuizAnswers = {};

const BY_ID = new Map(FIELDS.map((field) => [field.id, field]));

export function labelFor(fieldId: string, value: string): string {
  const field = BY_ID.get(fieldId);
  if (!field) return value;
  if (field.type === "date") return formatBirth(value);
  if (field.type !== "radio") return value;
  return field.options?.find((option) => option.id === value)?.label ?? value;
}

/** Returns the first problem found, or null when the form is ready to submit. */
export function validate(answers: QuizAnswers): string | null {
  for (const field of FIELDS) {
    if (!field.required) continue;
    const value = (answers[field.id] ?? "").trim();
    if (!value) {
      return field.type === "radio"
        ? `Выберите вариант: ${field.label}`
        : `Заполните поле: ${field.label}`;
    }
    if (field.type === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return "Укажите дату рождения полностью";
    }
  }
  return null;
}

/** Sums the per-option weights into a score for each result type. */
export function scoreAnswers(answers: QuizAnswers): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const field of FIELDS) {
    if (field.type !== "radio") continue;
    const chosen = field.options?.find((option) => option.id === answers[field.id]);
    if (!chosen?.score) continue;
    for (const [type, points] of Object.entries(chosen.score)) {
      totals[type] = (totals[type] ?? 0) + points;
    }
  }
  return totals;
}

/** Every answered field, written out for the PDF. */
export function describeAnswers(answers: QuizAnswers): string[] {
  const lines: string[] = [];
  for (const field of FIELDS) {
    const value = (answers[field.id] ?? "").trim();
    if (!value) continue;
    lines.push(`${field.label}: ${labelFor(field.id, value)}`);
  }
  return lines;
}

/** The one-line version shown under the free teaser on /result. */
export function summaryAnswers(answers: QuizAnswers): string[] {
  const lines: string[] = [];
  for (const field of FIELDS) {
    if (!field.summary) continue;
    const value = (answers[field.id] ?? "").trim();
    if (!value) continue;
    lines.push(labelFor(field.id, value));
  }
  return lines;
}
