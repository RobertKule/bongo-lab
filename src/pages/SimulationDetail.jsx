import React, { lazy, Suspense } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import SimulationContainer from '../components/SimulationContainer';
import ErrorBoundary from '../components/ErrorBoundary';
import translations from '../utils/translations';

/** Lazy-load simulation components for better performance on low-end devices. */
const simulationComponents = {
  pendulum: lazy(() => import('../simulations/pendulum')),
  'inclined-plane': lazy(() => import('../simulations/inclined-plane')), 
  circuit: lazy(() => import('../simulations/Circuit')), 
  optics: lazy(() => import('../simulations/Optics')), 
  lever: lazy(() => import('../simulations/Lever')), 
};

/**
 * Route handler that loads the correct simulation by URL param.
 */
const SimulationDetail = () => {
  const { id } = useParams();
  const SimComponent = simulationComponents[id];

  if (!SimComponent) {
    return <Navigate to="/" replace />;
  }

  return (
    <SimulationContainer>
      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-400">{translations.status.loading}</p>
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
