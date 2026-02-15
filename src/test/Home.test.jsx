import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe('Home Page', () => {
  it('renders the greeting', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('Bonjour, Professeur !')).toBeInTheDocument();
  });

  it('renders all 5 simulation cards', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('Pendule Simple')).toBeInTheDocument();
    expect(screen.getByText('Plan Incliné')).toBeInTheDocument();
    expect(screen.getByText('Circuit Électrique')).toBeInTheDocument();
    expect(screen.getByText('Réflexion de la Lumière')).toBeInTheDocument();
    expect(screen.getByText('Levier Mécanique')).toBeInTheDocument();
  });

  it('renders Commencer buttons for each simulation', () => {
    renderWithRouter(<Home />);
    const buttons = screen.getAllByText('Commencer');
    expect(buttons).toHaveLength(5);
  });

  it('renders the floating action button', () => {
    renderWithRouter(<Home />);
    expect(screen.getByLabelText('Ajouter une simulation')).toBeInTheDocument();
  });
});
