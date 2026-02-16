// src/pages/SimulationDetail.jsx
import React, { lazy, Suspense } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import SimulationContainer from '../components/SimulationContainer';
import ErrorBoundary from '../components/ErrorBoundary';
import translations from '../utils/translations';

/** Lazy-load simulation components for better performance on low-end devices. */
const simulationComponents = {
  pendulum: lazy(() => import('../simulations/pendulum')),
  'inclined-plane': lazy(() => import('../simulations/InclinedPlane')), 
  circuit: lazy(() => import('../simulations/Circuit')), 
  optics: lazy(() => import('../simulations/Optics')), 
  lever: lazy(() => import('../simulations/Lever')), 
};

/**
 * Route handler that loads the correct simulation by URL param.
 */
const SimulationDetail = () => {
  const { id } = useParams();
  console.log('🔵 ID reçu:', id);
  console.log('📦 Composant disponible:', simulationComponents[id] ? 'Oui' : 'Non');
  
  const SimComponent = simulationComponents[id];

  if (!SimComponent) {
    console.log('🔴 Simulation non trouvée pour:', id);
    return <Navigate to="/" replace />;
  }

  return (
    <SimulationContainer>
      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64 dark:bg-slate-800">
              <div className="text-center">
                {/* Spinner animé */}
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4 dark:border-blue-400 dark:border-t-transparent"></div>
                <p className="text-gray-500 dark:text-gray-400">
                  {translations.status.loading}
                </p>
              </div>
            </div>
          }
        >
          <SimComponent />
        </Suspense>
      </ErrorBoundary>
    </SimulationContainer>
  );
};

export default SimulationDetail;