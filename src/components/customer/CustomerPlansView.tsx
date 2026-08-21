import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Apple,
  Dumbbell,
  Clock,
  CheckCircle2,
  FileText,
  Utensils,
  Play,
  Calendar,
  ChevronDown,
  ChevronUp,
  Droplet,
  Printer,
  ShieldCheck,
  Flame,
  Scale,
  Award,
  Layers,
  Leaf,
} from 'lucide-react';
import { PrintDocumentModal } from '../common/PrintDocumentModal';

export const CustomerPlansView: React.FC = () => {
  const {
    dietPlans,
    workoutPlans,
    activeCustomer,
    activeTrainer,
    toggleMealComplete,
    setActiveView,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'diet' | 'workout'>('diet');
  const [expandedDayId, setExpandedDayId] = useState<string | null>('day-1');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const currentDiet =
    dietPlans.find((d) => d.customerId === activeCustomer.id) ||
    dietPlans.find((d) => d.status === 'active') ||
    dietPlans[0];

  const currentWorkout =
    workoutPlans.find((w) => w.customerId === activeCustomer.id) ||
    workoutPlans.find((w) => w.status === 'active') ||
    workoutPlans[0];

  // Macro Totals & Percentages
  const totalMacroGrams =
    (currentDiet?.targetProteinG || 160) +
    (currentDiet?.targetCarbsG || 210) +
    (currentDiet?.targetFatsG || 65);

  const proteinPct = Math.round(((currentDiet?.targetProteinG || 160) / totalMacroGrams) * 100);
  const carbsPct = Math.round(((currentDiet?.targetCarbsG || 210) / totalMacroGrams) * 100);
  const fatsPct = 100 - proteinPct - carbsPct;

  // Eaten Macros
  const completedMeals = currentDiet?.meals?.filter((m) => m.isCompleted) || [];
  const eatenCalories = completedMeals.reduce((sum, m) => sum + m.calories, 0);
  const eatenProtein = completedMeals.reduce((sum, m) => sum + m.proteinG, 0);
  const eatenCarbs = completedMeals.reduce((sum, m) => sum + m.carbsG, 0);
  const eatenFats = completedMeals.reduce((sum, m) => sum + m.fatsG, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-[10px] border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Prescribed Plans</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-[6px] bg-slate-100 text-slate-700 border border-slate-200">
              Coach {activeTrainer.fullName}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Trainer-managed periodized training splits and precision nutrition protocols.
          </p>
        </div>

        <button
          onClick={() => setIsPrintModalOpen(true)}
          className="px-3.5 py-2 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-2xs"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-slate-100 p-1 rounded-[10px] border border-slate-200">
        <button
          onClick={() => setActiveTab('diet')}
          className={`flex-1 py-2.5 rounded-[8px] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'diet'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Clinical Nutrition Protocol</span>
          {currentDiet?.dietType && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-[4px] font-bold ${
              currentDiet.dietType === 'Vegetarian' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {currentDiet.dietType}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('workout')}
          className={`flex-1 py-2.5 rounded-[8px] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'workout'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>Resistance Training Routine</span>
        </button>
      </div>

      {/* Tab Content: Diet / Nutrition */}
      {activeTab === 'diet' && currentDiet && (
        <div className="space-y-6">
          {/* Diet Plan Overview Banner */}
          <div className="bg-white rounded-[10px] p-6 border border-slate-200 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900">{currentDiet.title}</h2>
                  <span className="px-2 py-0.5 rounded-[6px] text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                    {currentDiet.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{currentDiet.description || 'Targeted macronutrient protocol aligned with athletic goals.'}</p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-2xl font-black text-slate-900">{currentDiet.dailyCalories}</span>
                <span className="text-xs text-slate-400 block font-normal">Daily Calorie Target (kcal)</span>
              </div>
            </div>

            {/* Macro Targets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-[10px] border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                  <span>Protein</span>
                  <span className="text-rose-700 font-bold">{proteinPct}%</span>
                </div>
                <p className="text-lg font-black text-slate-900">{currentDiet.targetProteinG}g</p>
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-rose-600 rounded-full"
                    style={{ width: `${Math.min((eatenProtein / currentDiet.targetProteinG) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Logged: {eatenProtein}g</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-[10px] border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                  <span>Carbohydrates</span>
                  <span className="text-blue-700 font-bold">{carbsPct}%</span>
                </div>
                <p className="text-lg font-black text-slate-900">{currentDiet.targetCarbsG}g</p>
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${Math.min((eatenCarbs / currentDiet.targetCarbsG) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Logged: {eatenCarbs}g</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-[10px] border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                  <span>Fats</span>
                  <span className="text-amber-700 font-bold">{fatsPct}%</span>
                </div>
                <p className="text-lg font-black text-slate-900">{currentDiet.targetFatsG}g</p>
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-amber-600 rounded-full"
                    style={{ width: `${Math.min((eatenFats / currentDiet.targetFatsG) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Logged: {eatenFats}g</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-[10px] border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                  <span>Calories Done</span>
                  <span className="text-emerald-700 font-bold">
                    {Math.round((eatenCalories / currentDiet.dailyCalories) * 100)}%
                  </span>
                </div>
                <p className="text-lg font-black text-slate-900">{eatenCalories} kcal</p>
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${Math.min((eatenCalories / currentDiet.dailyCalories) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Remaining: {Math.max(currentDiet.dailyCalories - eatenCalories, 0)}</span>
              </div>
            </div>

            {/* Coach Clinical Notes */}
            {currentDiet.trainerNotes && (
              <div className="p-3.5 bg-amber-50 rounded-[10px] border border-amber-200 text-xs">
                <p className="font-bold text-amber-900">Coach Instructions & Protocol:</p>
                <p className="text-amber-800 mt-1 leading-relaxed">{currentDiet.trainerNotes}</p>
              </div>
            )}
          </div>

          {/* Structured Meal Windows */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Daily Meal Windows & Prescribed Items</h3>
              <span className="text-xs text-slate-500 font-mono">
                {completedMeals.length} of {currentDiet.meals?.length || 0} Logged
              </span>
            </div>

            <div className="space-y-3">
              {currentDiet.meals?.map((meal) => (
                <div
                  key={meal.id}
                  className={`bg-white rounded-[10px] p-4 sm:p-5 border transition-all ${
                    meal.isCompleted ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-[6px] text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {meal.timeStr} • {meal.mealType}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{meal.name}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right text-xs font-mono font-bold text-slate-700">
                        {meal.calories} kcal <span className="text-slate-400 font-normal">| P: {meal.proteinG}g C: {meal.carbsG}g F: {meal.fatsG}g</span>
                      </div>

                      <button
                        onClick={() => toggleMealComplete(currentDiet.id, meal.id)}
                        className={`px-3 py-1.5 rounded-[8px] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          meal.isCompleted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{meal.isCompleted ? 'Logged' : 'Mark Eaten'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Bullet List of Meal Items */}
                  <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Prescribed Ingredients & Portions
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
                      {meal.items && meal.items.length > 0 ? (
                        meal.items.map((item, idx) => (
                          <li key={idx} className="leading-relaxed">
                            <span className="font-semibold text-slate-900">{item.name}</span>
                            <span className="text-slate-500 font-mono ml-1.5">({item.quantity})</span>
                            {item.calories && (
                              <span className="text-slate-400 text-[11px] ml-1">[{item.calories} kcal]</span>
                            )}
                          </li>
                        ))
                      ) : (
                        <li className="text-slate-500 italic">Standard portion matching macro targets.</li>
                      )}
                    </ul>

                    {meal.instructions && (
                      <p className="text-[11px] text-slate-500 mt-2 italic bg-white p-2 rounded-[6px] border border-slate-200">
                        Prep Note: {meal.instructions}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Workout Plan */}
      {activeTab === 'workout' && currentWorkout && (
        <div className="space-y-6">
          <div className="bg-white rounded-[10px] p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900">{currentWorkout.title}</h2>
                  <span className="px-2 py-0.5 rounded-[6px] text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                    {currentWorkout.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{currentWorkout.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView('active_workout')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] text-xs font-bold shadow-2xs cursor-pointer active:scale-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Workout Mode</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Frequency</span>
                <p className="text-base font-black text-slate-900 mt-0.5">{currentWorkout.daysPerWeek} Days / Wk</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Level</span>
                <p className="text-base font-black text-slate-900 mt-0.5">{currentWorkout.difficulty}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Logged</span>
                <p className="text-base font-black text-emerald-700 mt-0.5">{currentWorkout.daysLogged} Days</p>
              </div>
            </div>
          </div>

          {/* Days Accordion */}
          <div className="space-y-3">
            {currentWorkout.days.map((day) => {
              const isExpanded = expandedDayId === day.id;
              return (
                <div key={day.id} className="bg-white rounded-[10px] border border-slate-200 shadow-2xs overflow-hidden">
                  <button
                    onClick={() => setExpandedDayId(isExpanded ? null : day.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[8px] bg-slate-100 text-slate-800 font-black text-xs flex items-center justify-center border border-slate-200">
                        {day.dayNumber}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{day.name}</p>
                        <p className="text-[11px] text-slate-500">{day.targetMuscleGroups.join(', ')} • {day.exercises.length} Exercises</p>
                      </div>
                    </div>

                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {isExpanded && (
                    <div className="p-4 border-t border-slate-100 divide-y divide-slate-100 text-xs">
                      {day.exercises.map((ex, idx) => (
                        <div key={ex.id || idx} className="py-2.5 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-slate-900">{idx + 1}. {ex.name}</p>
                            <p className="text-[11px] text-slate-500">
                              {ex.category} • Rest: {ex.restTime} • {ex.instructions}
                            </p>
                          </div>
                          <div className="text-right font-mono font-bold text-slate-700">
                            {ex.sets} Sets × {ex.reps}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Print Document Modal */}
      {isPrintModalOpen && (
        <PrintDocumentModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          documentType={activeTab === 'diet' ? 'nutrition_plan' : 'nutrition_plan'}
          data={{
            dietPlan: currentDiet,
            workoutPlan: currentWorkout,
            customer: activeCustomer,
            trainer: activeTrainer,
          }}
        />
      )}
    </div>
  );
};
