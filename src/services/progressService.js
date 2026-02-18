"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProgress = getUserProgress;
exports.initializeUserProgress = initializeUserProgress;
exports.updateProgressAfterCompletion = updateProgressAfterCompletion;
exports.updateStreak = updateStreak;
exports.getCategoryProgress = getCategoryProgress;
exports.calculateStreak = calculateStreak;
exports.getRecentActivity = getRecentActivity;
exports.getPracticeActivity = getPracticeActivity;
exports.checkWeeklyLimit = checkWeeklyLimit;
exports.updateFrameworkMastery = updateFrameworkMastery;
exports.updatePatternMastery = updatePatternMastery;
exports.updateAllProgressAfterSession = updateAllProgressAfterSession;
exports.getDetailedProgressStats = getDetailedProgressStats;
exports.calculateAndUpdateReadiness = calculateAndUpdateReadiness;
exports.getFrameworkMastery = getFrameworkMastery;
exports.getPatternMastery = getPatternMastery;
exports.getReadinessScore = getReadinessScore;
exports.getWeakAreas = getWeakAreas;
exports.getIncorrectQuestions = getIncorrectQuestions;
exports.markLessonCompleted = markLessonCompleted;
exports.getCompletedLessons = getCompletedLessons;
exports.getLessonsCompletedPerCategory = getLessonsCompletedPerCategory;
exports.markQuickQuizCompleted = markQuickQuizCompleted;
exports.isQuickQuizCompleted = isQuickQuizCompleted;
var supabaseClient_1 = require("../lib/supabaseClient");
var practiceService_1 = require("./practiceService");
var logger_1 = require("../utils/logger");
// Weekly limit for free tier (text questions with AI feedback)
var FREE_WEEKLY_LIMIT = 3;
function getUserProgress(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('user_progress')
                            .select('*')
                            .eq('user_id', userId)
                            .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (!error) return [3 /*break*/, 4];
                    if (!(error.code === 'PGRST116')) return [3 /*break*/, 3];
                    return [4 /*yield*/, initializeUserProgress(userId)];
                case 2: 
                // No progress record exists, create one
                return [2 /*return*/, _b.sent()];
                case 3: throw error;
                case 4: return [2 /*return*/, __assign(__assign({}, data), { framework_mastery: data.framework_mastery || {}, pattern_mastery: data.pattern_mastery || {}, readiness_score: data.readiness_score || 0, readiness_by_category: data.readiness_by_category || {} })];
                case 5:
                    error_1 = _b.sent();
                    logger_1.logger.error('Error fetching user progress:', error_1);
                    throw error_1;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function initializeUserProgress(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('user_progress')
                            .insert({
                            user_id: userId,
                            current_streak: 0,
                            longest_streak: 0,
                            total_questions_completed: 0,
                            total_mcq_completed: 0,
                            total_text_completed: 0,
                            category_progress: {},
                            framework_mastery: {},
                            pattern_mastery: {},
                            readiness_score: 0,
                            readiness_by_category: {},
                            weekly_questions_used: 0,
                            week_reset_date: new Date().toISOString(),
                        })
                            .select()
                            .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
                case 2:
                    error_2 = _b.sent();
                    logger_1.logger.error('Error initializing user progress:', error_2);
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function updateProgressAfterCompletion(userId, sessionType, category) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, currentProgress, fetchError, today, lastPracticeDate, newStreak, lastDate, todayDate, diffTime, diffDays, longestStreak, categoryProgress, currentCategoryCount, updateData, error, error, error_3;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('user_progress')
                            .select('*')
                            .eq('user_id', userId)
                            .single()];
                case 1:
                    _a = _c.sent(), currentProgress = _a.data, fetchError = _a.error;
                    if (fetchError && fetchError.code !== 'PGRST116') {
                        // PGRST116 means no rows returned - user doesn't have progress yet
                        throw fetchError;
                    }
                    today = new Date().toISOString().split('T')[0];
                    lastPracticeDate = currentProgress === null || currentProgress === void 0 ? void 0 : currentProgress.last_practice_date;
                    newStreak = 1;
                    if (lastPracticeDate) {
                        lastDate = new Date(lastPracticeDate);
                        todayDate = new Date(today);
                        diffTime = todayDate.getTime() - lastDate.getTime();
                        diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                        if (diffDays === 0) {
                            // Already practiced today, keep same streak
                            newStreak = (currentProgress === null || currentProgress === void 0 ? void 0 : currentProgress.current_streak) || 1;
                        }
                        else if (diffDays === 1) {
                            // Practiced yesterday, increment streak
                            newStreak = ((currentProgress === null || currentProgress === void 0 ? void 0 : currentProgress.current_streak) || 0) + 1;
                        }
                        // Otherwise, streak resets to 1
                    }
                    longestStreak = Math.max(newStreak, (currentProgress === null || currentProgress === void 0 ? void 0 : currentProgress.longest_streak) || 0);
                    categoryProgress = (currentProgress === null || currentProgress === void 0 ? void 0 : currentProgress.category_progress) || {};
                    currentCategoryCount = categoryProgress[category] || 0;
                    updateData = {
                        total_questions_completed: ((currentProgress === null || currentProgress === void 0 ? void 0 : currentProgress.total_questions_completed) || 0) + 1,
                        current_streak: newStreak,
                        longest_streak: longestStreak,
                        last_practice_date: today,
                        updated_at: new Date().toISOString(),
                    };
                    // Update session type specific counts
                    if (sessionType === 'mcq') {
                        updateData.total_mcq_completed = ((currentProgress === null || currentProgress === void 0 ? void 0 : currentProgress.total_mcq_completed) || 0) + 1;
                    }
                    else {
                        updateData.total_text_completed = ((currentProgress === null || currentProgress === void 0 ? void 0 : currentProgress.total_text_completed) || 0) + 1;
                    }
                    // Update category progress
                    updateData.category_progress = __assign(__assign({}, categoryProgress), (_b = {}, _b[category] = currentCategoryCount + 1, _b));
                    if (!currentProgress) return [3 /*break*/, 3];
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('user_progress')
                            .update(updateData)
                            .eq('user_id', userId)];
                case 2:
                    error = (_c.sent()).error;
                    if (error)
                        throw error;
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, supabaseClient_1.supabase
                        .from('user_progress')
                        .insert(__assign({ user_id: userId }, updateData))];
                case 4:
                    error = (_c.sent()).error;
                    if (error)
                        throw error;
                    _c.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_3 = _c.sent();
                    logger_1.logger.error('Error updating progress:', error_3);
                    throw error_3;
                case 7: return [2 /*return*/];
            }
        });
    });
}
function updateStreak(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, currentProgress, fetchError, today, lastPracticeDate, newStreak, lastDate, todayDate, diffTime, diffDays, longestStreak, error, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('user_progress')
                            .select('*')
                            .eq('user_id', userId)
                            .single()];
                case 1:
                    _a = _b.sent(), currentProgress = _a.data, fetchError = _a.error;
                    if (fetchError && fetchError.code !== 'PGRST116') {
                        throw fetchError;
                    }
                    today = new Date().toISOString().split('T')[0];
                    lastPracticeDate = currentProgress === null || currentProgress === void 0 ? void 0 : currentProgress.last_practice_date;
                    newStreak = 1;
                    if (lastPracticeDate) {
                        lastDate = new Date(lastPracticeDate);
                        todayDate = new Date(today);
                        diffTime = todayDate.getTime() - lastDate.getTime();
                        diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                        if (diffDays === 0) {
                            // Already practiced today, keep same streak
                            newStreak = (currentProgress === null || currentProgress === void 0 ? void 0 : currentProgress.current_streak) || 1;
                        }
                        else if (diffDays === 1) {
                            // Practiced yesterday, increment streak
                            newStreak = ((currentProgress === null || currentProgress === void 0 ? void 0 : currentProgress.current_streak) || 0) + 1;
                        }
                    }
                    longestStreak = Math.max(newStreak, (currentProgress === null || currentProgress === void 0 ? void 0 : currentProgress.longest_streak) || 0);
                    if (!currentProgress) return [3 /*break*/, 3];
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('user_progress')
                            .update({
                            current_streak: newStreak,
                            longest_streak: longestStreak,
                            last_practice_date: today,
                            updated_at: new Date().toISOString(),
                        })
                            .eq('user_id', userId)];
                case 2:
                    error = (_b.sent()).error;
                    if (error)
                        throw error;
                    _b.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_4 = _b.sent();
                    logger_1.logger.error('Error updating streak:', error_4);
                    throw error_4;
                case 5: return [2 /*return*/];
            }
        });
    });
}
function getCategoryProgress(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, error_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('user_progress')
                            .select('category_progress')
                            .eq('user_id', userId)
                            .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, (data === null || data === void 0 ? void 0 : data.category_progress) || {}];
                case 2:
                    error_5 = _b.sent();
                    logger_1.logger.error('Error fetching category progress:', error_5);
                    throw error_5;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function calculateStreak(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, error_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('user_progress')
                            .select('current_streak, longest_streak')
                            .eq('user_id', userId)
                            .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, {
                            current: (data === null || data === void 0 ? void 0 : data.current_streak) || 0,
                            longest: (data === null || data === void 0 ? void 0 : data.longest_streak) || 0,
                        }];
                case 2:
                    error_6 = _b.sent();
                    logger_1.logger.error('Error calculating streak:', error_6);
                    throw error_6;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getRecentActivity(userId_1) {
    return __awaiter(this, arguments, void 0, function (userId, days) {
        var startDate, _a, data, error, error_7;
        if (days === void 0) { days = 7; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    startDate = new Date();
                    startDate.setDate(startDate.getDate() - days);
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('practice_sessions')
                            .select("\n        *,\n        questions (\n          id,\n          question_text,\n          category,\n          difficulty,\n          company\n        )\n      ")
                            .eq('user_id', userId)
                            .gte('created_at', startDate.toISOString())
                            .order('created_at', { ascending: false })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data || []];
                case 2:
                    error_7 = _b.sent();
                    logger_1.logger.error('Error fetching recent activity:', error_7);
                    throw error_7;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getPracticeActivity(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var startDate, _a, data, error, error_8;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    startDate = new Date();
                    startDate.setFullYear(startDate.getFullYear() - 1); // Last year
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('practice_sessions')
                            .select('created_at')
                            .eq('user_id', userId)
                            .gte('created_at', startDate.toISOString())];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data.map(function (s) { return s.created_at; })];
                case 2:
                    error_8 = _b.sent();
                    logger_1.logger.error('Error fetching practice activity:', error_8);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Check if user is within weekly free tier limit
function checkWeeklyLimit(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, progress, used, remaining, error_9;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, supabaseClient_1.supabase.rpc('check_rate_limit', {
                            p_user_id: userId,
                        })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (!error) return [3 /*break*/, 3];
                    return [4 /*yield*/, getUserProgress(userId)];
                case 2:
                    progress = _b.sent();
                    used = (progress === null || progress === void 0 ? void 0 : progress.weekly_questions_used) || 0;
                    remaining = FREE_WEEKLY_LIMIT - used;
                    return [2 /*return*/, {
                            used: used,
                            limit: FREE_WEEKLY_LIMIT,
                            remaining: Math.max(0, remaining),
                            canPractice: remaining > 0,
                        }];
                case 3: return [2 /*return*/, {
                        used: data.remaining ? FREE_WEEKLY_LIMIT - data.remaining : 0,
                        limit: FREE_WEEKLY_LIMIT,
                        remaining: data.remaining || 0,
                        canPractice: data.allowed || false,
                    }];
                case 4:
                    error_9 = _b.sent();
                    logger_1.logger.error('Error checking weekly limit:', error_9);
                    // Default to allowing practice on error
                    return [2 /*return*/, {
                            used: 0,
                            limit: FREE_WEEKLY_LIMIT,
                            remaining: FREE_WEEKLY_LIMIT,
                            canPractice: true,
                        }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Update framework mastery after a practice session
function updateFrameworkMastery(userId, frameworkName, score) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, currentProgress, fetchError, frameworkMastery, currentScore, error, error_10;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('user_progress')
                            .select('framework_mastery')
                            .eq('user_id', userId)
                            .single()];
                case 1:
                    _a = _b.sent(), currentProgress = _a.data, fetchError = _a.error;
                    if (fetchError && fetchError.code !== 'PGRST116') {
                        throw fetchError;
                    }
                    frameworkMastery = (currentProgress === null || currentProgress === void 0 ? void 0 : currentProgress.framework_mastery) || {};
                    currentScore = frameworkMastery[frameworkName] || 0;
                    frameworkMastery[frameworkName] = Math.max(currentScore, score);
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('user_progress')
                            .update({
                            framework_mastery: frameworkMastery,
                            updated_at: new Date().toISOString(),
                        })
                            .eq('user_id', userId)];
                case 2:
                    error = (_b.sent()).error;
                    if (error)
                        throw error;
                    return [3 /*break*/, 4];
                case 3:
                    error_10 = _b.sent();
                    logger_1.logger.error('Error updating framework mastery:', error_10);
                    throw error_10;
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Update pattern mastery after a practice session
function updatePatternMastery(userId, patternName, score) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, currentProgress, fetchError, patternMastery, currentScore, error, error_11;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('user_progress')
                            .select('pattern_mastery')
                            .eq('user_id', userId)
                            .single()];
                case 1:
                    _a = _b.sent(), currentProgress = _a.data, fetchError = _a.error;
                    if (fetchError && fetchError.code !== 'PGRST116') {
                        throw fetchError;
                    }
                    patternMastery = (currentProgress === null || currentProgress === void 0 ? void 0 : currentProgress.pattern_mastery) || {};
                    currentScore = patternMastery[patternName] || 0;
                    patternMastery[patternName] = Math.max(currentScore, score);
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('user_progress')
                            .update({
                            pattern_mastery: patternMastery,
                            updated_at: new Date().toISOString(),
                        })
                            .eq('user_id', userId)];
                case 2:
                    error = (_b.sent()).error;
                    if (error)
                        throw error;
                    return [3 /*break*/, 4];
                case 3:
                    error_11 = _b.sent();
                    logger_1.logger.error('Error updating pattern mastery:', error_11);
                    throw error_11;
                case 4: return [2 /*return*/];
            }
        });
    });
}
// ============================================
// COMPREHENSIVE PROGRESS UPDATE
// Called after completing any practice session
// Updates: count, streak, category progress, mastery scores, readiness
// ============================================
/**
 * Comprehensive function to update all progress after a practice session
 * This is the main entry point for progress updates
 */
function updateAllProgressAfterSession(userId, sessionType, category, frameworkName, patternName, score // AI feedback score (1-10)
) {
    return __awaiter(this, void 0, void 0, function () {
        var masteryScore, masteryScore, error_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    // 1. Update basic progress (count, streak, category)
                    return [4 /*yield*/, updateProgressAfterCompletion(userId, sessionType, category)];
                case 1:
                    // 1. Update basic progress (count, streak, category)
                    _a.sent();
                    if (!(frameworkName && score !== undefined)) return [3 /*break*/, 3];
                    masteryScore = Math.round(score * 10);
                    return [4 /*yield*/, updateFrameworkMastery(userId, frameworkName, masteryScore)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    if (!(patternName && score !== undefined)) return [3 /*break*/, 5];
                    masteryScore = Math.round(score * 10);
                    return [4 /*yield*/, updatePatternMastery(userId, patternName, masteryScore)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: 
                // 4. Recalculate readiness score (comprehensive)
                return [4 /*yield*/, calculateAndUpdateReadiness(userId)];
                case 6:
                    // 4. Recalculate readiness score (comprehensive)
                    _a.sent();
                    logger_1.logger.info('Progress updated comprehensively for user:', userId);
                    return [3 /*break*/, 8];
                case 7:
                    error_12 = _a.sent();
                    logger_1.logger.error('Error in comprehensive progress update:', error_12);
                    throw error_12;
                case 8: return [2 /*return*/];
            }
        });
    });
}
function getDetailedProgressStats(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var progress, categoryProgress, lessonsPerCategory, activityDates, recentSessions, lastPracticeDate, categoryBreakdown, allCategories, _i, allCategories_1, cat, questions, lessons, questionReadiness, lessonReadiness, readiness, error_13;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, getUserProgress(userId)];
                case 1:
                    progress = _b.sent();
                    categoryProgress = (progress === null || progress === void 0 ? void 0 : progress.category_progress) || {};
                    lessonsPerCategory = (progress === null || progress === void 0 ? void 0 : progress.lessons_completed_per_category) || {};
                    return [4 /*yield*/, getPracticeActivity(userId)];
                case 2:
                    activityDates = _b.sent();
                    return [4 /*yield*/, getRecentActivity(userId, 30)];
                case 3:
                    recentSessions = _b.sent();
                    lastPracticeDate = recentSessions.length > 0 ? recentSessions[0].created_at : null;
                    categoryBreakdown = {};
                    allCategories = [
                        'product_sense', 'execution', 'strategy', 'behavioral',
                        'technical', 'estimation', 'pricing', 'ab_testing'
                    ];
                    for (_i = 0, allCategories_1 = allCategories; _i < allCategories_1.length; _i++) {
                        cat = allCategories_1[_i];
                        questions = categoryProgress[cat] || 0;
                        lessons = lessonsPerCategory[cat] || 0;
                        questionReadiness = Math.min(questions * 5, 60);
                        lessonReadiness = Math.min(lessons * 10, 40);
                        readiness = questionReadiness + lessonReadiness;
                        categoryBreakdown[cat] = {
                            questions: questions,
                            lessons: lessons,
                            readiness: Math.min(readiness, 100),
                        };
                    }
                    return [2 /*return*/, {
                            currentStreak: (progress === null || progress === void 0 ? void 0 : progress.current_streak) || 0,
                            longestStreak: (progress === null || progress === void 0 ? void 0 : progress.longest_streak) || 0,
                            totalQuestionsCompleted: (progress === null || progress === void 0 ? void 0 : progress.total_questions_completed) || 0,
                            totalLessonsCompleted: ((_a = progress === null || progress === void 0 ? void 0 : progress.completed_lessons) === null || _a === void 0 ? void 0 : _a.length) || 0,
                            readinessScore: (progress === null || progress === void 0 ? void 0 : progress.readiness_score) || 0,
                            readinessByCategory: (progress === null || progress === void 0 ? void 0 : progress.readiness_by_category) || {},
                            frameworkMastery: (progress === null || progress === void 0 ? void 0 : progress.framework_mastery) || {},
                            patternMastery: (progress === null || progress === void 0 ? void 0 : progress.pattern_mastery) || {},
                            categoryProgress: categoryBreakdown,
                            activityDates: activityDates,
                            lastPracticeDate: lastPracticeDate,
                        }];
                case 4:
                    error_13 = _b.sent();
                    logger_1.logger.error('Error getting detailed progress stats:', error_13);
                    throw error_13;
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Calculate and update readiness score based on NEW_PLAN spec
// weights: framework_mastery: 0.4, pattern_mastery: 0.3, category_completion: 0.2, practice_volume: 0.1
function calculateAndUpdateReadiness(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var progress_1, frameworkKeys, frameworkAvg, patternKeys, patternAvg, categoryKeys, categoryAvg, volumeScore, readiness, error, error_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, getUserProgress(userId)];
                case 1:
                    progress_1 = _a.sent();
                    if (!progress_1)
                        return [2 /*return*/, 0];
                    frameworkKeys = Object.keys(progress_1.framework_mastery || {});
                    frameworkAvg = frameworkKeys.length > 0
                        ? frameworkKeys.reduce(function (sum, key) { var _a; return sum + ((((_a = progress_1.framework_mastery) === null || _a === void 0 ? void 0 : _a[key]) || 0)); }, 0) / frameworkKeys.length
                        : 0;
                    patternKeys = Object.keys(progress_1.pattern_mastery || {});
                    patternAvg = patternKeys.length > 0
                        ? patternKeys.reduce(function (sum, key) { var _a; return sum + ((((_a = progress_1.pattern_mastery) === null || _a === void 0 ? void 0 : _a[key]) || 0)); }, 0) / patternKeys.length
                        : 0;
                    categoryKeys = Object.keys(progress_1.category_progress || {});
                    categoryAvg = categoryKeys.length > 0
                        ? categoryKeys.reduce(function (sum, key) { var _a; return sum + Math.min(((((_a = progress_1.category_progress) === null || _a === void 0 ? void 0 : _a[key]) || 0) / 10) * 100, 100); }, 0) / categoryKeys.length
                        : 0;
                    volumeScore = Math.min(((progress_1.total_questions_completed || 0) / 50) * 100, 100);
                    readiness = Math.round(frameworkAvg * 0.4 +
                        patternAvg * 0.3 +
                        categoryAvg * 0.2 +
                        volumeScore * 0.1);
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('user_progress')
                            .update({ readiness_score: readiness, updated_at: new Date().toISOString() })
                            .eq('user_id', userId)];
                case 2:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    return [2 /*return*/, readiness];
                case 3:
                    error_14 = _a.sent();
                    logger_1.logger.error('Error calculating readiness:', error_14);
                    return [2 /*return*/, 0];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Get framework mastery scores
function getFrameworkMastery(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var progress, error_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getUserProgress(userId)];
                case 1:
                    progress = _a.sent();
                    return [2 /*return*/, (progress === null || progress === void 0 ? void 0 : progress.framework_mastery) || {}];
                case 2:
                    error_15 = _a.sent();
                    logger_1.logger.error('Error fetching framework mastery:', error_15);
                    return [2 /*return*/, {}];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Get pattern mastery scores
function getPatternMastery(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var progress, error_16;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getUserProgress(userId)];
                case 1:
                    progress = _a.sent();
                    return [2 /*return*/, (progress === null || progress === void 0 ? void 0 : progress.pattern_mastery) || {}];
                case 2:
                    error_16 = _a.sent();
                    logger_1.logger.error('Error fetching pattern mastery:', error_16);
                    return [2 /*return*/, {}];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Get readiness score
function getReadinessScore(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var progress, error_17;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getUserProgress(userId)];
                case 1:
                    progress = _a.sent();
                    return [2 /*return*/, (progress === null || progress === void 0 ? void 0 : progress.readiness_score) || 0];
                case 2:
                    error_17 = _a.sent();
                    logger_1.logger.error('Error fetching readiness score:', error_17);
                    return [2 /*return*/, 0];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Compute weak areas based on user's incorrect answers
// Returns categories where user has < 70% success rate with at least 3 attempts
function getWeakAreas(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var sessions, categoryStats, _i, sessions_1, session, category, allCorrect, weakAreas, _a, _b, _c, category, stats, successRate, error_18;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, practiceService_1.getUserSessions)(userId, 100)];
                case 1:
                    sessions = _e.sent();
                    if (!sessions || sessions.length === 0) {
                        return [2 /*return*/, []];
                    }
                    categoryStats = {};
                    for (_i = 0, sessions_1 = sessions; _i < sessions_1.length; _i++) {
                        session = sessions_1[_i];
                        // Only count sessions that have been completed with a known result
                        if (!session.completed)
                            continue;
                        category = (_d = session.questions) === null || _d === void 0 ? void 0 : _d.category;
                        if (!category)
                            continue;
                        if (!categoryStats[category]) {
                            categoryStats[category] = { correct: 0, total: 0 };
                        }
                        categoryStats[category].total += 1;
                        // For MCQ sessions, check if all sub-answers are correct
                        if (session.mcq_answers && session.mcq_answers.length > 0) {
                            allCorrect = session.mcq_answers.every(function (a) { return a.correct; });
                            if (allCorrect) {
                                categoryStats[category].correct += 1;
                            }
                        }
                        else if (session.is_correct === true) {
                            // For text/other sessions, use is_correct field
                            categoryStats[category].correct += 1;
                        }
                    }
                    weakAreas = [];
                    for (_a = 0, _b = Object.entries(categoryStats); _a < _b.length; _a++) {
                        _c = _b[_a], category = _c[0], stats = _c[1];
                        if (stats.total >= 3) { // Minimum 3 attempts to consider as weak area
                            successRate = (stats.correct / stats.total) * 100;
                            if (successRate < 70) {
                                weakAreas.push({
                                    category: category,
                                    successRate: Math.round(successRate),
                                    totalAttempts: stats.total
                                });
                            }
                        }
                    }
                    // Sort by success rate (lowest first) to show most problematic areas first
                    weakAreas.sort(function (a, b) { return a.successRate - b.successRate; });
                    return [2 /*return*/, weakAreas];
                case 2:
                    error_18 = _e.sent();
                    logger_1.logger.error('Error computing weak areas:', error_18);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Get questions user got wrong (for mistakes review)
function getIncorrectQuestions(userId_1) {
    return __awaiter(this, arguments, void 0, function (userId, limit) {
        var sessions, incorrectSessions, error_19;
        if (limit === void 0) { limit = 20; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, practiceService_1.getUserSessions)(userId, 100)];
                case 1:
                    sessions = _a.sent();
                    if (!sessions || sessions.length === 0) {
                        return [2 /*return*/, []];
                    }
                    incorrectSessions = sessions.filter(function (session) {
                        if (!session.completed)
                            return false;
                        // Check MCQ answers
                        if (session.mcq_answers && session.mcq_answers.length > 0) {
                            return !session.mcq_answers.every(function (a) { return a.correct; });
                        }
                        // Check is_correct field
                        return session.is_correct === false;
                    });
                    return [2 /*return*/, incorrectSessions.slice(0, limit)];
                case 2:
                    error_19 = _a.sent();
                    logger_1.logger.error('Error fetching incorrect questions:', error_19);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ============================================
// LESSON COMPLETION TRACKING
// ============================================
/**
 * Mark a lesson as completed
 * @param userId - The user's ID
 * @param lessonId - The ID of the lesson that was completed
 * @param category - The category of the lesson (e.g., 'product_sense')
 */
function markLessonCompleted(userId, lessonId, category) {
    return __awaiter(this, void 0, void 0, function () {
        var progress, completedLessons, newCompletedLessons, lessonsPerCategory, currentCategoryCount, error, error_20;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, getUserProgress(userId)];
                case 1:
                    progress = _b.sent();
                    if (!progress) {
                        throw new Error('User progress not found');
                    }
                    completedLessons = progress.completed_lessons || [];
                    // Check if lesson already completed
                    if (completedLessons.includes(lessonId)) {
                        logger_1.logger.info('Lesson already completed:', lessonId);
                        return [2 /*return*/]; // Already completed, no need to update
                    }
                    newCompletedLessons = __spreadArray(__spreadArray([], completedLessons, true), [lessonId], false);
                    lessonsPerCategory = progress.lessons_completed_per_category || {};
                    currentCategoryCount = lessonsPerCategory[category] || 0;
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('user_progress')
                            .update({
                            completed_lessons: newCompletedLessons,
                            lessons_completed_per_category: __assign(__assign({}, lessonsPerCategory), (_a = {}, _a[category] = currentCategoryCount + 1, _a)),
                            updated_at: new Date().toISOString()
                        })
                            .eq('user_id', userId)];
                case 2:
                    error = (_b.sent()).error;
                    if (error)
                        throw error;
                    logger_1.logger.info('Lesson marked as completed:', lessonId, 'Category:', category);
                    return [3 /*break*/, 4];
                case 3:
                    error_20 = _b.sent();
                    logger_1.logger.error('Error marking lesson as completed:', error_20);
                    throw error_20;
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get completed lessons for a user
 * @param userId - The user's ID
 * @returns Array of completed lesson IDs
 */
function getCompletedLessons(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var progress, error_21;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getUserProgress(userId)];
                case 1:
                    progress = _a.sent();
                    return [2 /*return*/, (progress === null || progress === void 0 ? void 0 : progress.completed_lessons) || []];
                case 2:
                    error_21 = _a.sent();
                    logger_1.logger.error('Error getting completed lessons:', error_21);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get lessons completed per category
 * @param userId - The user's ID
 * @returns Record of category -> count of lessons completed
 */
function getLessonsCompletedPerCategory(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, error_22;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('user_progress')
                            .select('lessons_completed_per_category')
                            .eq('user_id', userId)
                            .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, (data === null || data === void 0 ? void 0 : data.lessons_completed_per_category) || {}];
                case 2:
                    error_22 = _b.sent();
                    logger_1.logger.error('Error getting lessons per category:', error_22);
                    return [2 /*return*/, {}];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Mark quick quiz as completed
 * @param userId - The user's ID
 */
function markQuickQuizCompleted(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var error, error_23;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('user_progress')
                            .update({
                            quick_quiz_completed: true,
                            updated_at: new Date().toISOString()
                        })
                            .eq('user_id', userId)];
                case 1:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    logger_1.logger.info('Quick quiz marked as completed');
                    return [3 /*break*/, 3];
                case 2:
                    error_23 = _a.sent();
                    logger_1.logger.error('Error marking quick quiz as completed:', error_23);
                    throw error_23;
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Check if quick quiz has been completed
 * @param userId - The user's ID
 * @returns Boolean indicating if quick quiz is completed
 */
function isQuickQuizCompleted(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, error_24;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('user_progress')
                            .select('quick_quiz_completed')
                            .eq('user_id', userId)
                            .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, (data === null || data === void 0 ? void 0 : data.quick_quiz_completed) || false];
                case 2:
                    error_24 = _b.sent();
                    logger_1.logger.error('Error checking quick quiz completion:', error_24);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
