// Mock AsyncStorage
const mockStorage = {};

const AsyncStorage = {
  getItem: async (key) => mockStorage[key] || null,
  setItem: async (key, value) => {
    mockStorage[key] = value;
  },
};

// UUID Generator
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Constants
const GUEST_SESSIONS_KEY = "guest_sessions";
const GUEST_DRAFTS_KEY = "guest_drafts";

// --- Logic from practiceService.ts (Adapted for Node) ---

async function createPracticeSession(params) {
  console.log(
    `Creating session for user ${params.userId}, question ${params.questionId}...`,
  );
  if (params.isGuest) {
    const newSession = {
      id: generateUUID(),
      user_id: params.userId,
      question_id: params.questionId,
      session_type: params.mode,
      completed: false,
      time_spent_seconds: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const stored = await AsyncStorage.getItem(GUEST_SESSIONS_KEY);
    const sessions = stored ? JSON.parse(stored) : [];
    sessions.push(newSession);
    await AsyncStorage.setItem(GUEST_SESSIONS_KEY, JSON.stringify(sessions));

    return newSession.id;
  }
  throw new Error("Only guest mode supported in simulation");
}

async function saveDraft(params) {
  console.log(
    `Saving draft for user ${params.userId}, question ${params.questionId}...`,
  );
  if (params.isGuest) {
    const stored = await AsyncStorage.getItem(GUEST_DRAFTS_KEY);
    let drafts = stored ? JSON.parse(stored) : [];

    const existingIndex = drafts.findIndex(
      (d) => d.user_id === params.userId && d.question_id === params.questionId,
    );

    const draftData = {
      user_id: params.userId,
      question_id: params.questionId,
      draft_text: params.draftText,
      updated_at: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      drafts[existingIndex] = { ...drafts[existingIndex], ...draftData };
    } else {
      drafts.push({
        ...draftData,
        id: generateUUID(),
        created_at: new Date().toISOString(),
      });
    }

    await AsyncStorage.setItem(GUEST_DRAFTS_KEY, JSON.stringify(drafts));
    return;
  }
}

async function getDraft(userId, questionId, isGuest) {
  console.log(`Fetching draft for user ${userId}, question ${questionId}...`);
  if (isGuest) {
    const stored = await AsyncStorage.getItem(GUEST_DRAFTS_KEY);
    if (!stored) return null;
    const drafts = JSON.parse(stored);
    const draft = drafts.find(
      (d) => d.user_id === userId && d.question_id === questionId,
    );
    return draft ? draft.draft_text : null;
  }
  return null;
}

async function submitAnswer(params) {
  console.log(`Submitting answer for session ${params.sessionId}...`);
  if (params.isGuest) {
    const stored = await AsyncStorage.getItem(GUEST_SESSIONS_KEY);
    if (!stored) throw new Error("Session not found");

    let sessions = JSON.parse(stored);
    const index = sessions.findIndex((s) => s.id === params.sessionId);

    if (index === -1) throw new Error("Session not found locally");

    sessions[index] = {
      ...sessions[index],
      user_answer: params.userAnswer,
      time_spent_seconds: params.timeSpentSeconds,
      completed: true,
      updated_at: new Date().toISOString(),
      mcq_answers: params.mcqAnswers || sessions[index].mcq_answers,
    };

    await AsyncStorage.setItem(GUEST_SESSIONS_KEY, JSON.stringify(sessions));
    return;
  }
}

// --- Test Runner ---

async function runTest() {
  try {
    const guestId = generateUUID();
    const questionId = "q123";

    console.log("--- Starting Simulation ---");
    console.log("Guest ID:", guestId);

    // 1. Create Session
    const sessionId = await createPracticeSession({
      userId: guestId,
      questionId: questionId,
      mode: "text",
      isGuest: true,
    });
    console.log("Session Created:", sessionId);

    // 2. Save Draft
    await saveDraft({
      userId: guestId,
      questionId: questionId,
      draftText: "My draft answer...",
      isGuest: true,
    });
    console.log("Draft Saved");

    // 3. Retrieve Draft
    const fetchedDraft = await getDraft(guestId, questionId, true);
    console.log("Fetched Draft:", fetchedDraft);
    if (fetchedDraft !== "My draft answer...")
      throw new Error("Draft mismatch!");

    // 4. Update Draft
    await saveDraft({
      userId: guestId,
      questionId: questionId,
      draftText: "My updated answer...",
      isGuest: true,
    });
    const updatedDraft = await getDraft(guestId, questionId, true);
    console.log("Updated Draft:", updatedDraft);
    if (updatedDraft !== "My updated answer...")
      throw new Error("Draft update failed!");

    // 5. Submit Answer
    await submitAnswer({
      sessionId: sessionId,
      userAnswer: "Final Answer",
      timeSpentSeconds: 120,
      isGuest: true,
    });
    console.log("Answer Submitted");

    // 6. Verify Session Completion
    const stored = await AsyncStorage.getItem(GUEST_SESSIONS_KEY);
    const sessions = JSON.parse(stored);
    const session = sessions.find((s) => s.id === sessionId);

    if (!session.completed) throw new Error("Session not marked completed");
    if (session.user_answer !== "Final Answer")
      throw new Error("User answer not saved");

    console.log("--- Simulation Passed Successfully ---");
  } catch (error) {
    console.error("Test Failed:", error);
    process.exit(1);
  }
}

runTest();
