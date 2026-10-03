export type StudyKey = "GATE" | "Series Exam" | "DSA" | "SQL" | "other placement" | "other learning";
export type ProjectKey = "Final Year" | "KiCad" | string;
export type EvidenceState = "recorded" | "not-recorded";
export type YesNoState = "yes" | "no" | "not-recorded";
export type OilyAmount = "low" | "medium" | "high";
export type CareerStatus = "Interested" | "Applied" | "OA/Test" | "Interview" | "Final Round" | "Offer" | "Rejected" | "Withdrawn";

export type StudyEntry = { state: EvidenceState; studied: YesNoState; minutes: number; topic: string; description: string };
export type ProjectEntry = { state: EvidenceState; worked: YesNoState; minutes: number; description: string };
export type WorkoutEntry = { state: EvidenceState; completed: YesNoState; duration: number; type: string };
export type MealEntry = { healthy: YesNoState; oily: YesNoState; oilyAmount: OilyAmount | null };
export type ScreenEntry = { state: EvidenceState; minutes: number };
export type PrivateHabit = { state: YesNoState; count: number };
export type DailyRecord = {
  date: string;
  study: Record<StudyKey, StudyEntry>;
  projects: Record<string, ProjectEntry>;
  workout: WorkoutEntry;
  meals: { breakfast: MealEntry; lunch: MealEntry; dinner: MealEntry };
  screen: ScreenEntry;
  privateHabit: PrivateHabit;
  mood: number | null; energy: number | null; motivation: number | null; stress: number | null;
  reflections: { accomplishments: string; improvement: string; learning: string; tomorrowFocus: string };
  achievements: string[];
};

export type DailyTargets = { studyMinutes: number; workoutMinutes: number; screenMinutes: number; healthyMeals: number; projectMinutes: number };
export type Profile = { name: string; timezone: string; gateTarget: number; gateCurrent: number; cgpa: number; careerYear: number; dailyTargets: DailyTargets };
export type MainGoals = { gate: { title: string; target: number }; cgpa: { title: string; target: number }; offer: { title: string; target: number } };
export type HistoryPoint = { date: string; value: number };
export type CareerApplication = { id: string; company: string; role: string; date: string; url: string; status: CareerStatus; notes: string };
export type Scoring = {
  weights: { study: number; project: number; workout: number; meals: number; screen: number; wellbeing: number; reflections: number; achievements: number };
  bonusTargets: { studyMinutes: number; workoutMinutes: number; projectMinutes: number; healthyMeals: number };
  penalties: { oilyMeal: number; screenOverTarget: number; missedReflection: number };
};
export type Settings = { animation: boolean; motivation: boolean; privateEnabled: boolean; privateHidden: boolean; privatePin: string };
export type Store = {
  version: 3; setup: boolean; profile: Profile; goals: MainGoals; gateHistory: HistoryPoint[]; cgpaHistory: HistoryPoint[];
  records: DailyRecord[]; applications: CareerApplication[]; customProjectTypes: string[]; scoring: Scoring; settings: Settings;
};

export const studyKeys: StudyKey[] = ["GATE", "Series Exam", "DSA", "SQL", "other placement", "other learning"];
export const baseProjectKeys = ["Final Year", "KiCad", "custom projects"];
export const mealKeys = ["breakfast", "lunch", "dinner"] as const;
export const reflectionKeys = ["accomplishments", "improvement", "learning", "tomorrowFocus"] as const;
export const careerStatuses: CareerStatus[] = ["Interested", "Applied", "OA/Test", "Interview", "Final Round", "Offer", "Rejected", "Withdrawn"];
export const defaultTargets: DailyTargets = { studyMinutes: 120, workoutMinutes: 30, screenMinutes: 180, healthyMeals: 2, projectMinutes: 30 };
export const defaultScoring: Scoring = {
  weights: { study: 35, project: 18, workout: 10, meals: 12, screen: 8, wellbeing: 8, reflections: 5, achievements: 4 },
  bonusTargets: { studyMinutes: 180, workoutMinutes: 45, projectMinutes: 60, healthyMeals: 3 },
  penalties: { oilyMeal: 3, screenOverTarget: 0.05, missedReflection: 1 }
};
export const defaultStore: Store = {
  version: 3, setup: false,
  profile: { name: "", timezone: "Asia/Kolkata", gateTarget: 750, gateCurrent: 0, cgpa: 0, careerYear: new Date().getFullYear() + 1, dailyTargets: defaultTargets },
  goals: { gate: { title: "GATE 750+", target: 750 }, cgpa: { title: "CGPA 10", target: 10 }, offer: { title: "Offer by 2027", target: 2027 } },
  gateHistory: [], cgpaHistory: [], records: [], applications: [], customProjectTypes: [], scoring: defaultScoring,
  settings: { animation: true, motivation: true, privateEnabled: false, privateHidden: false, privatePin: "" }
};

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;
const str = (v: unknown, fallback = "") => typeof v === "string" ? v.trim() : fallback;
const num = (v: unknown, fallback: number, min = -Infinity, max = Infinity) => {
  const n = typeof v === "number" && Number.isFinite(v) ? v : fallback;
  return Math.max(min, Math.min(max, n));
};
const integer = (v: unknown, fallback: number, min = -Infinity, max = Infinity) => Math.round(num(v, fallback, min, max));
const validDate = (v: unknown, fallback: string) => typeof v === "string" && datePattern.test(v) && !Number.isNaN(Date.parse(`${v}T12:00:00Z`)) ? v : fallback;
export function todayInZone(zone = "Asia/Kolkata") {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
    const get = (type: string) => parts.find(p => p.type === type)?.value ?? "01";
    return `${get("year")}-${get("month")}-${get("day")}`;
  } catch { return new Date().toISOString().slice(0, 10); }
}
export function formatDate(date: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-IN", options ?? { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${date}T12:00:00Z`));
}
export function dayNumber(date: string) { const [y, m, d] = date.split("-").map(Number); return Date.UTC(y, m - 1, d) / 86400000; }
export function dateFromDay(value: number) { const d = new Date(value * 86400000); return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`; }
export function uid(prefix: string) { return `${prefix}-${Date.now()}-${Math.trunc(performance.now())}`; }
export const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));

const blankStudy = (): StudyEntry => ({ state: "not-recorded", studied: "not-recorded", minutes: 0, topic: "", description: "" });
const blankProject = (): ProjectEntry => ({ state: "not-recorded", worked: "not-recorded", minutes: 0, description: "" });
const blankMeal = (): MealEntry => ({ healthy: "not-recorded", oily: "not-recorded", oilyAmount: null });
export function blankRecord(date: string, projectTypes: string[] = []) {
  const study = Object.fromEntries(studyKeys.map(k => [k, blankStudy()])) as Record<StudyKey, StudyEntry>;
  const projects = Object.fromEntries([...baseProjectKeys, ...projectTypes].filter((k, i, a) => a.indexOf(k) === i).map(k => [k, blankProject()])) as Record<string, ProjectEntry>;
  return {
    date, study, projects,
    workout: { state: "not-recorded", completed: "not-recorded", duration: 0, type: "" },
    meals: { breakfast: blankMeal(), lunch: blankMeal(), dinner: blankMeal() },
    screen: { state: "not-recorded", minutes: 0 }, privateHabit: { state: "not-recorded", count: 0 },
    mood: null, energy: null, motivation: null, stress: null,
    reflections: { accomplishments: "", improvement: "", learning: "", tomorrowFocus: "" }, achievements: []
  } satisfies DailyRecord;
}

function normalizeStudy(v: unknown): StudyEntry {
  if (isObject(v)) return { state: v.state === "recorded" ? "recorded" : "not-recorded", studied: v.studied === "yes" || v.studied === "no" ? v.studied : (v.state === "recorded" ? "yes" : "not-recorded"), minutes: integer(v.minutes, 0, 0, 1440), topic: str(v.topic || v.subject), description: str(v.description) };
  const legacy = integer(v, 0, 0, 1440);
  return { state: legacy > 0 ? "recorded" : "not-recorded", studied: legacy > 0 ? "yes" : "not-recorded", minutes: legacy, topic: "", description: "" };
}
function normalizeProject(v: unknown): ProjectEntry {
  if (isObject(v)) return { state: v.state === "recorded" ? "recorded" : "not-recorded", worked: v.worked === "yes" || v.worked === "no" ? v.worked : (v.state === "recorded" ? "yes" : "not-recorded"), minutes: integer(v.minutes, 0, 0, 1440), description: str(v.description) };
  const legacy = integer(v, 0, 0, 1440);
  return { state: legacy > 0 ? "recorded" : "not-recorded", worked: legacy > 0 ? "yes" : "not-recorded", minutes: legacy, description: "" };
}
function normalizeMeal(v: unknown): MealEntry {
  if (isObject(v)) {
    const healthy: YesNoState = v.healthy === "yes" || v.healthy === "no" ? v.healthy : "not-recorded";
    const oily: YesNoState = v.oily === "yes" || v.oily === "no" ? v.oily : "not-recorded";
    const amount = v.oilyAmount === "low" || v.oilyAmount === "medium" || v.oilyAmount === "high" ? v.oilyAmount : null;
    return { healthy, oily, oilyAmount: oily === "yes" ? amount : null };
  }
  const legacy = v === "healthy" ? { healthy: "yes" as const } : v === "oily" ? { healthy: "no" as const } : { healthy: "not-recorded" as const };
  return { healthy: legacy.healthy, oily: v === "oily" ? "yes" : "not-recorded", oilyAmount: null };
}
export function normalizeRecord(value: unknown, fallbackDate: string, projectTypes: string[] = []): DailyRecord {
  const source = isObject(value) ? value : {}, studySource = isObject(source.study) ? source.study : {};
  const projectSource = isObject(source.projects) ? source.projects : {}, mealSource = isObject(source.meals) ? source.meals : {};
  const refs = isObject(source.reflections) ? source.reflections : {}, base = blankRecord(validDate(source.date, fallbackDate), projectTypes);
  const study = Object.fromEntries(studyKeys.map(k => [k, normalizeStudy(studySource[k])])) as Record<StudyKey, StudyEntry>;
  const projectNames = [...new Set([...baseProjectKeys, ...projectTypes, ...Object.keys(projectSource)])];
  const projects = Object.fromEntries(projectNames.map(k => [k, normalizeProject(projectSource[k])])) as Record<string, ProjectEntry>;
  const oldWorkout = integer(source.workout, 0, 0, 1440);
  const workoutSource = isObject(source.workout) ? source.workout : {};
  const workout: WorkoutEntry = isObject(source.workout)
    ? { state: workoutSource.state === "recorded" ? "recorded" : "not-recorded", completed: workoutSource.completed === "yes" || workoutSource.completed === "no" ? workoutSource.completed : "not-recorded", duration: integer(workoutSource.duration, 0, 0, 1440), type: str(workoutSource.type) }
    : { state: oldWorkout > 0 ? "recorded" : "not-recorded", completed: oldWorkout > 0 ? "yes" : "not-recorded", duration: oldWorkout, type: "" };
  const oldScreen = integer(source.screenMinutes, 0, 0, 1440), screenSource = isObject(source.screen) ? source.screen : {};
  const screen: ScreenEntry = isObject(source.screen) ? { state: screenSource.state === "recorded" ? "recorded" : "not-recorded", minutes: integer(screenSource.minutes, 0, 1440) } : { state: oldScreen > 0 ? "recorded" : "not-recorded", minutes: oldScreen };
  const privateSource = isObject(source.privateHabit) ? source.privateHabit : {};
  const oldPrivate = integer(source.privateHabitCount, 0, 0, 1000);
  const privateHabit: PrivateHabit = isObject(source.privateHabit) ? { state: privateSource.state === "yes" || privateSource.state === "no" ? privateSource.state : "not-recorded", count: integer(privateSource.count, 0, 0, 1000) } : { state: oldPrivate > 0 ? "yes" : "not-recorded", count: oldPrivate };
  const rating = (v: unknown) => v == null ? null : integer(v, 5, 1, 10);
  return {
    ...base, study, projects, workout, screen, privateHabit,
    meals: { breakfast: normalizeMeal(mealSource.breakfast), lunch: normalizeMeal(mealSource.lunch), dinner: normalizeMeal(mealSource.dinner) },
    mood: rating(source.mood), energy: rating(source.energy), motivation: rating(source.motivation), stress: rating(source.stress),
    reflections: {
      accomplishments: str(refs.accomplishments || refs.win), improvement: str(refs.improvement || refs.grateful),
      learning: str(refs.learning || refs.learn), tomorrowFocus: str(refs.tomorrowFocus || refs.tomorrow)
    },
    achievements: Array.isArray(source.achievements) ? source.achievements.map(v => str(v)).filter(Boolean).slice(0, 30) : []
  };
}

export function normalizeStore(value: unknown): Store {
  const source = isObject(value) ? value : {}, profileSource = isObject(source.profile) ? source.profile : {};
  const targetSource = isObject(profileSource.dailyTargets) ? profileSource.dailyTargets : {}, scoringSource = isObject(source.scoring) ? source.scoring : {};
  const weights = isObject(scoringSource.weights) ? scoringSource.weights : {}, bonus = isObject(scoringSource.bonusTargets) ? scoringSource.bonusTargets : {};
  const penalties = isObject(scoringSource.penalties) ? scoringSource.penalties : {}, settings = isObject(source.settings) ? source.settings : {};
  const now = todayInZone(str(profileSource.timezone, "Asia/Kolkata"));
  const customProjectTypes = Array.isArray(source.customProjectTypes) ? source.customProjectTypes.map(v => str(v)).filter(Boolean).slice(0, 30) : [];
  const profile: Profile = {
    name: str(profileSource.name), timezone: str(profileSource.timezone, "Asia/Kolkata"), gateTarget: integer(profileSource.gateTarget, 750, 0, 1000),
    gateCurrent: integer(profileSource.gateCurrent, 0, 0, 1000), cgpa: num(profileSource.cgpa, 0, 0, 10),
    careerYear: integer(profileSource.careerYear, new Date().getFullYear() + 1, 2020, 2100),
    dailyTargets: { studyMinutes: integer(targetSource.studyMinutes, 120, 0, 1440), workoutMinutes: integer(targetSource.workoutMinutes, 30, 0, 1440), screenMinutes: integer(targetSource.screenMinutes, 180, 0, 1440), healthyMeals: integer(targetSource.healthyMeals, 2, 0, 3), projectMinutes: integer(targetSource.projectMinutes, 30, 0, 1440) }
  };
  const rawRecords = Array.isArray(source.records) ? source.records : [];
  const records = rawRecords.filter(isObject).map(v => normalizeRecord(v, now, customProjectTypes)).reduce<DailyRecord[]>((all, item) => {
    const index = all.findIndex(r => r.date === item.date); if (index >= 0) all[index] = item; else all.push(item); return all;
  }, []);
  const history = (raw: unknown, max: number) => Array.isArray(raw) ? raw.filter(isObject).map(v => ({ date: validDate(v.date, now), value: num(v.value, 0, 0, max) })).slice(-500) : [];
  const goals = isObject(source.goals) ? source.goals : {}, goal = (key: string, fallback: string, target: number) => {
    const item = isObject(goals[key]) ? goals[key] : {}; return { title: str(item.title, fallback), target: integer(item.target, target, 0, 2100) };
  };
  return {
    version: 3, setup: Boolean(source.setup && profile.name), profile,
    goals: { gate: goal("gate", `GATE ${profile.gateTarget}+`, profile.gateTarget), cgpa: { title: str(isObject(goals.cgpa) ? goals.cgpa.title : "CGPA 10", "CGPA 10"), target: num(isObject(goals.cgpa) ? goals.cgpa.target : 10, 10, 0, 10) }, offer: goal("offer", `Offer by ${profile.careerYear}`, profile.careerYear) },
    gateHistory: history(source.gateHistory, 1000), cgpaHistory: history(source.cgpaHistory, 10), records, customProjectTypes,
    applications: Array.isArray(source.applications) ? source.applications.filter(isObject).map(v => ({ id: str(v.id, uid("app")), company: str(v.company, "Unnamed company"), role: str(v.role, "Role"), date: validDate(v.date, now), url: str(v.url), status: careerStatuses.includes(v.status as CareerStatus) ? v.status as CareerStatus : "Interested", notes: str(v.notes) })) : [],
    scoring: {
      weights: { study: num(weights.study, 35, 0, 100), project: num(weights.project, 18, 0, 100), workout: num(weights.workout, 10, 0, 100), meals: num(weights.meals, 12, 0, 100), screen: num(weights.screen, 8, 0, 100), wellbeing: num(weights.wellbeing, 8, 0, 100), reflections: num(weights.reflections, 5, 0, 100), achievements: num(weights.achievements, 4, 0, 100) },
      bonusTargets: { studyMinutes: integer(bonus.studyMinutes, 180, 0, 1440), workoutMinutes: integer(bonus.workoutMinutes, 45, 0, 1440), projectMinutes: integer(bonus.projectMinutes, 60, 0, 1440), healthyMeals: integer(bonus.healthyMeals, 3, 0, 3) },
      penalties: { oilyMeal: num(penalties.oilyMeal, 3, 0, 50), screenOverTarget: num(penalties.screenOverTarget, 0.05, 0, 1), missedReflection: num(penalties.missedReflection, 1, 0, 20) }
    },
    settings: { animation: settings.animation !== false, motivation: settings.motivation !== false, privateEnabled: Boolean(settings.privateEnabled), privateHidden: Boolean(settings.privateHidden), privatePin: str(settings.privatePin).slice(0, 32) }
  };
}

export function recordFor(store: Store, date: string) { return store.records.find(r => r.date === date) ?? blankRecord(date, store.customProjectTypes); }
export function updateRecord(store: Store, date: string, updater: (record: DailyRecord) => DailyRecord) {
  const next = updater(recordFor(store, date)); return { ...store, records: store.records.some(r => r.date === date) ? store.records.map(r => r.date === date ? next : r) : [...store.records, next] };
}
export function sumStudy(record: DailyRecord) { return studyKeys.reduce((sum, key) => sum + (record.study[key].state === "recorded" && record.study[key].studied === "yes" ? record.study[key].minutes : 0), 0); }
export function sumProjects(record: DailyRecord) { return Object.values(record.projects).reduce((sum, entry) => sum + (entry.state === "recorded" && entry.worked === "yes" ? entry.minutes : 0), 0); }
export function healthyMeals(record: DailyRecord) { return mealKeys.filter(key => record.meals[key].healthy === "yes").length; }
export function oilyMeals(record: DailyRecord) { return mealKeys.filter(key => record.meals[key].oily === "yes").length; }
export function evidenceCount(record: DailyRecord) {
  return sumStudy(record) + sumProjects(record) + studyKeys.filter(key => record.study[key].state === "recorded").length + Object.values(record.projects).filter(entry => entry.state === "recorded").length + (record.workout.state === "recorded" ? 1 : 0) + (record.screen.state === "recorded" ? 1 : 0) + healthyMeals(record) + oilyMeals(record) + (record.mood == null ? 0 : 1) + Object.values(record.reflections).filter(Boolean).length;
}
export function streak(dates: string[], zone: string) { const set = new Set(dates); let cursor = dayNumber(todayInZone(zone)); if (!set.has(dateFromDay(cursor))) cursor--; let count = 0; while (set.has(dateFromDay(cursor))) { count++; cursor--; } return count; }
export function bestStreak(dates: string[]) { const sorted = [...new Set(dates)].sort(); let best = 0, run = 0, previous = ""; for (const date of sorted) { run = previous && dayNumber(date) - dayNumber(previous) === 1 ? run + 1 : 1; best = Math.max(best, run); previous = date; } return best; }

export type ScoreBreakdown = { total: number; items: { label: string; value: number; weight: number; explanation: string; evidence: boolean }[]; bonuses: string[]; penalties: string[] };
export function scoreBreakdown(record: DailyRecord, store: Store): ScoreBreakdown {
  const t = store.profile.dailyTargets, w = store.scoring.weights, studyMinutes = sumStudy(record), projectMinutes = sumProjects(record);
  const studyEvidence = studyKeys.some(key => record.study[key].state === "recorded"), projectEvidence = Object.values(record.projects).some(entry => entry.state === "recorded"), workoutEvidence = record.workout.state === "recorded", mealEvidence = mealKeys.some(k => record.meals[k].healthy !== "not-recorded" || record.meals[k].oily !== "not-recorded");
  const screenEvidence = record.screen.state === "recorded", wellbeingValues = [record.mood, record.energy, record.motivation, record.stress == null ? null : 11 - record.stress].filter((v): v is number => v !== null);
  const reflectionCount = Object.values(record.reflections).filter(Boolean).length, reflectionEvidence = reflectionCount > 0, achievementsEvidence = record.achievements.length > 0;
  const values = {
    study: studyEvidence ? clamp(studyMinutes / Math.max(1, t.studyMinutes) * 100) : 0,
    project: projectEvidence ? clamp(projectMinutes / Math.max(1, t.projectMinutes) * 100) : 0,
    workout: workoutEvidence ? (record.workout.completed === "yes" ? clamp(record.workout.duration / Math.max(1, t.workoutMinutes) * 100) : 0) : 0,
    meals: mealEvidence ? clamp(healthyMeals(record) / Math.max(1, t.healthyMeals) * 100) : 0,
    screen: screenEvidence ? (t.screenMinutes === 0 ? 100 : clamp((1 - Math.max(0, record.screen.minutes - t.screenMinutes) / t.screenMinutes) * 100)) : 0,
    wellbeing: wellbeingValues.length ? clamp((wellbeingValues.reduce((a, b) => a + b, 0) / wellbeingValues.length) / 10 * 100) : 0,
    reflections: reflectionEvidence ? reflectionCount / reflectionKeys.length * 100 : 0,
    achievements: achievementsEvidence ? clamp(record.achievements.length / 3 * 100) : 0
  };
  const evidence = { study: studyEvidence, project: projectEvidence, workout: workoutEvidence, meals: mealEvidence, screen: screenEvidence, wellbeing: wellbeingValues.length > 0, reflections: reflectionEvidence, achievements: achievementsEvidence };
  const pairs = [["Study", "study", `${studyMinutes} / ${t.studyMinutes} minutes`], ["Projects", "project", `${projectMinutes} / ${t.projectMinutes} minutes`], ["Workout", "workout", workoutEvidence ? `${record.workout.duration} minutes, ${record.workout.completed}` : "Not recorded"], ["Meals", "meals", `${healthyMeals(record)} healthy meals`], ["Screen", "screen", screenEvidence ? `${record.screen.minutes} / ${t.screenMinutes} minutes` : "Not recorded"], ["Wellbeing", "wellbeing", wellbeingValues.length ? `${wellbeingValues.length} ratings` : "Not recorded"], ["Reflections", "reflections", `${reflectionCount} / ${reflectionKeys.length} written`], ["Achievements", "achievements", `${record.achievements.length} extras`]] as const;
  const denominator = Object.entries(w).reduce((sum, [key, weight]) => sum + (evidence[key as keyof typeof evidence] ? weight : 0), 0);
  const base = denominator ? pairs.reduce((sum, [, key]) => sum + values[key] * w[key], 0) / denominator : 0;
  const bonuses: string[] = [], bonus = store.scoring.bonusTargets;
  if (studyEvidence && bonus.studyMinutes > 0 && studyMinutes >= bonus.studyMinutes) bonuses.push(`+2 study target (${bonus.studyMinutes}m)`);
  if (projectEvidence && bonus.projectMinutes > 0 && projectMinutes >= bonus.projectMinutes) bonuses.push(`+2 project target (${bonus.projectMinutes}m)`);
  if (workoutEvidence && record.workout.completed === "yes" && bonus.workoutMinutes > 0 && record.workout.duration >= bonus.workoutMinutes) bonuses.push(`+2 workout target (${bonus.workoutMinutes}m)`);
  if (mealEvidence && bonus.healthyMeals > 0 && healthyMeals(record) >= bonus.healthyMeals) bonuses.push(`+2 healthy meal target (${bonus.healthyMeals})`);
  const penalties: string[] = [], oilyPenalty = mealKeys.reduce((sum, key) => {
    const meal = record.meals[key];
    const amountWeight = meal.oilyAmount === "high" ? 3 : meal.oilyAmount === "medium" ? 2 : 1;
    return sum + (meal.oily === "yes" ? store.scoring.penalties.oilyMeal * amountWeight : 0);
  }, 0);
  if (oilyPenalty) penalties.push(`-${oilyPenalty.toFixed(0)} oily meal points`);
  const screenPenalty = screenEvidence && record.screen.minutes > t.screenMinutes ? (record.screen.minutes - t.screenMinutes) / 60 * store.scoring.penalties.screenOverTarget : 0;
  if (screenPenalty) penalties.push(`-${screenPenalty.toFixed(1)} screen overage points`);
  const missedReflection = reflectionEvidence ? (reflectionKeys.length - reflectionCount) * store.scoring.penalties.missedReflection : 0;
  if (missedReflection) penalties.push(`-${missedReflection.toFixed(0)} incomplete reflection points`);
  const bonusPoints = bonuses.length * 2, total = clamp(Math.round(base + bonusPoints - oilyPenalty - screenPenalty - missedReflection));
  return { total, items: pairs.map(([label, key, explanation]) => ({ label, value: values[key], weight: w[key], explanation, evidence: evidence[key] })), bonuses: bonuses.length ? bonuses : ["No bonus targets reached"], penalties: penalties.length ? penalties : ["No penalties"] };
}

export function totalXp(store: Store) {
  return store.records.reduce((total, r) => {
    const study = sumStudy(r), projects = sumProjects(r), workout = r.workout.state === "recorded" && r.workout.completed === "yes" ? r.workout.duration : 0;
    const careerWeighted = studyKeys.reduce((sum, key) => sum + (r.study[key].state === "recorded" && r.study[key].studied === "yes" ? r.study[key].minutes * (key === "GATE" || key === "Series Exam" || key === "DSA" || key === "SQL" || key === "other placement" ? 2 : 1) : 0), 0);
    const score = scoreBreakdown(r, store).total, bonus = (study > 0 && store.scoring.bonusTargets.studyMinutes > 0 && study >= store.scoring.bonusTargets.studyMinutes ? 50 : 0) + (projects > 0 && store.scoring.bonusTargets.projectMinutes > 0 && projects >= store.scoring.bonusTargets.projectMinutes ? 40 : 0) + (workout > 0 && store.scoring.bonusTargets.workoutMinutes > 0 && workout >= store.scoring.bonusTargets.workoutMinutes ? 35 : 0) + (healthyMeals(r) > 0 && store.scoring.bonusTargets.healthyMeals > 0 && healthyMeals(r) >= store.scoring.bonusTargets.healthyMeals ? 25 : 0);
    return total + score * 2 + careerWeighted + projects * 2 + workout + healthyMeals(r) * 8 + r.achievements.length * 15 + bonus - oilyMeals(r) * 5;
  }, 0);
}
export const levelFor = (xp: number) => Math.floor(xp / 500) + 1;
export function rankFor(xp: number) { return (xp >= 11000 ? "SSS" : xp >= 7500 ? "SS" : xp >= 5000 ? "S" : xp >= 3500 ? "A" : xp >= 2200 ? "B" : xp >= 1200 ? "C" : xp >= 500 ? "D" : "E"); }
export const achievementCatalog = [
  ["first-record", "First signal", "Complete your first daily record", "🌱"], ["streak-seven", "Seven-day thread", "Track something for seven days in a row", "🔥"],
  ["gate-50-hours", "GATE foundation", "Record 50 hours of GATE study", "⚔️"], ["sql-30-hours", "SQL fluency", "Record 30 hours of SQL study", "🧮"],
  ["dsa-50-hours", "DSA depth", "Record 50 hours of DSA study", "🧠"], ["project-50-hours", "Project builder", "Record 50 hours of project work", "🛠️"],
  ["workout-20", "Training arc", "Complete 20 workouts", "💪"], ["tracked-30", "Reliable signal", "Track 30 days", "📅"],
  ["applications-25", "Into the arena", "Track 25 career applications", "🚀"], ["first-offer", "Offer unlocked", "Record your first offer", "🎉"],
  ["healthy-three", "Plate of power", "Record three healthy meals in one day", "🥗"], ["reflective", "Clear mirror", "Complete all four reflections on a day", "🪞"]
] as const;
export function completedAchievements(store: Store) {
  const tracked = store.records.filter(r => evidenceCount(r) > 0).map(r => r.date);
  const total = (key: StudyKey) => store.records.reduce((sum, r) => sum + (r.study[key].state === "recorded" && r.study[key].studied === "yes" ? r.study[key].minutes : 0), 0);
  const checks: Record<string, boolean> = {
    "first-record": tracked.length > 0, "streak-seven": bestStreak(tracked) >= 7, "gate-50-hours": total("GATE") >= 3000,
    "sql-30-hours": total("SQL") >= 1800, "dsa-50-hours": total("DSA") >= 3000, "project-50-hours": store.records.reduce((s, r) => s + sumProjects(r), 0) >= 3000,
    "workout-20": store.records.filter(r => r.workout.state === "recorded" && r.workout.completed === "yes").length >= 20,
    "tracked-30": new Set(tracked).size >= 30, "applications-25": store.applications.length >= 25,
    "first-offer": store.applications.some(a => a.status === "Offer"), "healthy-three": store.records.some(r => healthyMeals(r) >= 3),
    "reflective": store.records.some(r => Object.values(r.reflections).every(Boolean))
  };
  return checks;
}
