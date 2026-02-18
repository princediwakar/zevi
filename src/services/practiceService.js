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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPracticeSession = createPracticeSession;
exports.saveDraft = saveDraft;
exports.getDraft = getDraft;
exports.getUserDrafts = getUserDrafts;
exports.submitAnswer = submitAnswer;
exports.getUserSessions = getUserSessions;
exports.getQuestionSessions = getQuestionSessions;
exports.deleteDraft = deleteDraft;
var supabaseClient_1 = require("../lib/supabaseClient");
var logger_1 = require("../utils/logger");
// Helper functions for outline serialization
var serializeAnswer = function (answer) {
    if (typeof answer === 'string')
        return answer;
    return JSON.stringify(answer);
};
var deserializeAnswer = function (text) {
    try {
        var parsed = JSON.parse(text);
        // Validate it's a UserOutline structure
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            // Check if values are arrays of strings
            var values = Object.values(parsed);
            if (values.every(function (val) { return Array.isArray(val) && val.every(function (item) { return typeof item === 'string'; }); })) {
                return parsed;
            }
        }
    }
    catch (_a) {
        // Not valid JSON, return as plain text
    }
    return text;
};
// Process a session object to deserialize user_answer
var processSession = function (session) {
    if (session && session.user_answer && typeof session.user_answer === 'string') {
        return __assign(__assign({}, session), { user_answer: deserializeAnswer(session.user_answer) });
    }
    return session;
};
function createPracticeSession(params) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, question, questionError, _b, data, error, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('questions')
                            .select('id')
                            .eq('id', params.questionId)
                            .single()];
                case 1:
                    _a = _c.sent(), question = _a.data, questionError = _a.error;
                    if (questionError || !question) {
                        logger_1.logger.error('Question not found in database:', params.questionId);
                        throw new Error('Question not found in database. Please refresh and try again.');
                    }
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('practice_sessions')
                            .insert({
                            user_id: params.userId,
                            question_id: params.questionId,
                            session_type: params.mode,
                            completed: false,
                            time_spent_seconds: 0,
                        })
                            .select('id')
                            .single()];
                case 2:
                    _b = _c.sent(), data = _b.data, error = _b.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data.id];
                case 3:
                    error_1 = _c.sent();
                    logger_1.logger.error('Error creating practice session:', error_1);
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function saveDraft(params) {
    return __awaiter(this, void 0, void 0, function () {
        var error, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('drafts')
                            .upsert({
                            user_id: params.userId,
                            question_id: params.questionId,
                            draft_text: params.draftText,
                            updated_at: new Date().toISOString(),
                        })];
                case 1:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    logger_1.logger.error('Error saving draft:', error_2);
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getDraft(userId, questionId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('drafts')
                            .select('draft_text')
                            .eq('user_id', userId)
                            .eq('question_id', questionId)
                            .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        if (error.code === 'PGRST116')
                            return [2 /*return*/, null]; // No draft found
                        throw error;
                    }
                    return [2 /*return*/, (data === null || data === void 0 ? void 0 : data.draft_text) || null];
                case 2:
                    error_3 = _b.sent();
                    logger_1.logger.error('Error fetching draft:', error_3);
                    throw error_3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getUserDrafts(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('drafts')
                            .select("\n        *,\n        questions (\n          id,\n          question_text,\n          category,\n          difficulty,\n          company\n        )\n      ")
                            .eq('user_id', userId)
                            .order('updated_at', { ascending: false })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    // Process each session to deserialize user_answer
                    return [2 /*return*/, (data || []).map(processSession)];
                case 2:
                    error_4 = _b.sent();
                    logger_1.logger.error('Error fetching user drafts:', error_4);
                    throw error_4;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function submitAnswer(params) {
    return __awaiter(this, void 0, void 0, function () {
        var updateData, error, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    updateData = {
                        user_answer: serializeAnswer(params.userAnswer),
                        time_spent_seconds: params.timeSpentSeconds,
                        completed: true,
                        updated_at: new Date().toISOString(),
                    };
                    if (params.mcqAnswers) {
                        updateData.mcq_answers = params.mcqAnswers;
                    }
                    if (params.aiFeedback) {
                        updateData.ai_feedback = params.aiFeedback;
                    }
                    if (params.isCorrect !== undefined) {
                        updateData.is_correct = params.isCorrect;
                    }
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('practice_sessions')
                            .update(updateData)
                            .eq('id', params.sessionId)];
                case 1:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    logger_1.logger.error('Error submitting answer:', error_5);
                    throw error_5;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getUserSessions(userId_1) {
    return __awaiter(this, arguments, void 0, function (userId, limit) {
        var _a, data, error, error_6;
        if (limit === void 0) { limit = 20; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('practice_sessions')
                            .select("\n        *,\n        questions (\n          id,\n          question_text,\n          category,\n          difficulty,\n          company\n        )\n      ")
                            .eq('user_id', userId)
                            .order('created_at', { ascending: false })
                            .limit(limit)];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    // Process each session to deserialize user_answer
                    return [2 /*return*/, (data || []).map(processSession)];
                case 2:
                    error_6 = _b.sent();
                    logger_1.logger.error('Error fetching user sessions:', error_6);
                    throw error_6;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getQuestionSessions(userId, questionId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, error_7;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('practice_sessions')
                            .select('*')
                            .eq('user_id', userId)
                            .eq('question_id', questionId)
                            .order('created_at', { ascending: false })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    // Process each session to deserialize user_answer
                    return [2 /*return*/, (data || []).map(processSession)];
                case 2:
                    error_7 = _b.sent();
                    logger_1.logger.error('Error fetching question sessions:', error_7);
                    throw error_7;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function deleteDraft(userId, questionId) {
    return __awaiter(this, void 0, void 0, function () {
        var error, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('drafts')
                            .delete()
                            .eq('user_id', userId)
                            .eq('question_id', questionId)];
                case 1:
                    error = (_a.sent()).error;
                    if (error)
                        throw error;
                    return [3 /*break*/, 3];
                case 2:
                    error_8 = _a.sent();
                    logger_1.logger.error('Error deleting draft:', error_8);
                    throw error_8;
                case 3: return [2 /*return*/];
            }
        });
    });
}
