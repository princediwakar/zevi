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
exports.useLearningPathStore = void 0;
var zustand_1 = require("zustand");
var supabaseClient_1 = require("../lib/supabaseClient");
exports.useLearningPathStore = (0, zustand_1.create)(function (set, get) { return ({
    path: null,
    units: [],
    loading: false,
    error: null,
    fetchPath: function (slugOrId) { return __awaiter(void 0, void 0, void 0, function () {
        var pathsQuery, _a, pathsData_1, pathsError, pathData, pathIds, _b, unitsData, unitsError, unitIds, _c, lessonsData_1, lessonsError, unitsWithLessons, error_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    set({ loading: true, error: null });
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 5, , 6]);
                    pathsQuery = supabaseClient_1.supabase.from('learning_paths').select('*');
                    if (slugOrId) {
                        // Simple check if it looks like a UUID or slug
                        if (slugOrId.includes('-')) {
                            pathsQuery = pathsQuery.eq('id', slugOrId);
                        }
                        else {
                            pathsQuery = pathsQuery.eq('slug', slugOrId);
                        }
                    }
                    return [4 /*yield*/, pathsQuery];
                case 2:
                    _a = _d.sent(), pathsData_1 = _a.data, pathsError = _a.error;
                    if (pathsError)
                        throw pathsError;
                    if (!pathsData_1 || pathsData_1.length === 0)
                        throw new Error('No learning path found');
                    pathData = pathsData_1[0];
                    pathIds = pathsData_1.map(function (p) { return p.id; });
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('units')
                            .select('*')
                            .in('learning_path_id', pathIds)
                            .order('order_index', { ascending: true })];
                case 3:
                    _b = _d.sent(), unitsData = _b.data, unitsError = _b.error;
                    if (unitsError)
                        throw unitsError;
                    // 3. Fetch Lessons
                    if (!unitsData || unitsData.length === 0) {
                        set({ path: pathData, units: [], loading: false });
                        return [2 /*return*/];
                    }
                    unitIds = unitsData.map(function (u) { return u.id; });
                    return [4 /*yield*/, supabaseClient_1.supabase
                            .from('lessons')
                            .select('*')
                            .in('unit_id', unitIds)
                            .order('order_index', { ascending: true })];
                case 4:
                    _c = _d.sent(), lessonsData_1 = _c.data, lessonsError = _c.error;
                    if (lessonsError)
                        throw lessonsError;
                    unitsWithLessons = unitsData.map(function (unit) {
                        var path = pathsData_1.find(function (p) { return p.id === unit.learning_path_id; });
                        return __assign(__assign({}, unit), { pathCategory: (path === null || path === void 0 ? void 0 : path.category) || 'product_sense', lessons: (lessonsData_1 === null || lessonsData_1 === void 0 ? void 0 : lessonsData_1.filter(function (l) { return l.unit_id === unit.id; })) || [] });
                    });
                    set({ path: pathData, units: unitsWithLessons, loading: false });
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _d.sent();
                    ;
                    set({ error: error_1.message, loading: false });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); },
    reset: function () { return set({ path: null, units: [], loading: false, error: null }); }
}); });
