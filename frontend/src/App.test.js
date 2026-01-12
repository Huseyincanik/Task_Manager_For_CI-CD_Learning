import { render, screen } from '@testing-library/react';
import App from './App';

test('renders DevOps Task Manager heading', () => {
    render(<App />);
    const headingElement = screen.getByText(/DevOps Task Manager/i);
    expect(headingElement).toBeInTheDocument();
});
