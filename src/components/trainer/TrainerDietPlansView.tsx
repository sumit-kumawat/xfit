import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DietPlan, DietMeal, DietItem } from '../../types';
import {
  Apple,
  PlusCircle,
  Copy,
  UserCheck,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  CheckCircle2,
  Flame,
  Scale,
  Printer,
  Utensils,
  Droplet,
  ArrowUp,
  ArrowDown,
  Leaf,
  Layers,
  Plus,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { DangerConfirmModal } from '../common/DangerConfirmModal';
import { PrintDocumentModal } from '../common/PrintDocumentModal';

export const TrainerDietPlansView: React.FC = () => {
  const {
    activeTrainer,
    customers,
    dietPlans,
    selectedMemberId,
    setSelectedMemberId,
    createDietPlan,
    updateDietPlan,
    duplicateDietPlan,
    toggleDietPlanStatus,
    assignDietPlan,
    deleteDietPlan,
    addMealToPlan,
    showToast,
  } = useApp();

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [targetMealIdForNewItem, setTargetMealIdForNewItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'templates'>('all');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Danger Confirm Modal state
  const [dangerModalState, setDangerModalState] = useState<{
    isOpen: boolean;
    planId: string | null;
    planTitle: string;
  }>({
    isOpen: false,
    planId: null,
    planTitle: '',
  });

  // Form state for creating diet plan
  const [dietForm, setDietForm] = useState<{
    title: string;
    dietType: 'Vegetarian' | 'Non-Vegetarian';
    description: string;
    dailyCalories: number;
    targetProteinG: number;
    targetCarbsG: number;
    targetFatsG: number;
    trainerNotes: string;
    customerId: string;
  }>({
    title: 'Precision Athletic Macronutrient Protocol',
    dietType: 'Vegetarian',
    description: 'Targeted caloric and macronutrient split designed for metabolic efficiency.',
    dailyCalories: 2200,
    targetProteinG: 160,
    targetCarbsG: 210,
    targetFatsG: 65,
    trainerNotes: 'Hydrate with minimum 3.5 liters of water daily. Ensure meal windows are timed consistently.',
    customerId: selectedMemberId || 'cust-alex',
  });

  // Form state for adding meal
  const [mealForm, setMealForm] = useState<{
    mealType: 'Breakfast' | 'Mid-Morning' | 'Lunch' | 'Snack' | 'Dinner';
    timeStr: string;
    name: string;
    calories: number;
    proteinG: number;
    carbsG: number;
    fatsG: number;
    instructions: string;
  }>({
    mealType: 'Snack',
    timeStr: '03:30 PM',
    name: 'Mid-Afternoon Power Nutrition',
    calories: 380,
    proteinG: 28,
    carbsG: 45,
    fatsG: 9,
    instructions: 'Consume 30 minutes prior to resistance workout session.',
  });

  // Form state for adding item to meal
  const [itemForm, setItemForm] = useState({
    name: '',
    quantity: '',
    calories: 120,
  });

  const trainerCustomers = customers.filter(
    (c) => c.assignedTrainerId === activeTrainer.id || c.tenantId === activeTrainer.tenantId
  );

  const trainerDiets = dietPlans.filter(
    (p) => p.trainerId === activeTrainer.id || p.tenantId === activeTrainer.tenantId
  );

  const displayedDiets = trainerDiets.filter((p) => {
    if (activeTab === 'active') return p.status === 'active';
    if (activeTab === 'templates') return !p.customerId;
    return true;
  });

  const activePlan =
    trainerDiets.find((p) => p.id === selectedPlanId) ||
    trainerDiets.find((p) => p.customerId === selectedMemberId) ||
    trainerDiets[0];

  const assignedCustomer = customers.find((c) => c.id === activePlan?.customerId);

  // Macro calculation percentages
  const totalMacroGrams =
    (activePlan?.targetProteinG || 150) +
    (activePlan?.targetCarbsG || 200) +
    (activePlan?.targetFatsG || 60);

  const proteinPct = Math.round(((activePlan?.targetProteinG || 150) / totalMacroGrams) * 100);
  const carbsPct = Math.round(((activePlan?.targetCarbsG || 200) / totalMacroGrams) * 100);
  const fatsPct = 100 - proteinPct - carbsPct;

  const handleCreatePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dietForm.title.trim()) {
      showToast('Validation Error', 'Please enter a protocol title.', 'error');
      return;
    }

    createDietPlan({
      title: dietForm.title.trim(),
      dietType: dietForm.dietType,
      description: dietForm.description.trim(),
      dailyCalories: Number(dietForm.dailyCalories),
      targetProteinG: Number(dietForm.targetProteinG),
      targetCarbsG: Number(dietForm.targetCarbsG),
      targetFatsG: Number(dietForm.targetFatsG),
      trainerNotes: dietForm.trainerNotes.trim(),
      customerId: dietForm.customerId,
      trainerId: activeTrainer.id,
      tenantId: activeTrainer.tenantId,
      status: 'active',
      meals: [],
    });

    setShowCreateModal(false);
    showToast('Diet Protocol Created', 'New nutrition plan added to client records.', 'success');
  };

  const handleAddMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePlan) return;

    addMealToPlan(activePlan.id, {
      name: mealForm.name.trim(),
      mealType: mealForm.mealType,
      timeStr: mealForm.timeStr.trim(),
      calories: Number(mealForm.calories),
      proteinG: Number(mealForm.proteinG),
      carbsG: Number(mealForm.carbsG),
      fatsG: Number(mealForm.fatsG),
      instructions: mealForm.instructions.trim(),
      isCompleted: false,
      items: [
        {
          id: `item-${Date.now()}`,
          name: mealForm.name.trim(),
          quantity: '1 standard serving',
          calories: Number(mealForm.calories),
        },
      ],
    });

    setShowAddMealModal(false);
    showToast('Meal Window Added', `Added ${mealForm.name} to protocol.`, 'success');
  };

  // Reorder Meal Items (Move item up or down)
  const handleMoveMealItem = (mealId: string, itemIdx: number, direction: 'up' | 'down') => {
    if (!activePlan || !activePlan.meals) return;

    const updatedMeals = activePlan.meals.map((meal) => {
      if (meal.id !== mealId || !meal.items) return meal;

      const items = [...meal.items];
      const targetIdx = direction === 'up' ? itemIdx - 1 : itemIdx + 1;
      if (targetIdx < 0 || targetIdx >= items.length) return meal;

      const temp = items[itemIdx];
      items[itemIdx] = items[targetIdx];
      items[targetIdx] = temp;

      return {
        ...meal,
        items,
      };
    });

    updateDietPlan(activePlan.id, { meals: updatedMeals });
    showToast('Items Reordered', 'Updated portion sequence.', 'info');
  };

  // Remove item from a meal
  const handleRemoveMealItem = (mealId: string, itemIdx: number) => {
    if (!activePlan || !activePlan.meals) return;

    const updatedMeals = activePlan.meals.map((meal) => {
      if (meal.id !== mealId || !meal.items) return meal;
      return {
        ...meal,
        items: meal.items.filter((_, idx) => idx !== itemIdx),
      };
    });

    updateDietPlan(activePlan.id, { meals: updatedMeals });
    showToast('Item Removed', 'Prescribed ingredient removed from meal.', 'info');
  };

  // Add Item to existing Meal
  const handleAddItemToMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePlan || !activePlan.meals || !targetMealIdForNewItem) return;

    const updatedMeals = activePlan.meals.map((meal) => {
      if (meal.id !== targetMealIdForNewItem) return meal;
      const currentItems = meal.items || [];
      return {
        ...meal,
        items: [
          ...currentItems,
          {
            id: `item-${Date.now()}`,
            name: itemForm.name.trim(),
            quantity: itemForm.quantity.trim(),
            calories: Number(itemForm.calories),
          },
        ],
      };
    });

    updateDietPlan(activePlan.id, { meals: updatedMeals });
    setShowAddItemModal(false);
    setItemForm({ name: '', quantity: '', calories: 120 });
    setTargetMealIdForNewItem(null);
    showToast('Ingredient Added', 'Added prescribed item to meal window.', 'success');
  };

  const confirmDeletePlan = () => {
    if (!dangerModalState.planId) return;
    deleteDietPlan(dangerModalState.planId);
    setDangerModalState({ isOpen: false, planId: null, planTitle: '' });
    setSelectedPlanId(null);
    showToast('Plan Deleted', 'Diet protocol removed.', 'warning');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-[10px] border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Diet & Nutrition Hub</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-[6px] bg-slate-100 text-slate-700 border border-slate-200">
              {displayedDiets.length} Protocols
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Author Vegetarian & Non-Vegetarian clinical nutrition splits, meal windows, and ingredient portions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activePlan && (
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-[10px] text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
          )}

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] text-xs font-bold shadow-2xs cursor-pointer transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Protocol</span>
          </button>
        </div>
      </div>

      {/* Plan Selector & Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-[10px] border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {trainerDiets.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`px-3 py-1.5 rounded-[8px] text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activePlan?.id === plan.id
                  ? 'bg-[#a73827] text-white shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <span>{plan.title}</span>
              {plan.dietType && (
                <span className={`text-[9px] px-1 rounded ${
                  plan.dietType === 'Vegetarian' ? 'bg-emerald-800 text-emerald-100' : 'bg-rose-800 text-rose-100'
                }`}>
                  {plan.dietType}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Active Plan Detail & Meals Editor */}
      {activePlan ? (
        <div className="space-y-6">
          {/* Overview Card */}
          <div className="bg-white rounded-[10px] p-6 border border-slate-200 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900">{activePlan.title}</h2>
                  <span className={`px-2 py-0.5 rounded-[6px] text-[10px] font-bold ${
                    activePlan.dietType === 'Vegetarian'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {activePlan.dietType || 'Vegetarian'}
                  </span>
                  <span className="px-2 py-0.5 rounded-[6px] text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                    {activePlan.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Assigned to: <strong className="text-slate-800">{assignedCustomer?.fullName || 'Template (Unassigned)'}</strong> • {activePlan.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddMealModal(true)}
                  className="px-3 py-1.5 bg-[#a73827] text-white rounded-[8px] text-xs font-bold shadow-2xs cursor-pointer hover:bg-[#8f2f20]"
                >
                  + Add Meal Window
                </button>
                <button
                  onClick={() => setDangerModalState({ isOpen: true, planId: activePlan.id, planTitle: activePlan.title })}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-[8px] border border-rose-200 cursor-pointer"
                  title="Delete Protocol"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Macro Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Energy</span>
                <p className="text-base font-black text-slate-900 mt-0.5 font-mono">{activePlan.dailyCalories} kcal</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Protein ({proteinPct}%)</span>
                <p className="text-base font-black text-rose-700 mt-0.5 font-mono">{activePlan.targetProteinG}g</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Carbohydrates ({carbsPct}%)</span>
                <p className="text-base font-black text-blue-700 mt-0.5 font-mono">{activePlan.targetCarbsG}g</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Healthy Fats ({fatsPct}%)</span>
                <p className="text-base font-black text-amber-700 mt-0.5 font-mono">{activePlan.targetFatsG}g</p>
              </div>
            </div>

            {/* Coach Clinical Notes */}
            {activePlan.trainerNotes && (
              <div className="p-3.5 bg-amber-50 rounded-[8px] border border-amber-200 text-xs">
                <p className="font-bold text-amber-900">Coach Clinical Prescription:</p>
                <p className="text-amber-800 mt-1 leading-relaxed">{activePlan.trainerNotes}</p>
              </div>
            )}
          </div>

          {/* Meal Windows List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Configured Meal Windows & Portion Lists</h3>
              <span className="text-xs text-slate-500 font-mono">{activePlan.meals?.length || 0} Scheduled Windows</span>
            </div>

            <div className="space-y-3">
              {activePlan.meals?.map((meal) => (
                <div key={meal.id} className="bg-white rounded-[10px] border border-slate-200 p-5 shadow-2xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {meal.timeStr} • {meal.mealType}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{meal.name}</h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-slate-700">
                        {meal.calories} kcal <span className="text-slate-400 font-normal">| P:{meal.proteinG}g C:{meal.carbsG}g F:{meal.fatsG}g</span>
                      </span>

                      <button
                        onClick={() => {
                          setTargetMealIdForNewItem(meal.id);
                          setShowAddItemModal(true);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-[6px] text-xs font-bold cursor-pointer"
                      >
                        + Add Item
                      </button>
                    </div>
                  </div>

                  {/* Structured Bullet Point List of Ingredients */}
                  <div className="bg-slate-50 p-3 rounded-[8px] border border-slate-200 space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Prescribed Ingredients & Portions (Bullet List)
                    </p>

                    <div className="space-y-1.5">
                      {meal.items && meal.items.length > 0 ? (
                        meal.items.map((item, idx) => (
                          <div
                            key={item.id || idx}
                            className="flex items-center justify-between p-2 bg-white rounded-[6px] border border-slate-200 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#a73827] shrink-0" />
                              <span className="font-semibold text-slate-900">{item.name}</span>
                              <span className="text-slate-500 font-mono text-[11px]">({item.quantity})</span>
                              {item.calories && (
                                <span className="text-slate-400 text-[10px]">[{item.calories} kcal]</span>
                              )}
                            </div>

                            {/* Reorder and Delete Controls */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleMoveMealItem(meal.id, idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleMoveMealItem(meal.id, idx, 'down')}
                                disabled={idx === (meal.items?.length || 1) - 1}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleRemoveMealItem(meal.id, idx)}
                                className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                                title="Remove Item"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">No specific items listed. Tap "+ Add Item".</p>
                      )}
                    </div>

                    {meal.instructions && (
                      <p className="text-[11px] text-slate-500 italic mt-1 bg-white p-2 rounded-[6px] border border-slate-200">
                        Prep Note: {meal.instructions}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-[10px] border border-slate-200 text-slate-500 text-xs">
          No diet protocols found. Create your first clinical meal plan.
        </div>
      )}

      {/* Modal: Create Diet Plan */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Nutrition Protocol"
      >
        <form onSubmit={handleCreatePlanSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Protocol Title</label>
            <input
              type="text"
              required
              value={dietForm.title}
              onChange={(e) => setDietForm({ ...dietForm, title: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Diet Category</label>
              <select
                value={dietForm.dietType}
                onChange={(e) => setDietForm({ ...dietForm, dietType: e.target.value as any })}
                className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-bold"
              >
                <option value="Vegetarian">Vegetarian (Lacto-Ovo / Pure Veg)</option>
                <option value="Non-Vegetarian">Non-Vegetarian (High Protein / Lean Meats)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assign Client</label>
              <select
                value={dietForm.customerId}
                onChange={(e) => setDietForm({ ...dietForm, customerId: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
              >
                {trainerCustomers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName} ({c.tier})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Calories</label>
              <input
                type="number"
                value={dietForm.dailyCalories}
                onChange={(e) => setDietForm({ ...dietForm, dailyCalories: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Protein (g)</label>
              <input
                type="number"
                value={dietForm.targetProteinG}
                onChange={(e) => setDietForm({ ...dietForm, targetProteinG: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Carbs (g)</label>
              <input
                type="number"
                value={dietForm.targetCarbsG}
                onChange={(e) => setDietForm({ ...dietForm, targetCarbsG: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fats (g)</label>
              <input
                type="number"
                value={dietForm.targetFatsG}
                onChange={(e) => setDietForm({ ...dietForm, targetFatsG: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Instructions & Notes</label>
            <textarea
              value={dietForm.trainerNotes}
              onChange={(e) => setDietForm({ ...dietForm, trainerNotes: e.target.value })}
              rows={2}
              className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-[10px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-[#a73827] text-white rounded-[10px] shadow-2xs hover:bg-[#8f2f20] cursor-pointer"
            >
              Save Protocol
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Meal Window */}
      <Modal
        isOpen={showAddMealModal}
        onClose={() => setShowAddMealModal(false)}
        title="Add Meal Window to Protocol"
      >
        <form onSubmit={handleAddMealSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Meal Type</label>
              <select
                value={mealForm.mealType}
                onChange={(e) => setMealForm({ ...mealForm, mealType: e.target.value as any })}
                className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Mid-Morning">Mid-Morning</option>
                <option value="Lunch">Lunch</option>
                <option value="Snack">Snack</option>
                <option value="Dinner">Dinner</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Timing</label>
              <input
                type="text"
                value={mealForm.timeStr}
                onChange={(e) => setMealForm({ ...mealForm, timeStr: e.target.value })}
                required
                className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Window Title</label>
            <input
              type="text"
              required
              value={mealForm.name}
              onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Calories</label>
              <input
                type="number"
                value={mealForm.calories}
                onChange={(e) => setMealForm({ ...mealForm, calories: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Protein (g)</label>
              <input
                type="number"
                value={mealForm.proteinG}
                onChange={(e) => setMealForm({ ...mealForm, proteinG: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Carbs (g)</label>
              <input
                type="number"
                value={mealForm.carbsG}
                onChange={(e) => setMealForm({ ...mealForm, carbsG: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fats (g)</label>
              <input
                type="number"
                value={mealForm.fatsG}
                onChange={(e) => setMealForm({ ...mealForm, fatsG: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddMealModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-[10px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-[#a73827] text-white rounded-[10px] shadow-2xs hover:bg-[#8f2f20] cursor-pointer"
            >
              Save Meal Window
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Ingredient Item */}
      <Modal
        isOpen={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        title="Add Ingredient to Meal"
      >
        <form onSubmit={handleAddItemToMealSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ingredient / Food Item</label>
            <input
              type="text"
              required
              placeholder="e.g. Rolled Oats or Grilled Paneer"
              value={itemForm.name}
              onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Portion / Quantity</label>
              <input
                type="text"
                required
                placeholder="e.g. 75 grams / 1 cup"
                value={itemForm.quantity}
                onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Calories (kcal)</label>
              <input
                type="number"
                value={itemForm.calories}
                onChange={(e) => setItemForm({ ...itemForm, calories: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddItemModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-[10px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-[#a73827] text-white rounded-[10px] shadow-2xs hover:bg-[#8f2f20] cursor-pointer"
            >
              Add to Bullet List
            </button>
          </div>
        </form>
      </Modal>

      {/* Danger Confirm Modal */}
      <DangerConfirmModal
        isOpen={dangerModalState.isOpen}
        onClose={() => setDangerModalState({ isOpen: false, planId: null, planTitle: '' })}
        onConfirm={confirmDeletePlan}
        title={`Delete Nutrition Protocol: ${dangerModalState.planTitle}?`}
        message={`Are you sure you want to delete this nutrition protocol? Assigned clients will no longer have access to these meal windows.`}
        confirmText="Delete Protocol"
      />

      {/* Print Document Modal */}
      {activePlan && (
        <PrintDocumentModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          documentType="nutrition_plan"
          data={{
            dietPlan: activePlan,
            customer: assignedCustomer,
            trainer: activeTrainer,
          }}
        />
      )}
    </div>
  );
};
