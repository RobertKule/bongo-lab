import React from 'react';
import { Battery, Zap, Lightbulb, Trash2, Move } from 'lucide-react';

const ComponentPalette = ({ onAddComponent, onRemoveComponent, components }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl p-6 border border-slate-100 dark:border-slate-800">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Move size={18} /> Composants
      </h3>
      
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          onClick={() => onAddComponent('battery', 200, 200)}
          className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 transition-colors group"
          title="Ajouter une pile (9V)"
        >
          <Battery className="mx-auto text-green-600 group-hover:scale-110 transition-transform" size={28} />
          <span className="text-xs mt-1 block font-medium">Pile</span>
        </button>
        
        <button
          onClick={() => onAddComponent('resistor', 400, 200)}
          className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl hover:bg-amber-100 transition-colors group"
          title="Ajouter une résistance (100Ω)"
        >
          <Zap className="mx-auto text-amber-600 group-hover:scale-110 transition-transform" size={28} />
          <span className="text-xs mt-1 block font-medium">Résistance</span>
        </button>
        
        <button
          onClick={() => onAddComponent('bulb', 300, 300)}
          className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl hover:bg-yellow-100 transition-colors group"
          title="Ajouter une ampoule"
        >
          <Lightbulb className="mx-auto text-yellow-600 group-hover:scale-110 transition-transform" size={28} />
          <span className="text-xs mt-1 block font-medium">Ampoule</span>
        </button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        <h4 className="text-sm font-semibold text-slate-500 mb-2 flex justify-between">
          <span>Composants placés</span>
          <span className="text-xs">({components.length})</span>
        </h4>
        {components.map(comp => (
          <div key={comp.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div className="flex items-center gap-2">
              {comp.type === 'battery' && <Battery size={16} className="text-green-600" />}
              {comp.type === 'resistor' && <Zap size={16} className="text-amber-600" />}
              {comp.type === 'bulb' && <Lightbulb size={16} className="text-yellow-600" />}
              <span className="text-sm capitalize">{comp.type}</span>
              <span className="text-xs bg-slate-200 dark:bg-slate-600 px-1.5 py-0.5 rounded">
                {comp.value}{comp.type === 'battery' ? 'V' : 'Ω'}
              </span>
            </div>
            <button
              onClick={() => onRemoveComponent(comp.id)}
              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
              title="Supprimer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        
        {components.length === 0 && (
          <p className="text-center text-slate-400 text-sm py-4">
            Clique sur les composants pour les ajouter
          </p>
        )}
      </div>
    </div>
  );
};

export default ComponentPalette;