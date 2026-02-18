"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useProgressStore = void 0;
var zustand_1 = require("zustand");
var progressService = require("../services/progressService");
exports.useProgressStore = (0, zustand_1.create)(function (set, get) { return ({
    progress: null,
    loading: false,
    error: null,
    history: [],
    activityData: [],
    frameworkMastery: {},
    patternMastery: {},
    readinessScore: 0,
    weakAreas: [],
    incorrectQuestions: [],
    lessonsCompletedPerCategory: {},
    quickQuizCompleted: false,
    detailedStats: null,
    fetchProgress: function (userId) { return __awaiter(void 0, void 0, void 0, function () {
        var progress, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set({ loading: true, error: null });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, progressService.getUserProgress(userId)];
                case 2:
                    progress = _a.sent();
                    set({
                        progress: progress,
                        loading: false,
                        frameworkMastery: (progress === null || progress === void 0 ? void 0 : progress.framework_mastery) || {},
                        patternMastery: (progress === null || progress === void 0 ? void 0 : progress.pattern_mastery) || {},
                        readinessScore: (progress === null || progress === void 0 ? void 0 : progress.readiness_score) || 0,
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    ;
                    set({ error: error_1.message, loading: false });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    fetchActivity: function (userId) { return __awaiter(void 0, void 0, void 0, function () {
        var dates, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, progressService.getPracticeActivity(userId)];
                case 1:
                    dates = _a.sent();
                    set({ activityData: dates });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    ;
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    fetchHistory: function (userId) { return __awaiter(void 0, void 0, void 0, function () {
        var getUserSessions, history_1, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../services/practiceService'); })];
                case 1:
                    getUserSessions = (_a.sent()).getUserSessions;
                    return [4 /*yield*/, getUserSessions(userId, 10)];
                case 2:
                    history_1 = _a.sent();
                    set({ history: history_1 });
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    ;
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    fetchMastery: function (userId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, frameworkMastery, patternMastery, readinessScore, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Promise.all([
                            progressService.getFrameworkMastery(userId),
                            progressService.getPatternMastery(userId),
                            progressService.getReadinessScore(userId),
                        ])];
                case 1:
                    _a = _b.sent(), frameworkMastery = _a[0], patternMastery = _a[1], readinessScore = _a[2];
                    set({ frameworkMastery: frameworkMastery, patternMastery: patternMastery, readinessScore: readinessScore });
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _b.sent();
                    ;
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    fetchWeakAreas: function (userId) { return __awaiter(void 0, void 0, void 0, function () {
        var weakAreas, incorrectQuestions, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, progressService.getWeakAreas(userId)];
                case 1:
                    weakAreas = _a.sent();
                    return [4 /*yield*/, progressService.getIncorrectQuestions(userId)];
                case 2:
                    incorrectQuestions = _a.sent();
                    set({ weakAreas: weakAreas, incorrectQuestions: incorrectQuestions });
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    ;
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    // NEW: Fetch comprehensive progress stats for the Progress screen
    fetchDetailedStats: function (userId) { return __awaiter(void 0, void 0, void 0, function () {
        var detailedStats, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, progressService.getDetailedProgressStats(userId)];
                case 1:
                    detailedStats = _a.sent();
                    set({ detailedStats: detailedStats });
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    ;
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    updateAfterCompletion: function (userId, mode, category) { return __awaiter(void 0, void 0, void 0, function () {
        var error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, progressService.updateProgressAfterCompletion(userId, mode, category)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, get().fetchProgress(userId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_7 = _a.sent();
                    ;
                    set({ error: 'Failed to update progress' });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    updateFrameworkMastery: function (userId, frameworkName, score) { return __awaiter(void 0, void 0, void 0, function () {
        var error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, progressService.updateFrameworkMastery(userId, frameworkName, score)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, get().fetchMastery(userId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_8 = _a.sent();
                    ;
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    updatePatternMastery: function (userId, patternName, score) { return __awaiter(void 0, void 0, void 0, function () {
        var error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, progressService.updatePatternMastery(userId, patternName, score)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, get().fetchMastery(userId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_9 = _a.sent();
                    ;
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    calculateReadiness: function (userId) { return __awaiter(void 0, void 0, void 0, function () {
        var readinessScore, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, progressService.calculateAndUpdateReadiness(userId)];
                case 1:
                    readinessScore = _a.sent();
                    set({ readinessScore: readinessScore });
                    return [3 /*break*/, 3];
                case 2:
                    error_10 = _a.sent();
                    ;
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    updateStreak: function (userId) { return __awaiter(void 0, void 0, void 0, function () {
        var error_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, get().fetchProgress(userId)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_11 = _a.sent();
                    ;
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    getCategoryProgress: function (userId) { return __awaiter(void 0, void 0, void 0, function () {
        var error_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, progressService.getCategoryProgress(userId)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    error_12 = _a.sent();
                    ;
                    return [2 /*return*/, {}];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    // NEW: Lesson completion tracking
    markLessonCompleted: function (userId, lessonId, category) { return __awaiter(void 0, void 0, void 0, function () {
        var error_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, progressService.markLessonCompleted(userId, lessonId, category)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, get().fetchProgress(userId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_13 = _a.sent();
                    ;
                    set({ error: 'Failed to mark lesson as completed' });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    getLessonsCompletedPerCategory: function (userId) { return __awaiter(void 0, void 0, void 0, function () {
        var lessonsPerCategory, error_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, progressService.getLessonsCompletedPerCategory(userId)];
                case 1:
                    lessonsPerCategory = _a.sent();
                    set({ lessonsCompletedPerCategory: lessonsPerCategory });
                    return [2 /*return*/, lessonsPerCategory];
                case 2:
                    error_14 = _a.sent();
                    ;
                    return [2 /*return*/, {}];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    markQuickQuizCompleted: function (userId) { return __awaiter(void 0, void 0, void 0, function () {
        var error_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, progressService.markQuickQuizCompleted(userId)];
                case 1:
                    _a.sent();
                    set({ quickQuizCompleted: true });
                    return [4 /*yield*/, get().fetchProgress(userId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_15 = _a.sent();
                    ;
                    set({ error: 'Failed to mark quick quiz as completed' });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    isQuickQuizCompleted: function (userId) { return __awaiter(void 0, void 0, void 0, function () {
        var completed, error_16;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, progressService.isQuickQuizCompleted(userId)];
                case 1:
                    completed = _a.sent();
                    set({ quickQuizCompleted: completed });
                    return [2 /*return*/, completed];
                case 2:
                    error_16 = _a.sent();
                    ;
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    resetProgress: function () {
        set({
            progress: null,
            error: null,
            frameworkMastery: {},
            patternMastery: {},
            readinessScore: 0,
            lessonsCompletedPerCategory: {},
            quickQuizCompleted: false,
            detailedStats: null,
        });
    },
}); });
