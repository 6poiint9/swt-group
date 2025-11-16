// logreg-fr/src/comps/assets/frpg/__tests__/logreg.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Logreg from '../logreg';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock fetch
global.fetch = jest.fn();

describe('Login Component Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const renderLoginComponent = () => {
    return render(
      <BrowserRouter>
        <Logreg />
      </BrowserRouter>
    );
  };

  // TEST CASE 1: Successful Login
  describe('Successful Login Flow', () => {
    it('should display success message and navigate on successful login', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        token: 'mock.jwt.token',
        username: 'testuser'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      renderLoginComponent();

      const usernameInput = screen.getByPlaceholderText('Username');
      const passwordInput = screen.getByPlaceholderText('Password');
      const loginButton = screen.getByRole('button', { name: /login/i });

      // Act
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(loginButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Login erfolgreich!')).toBeInTheDocument();
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/authenticateUser/login',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'testuser', password: 'password123' }),
        })
      );

      expect(localStorage.getItem('token')).toBe('mock.jwt.token');

      // Wait for navigation
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/myView');
      }, { timeout: 1500 });
    });
  });

  // TEST CASE 2: Failed Login
  describe('Failed Login Flow', () => {
    it('should display error message on invalid credentials', async () => {
      // Arrange
      const mockResponse = {
        success: false,
        message: 'invalid login'
      };

      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => mockResponse,
      });

      renderLoginComponent();

      const usernameInput = screen.getByPlaceholderText('Username');
      const passwordInput = screen.getByPlaceholderText('Password');
      const loginButton = screen.getByRole('button', { name: /login/i });

      // Act
      fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
      fireEvent.click(loginButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/Login fehlgeschlagen/i)).toBeInTheDocument();
      });

      expect(localStorage.getItem('token')).toBeNull();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should clear password field on failed login', async () => {
      // Arrange
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ success: false, message: 'invalid login' }),
      });

      renderLoginComponent();

      const passwordInput = screen.getByPlaceholderText('Password');
      const loginButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
      
      // Act
      fireEvent.click(loginButton);

      // Assert
      await waitFor(() => {
        expect(passwordInput.value).toBe('');
      });
    });
  });

  // TEST CASE 3: Network Error
  describe('Network Error Handling', () => {
    it('should display network error message when fetch fails', async () => {
      // Arrange
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      renderLoginComponent();

      const usernameInput = screen.getByPlaceholderText('Username');
      const passwordInput = screen.getByPlaceholderText('Password');
      const loginButton = screen.getByRole('button', { name: /login/i });

      // Act
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(loginButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Netzwerkfehler beim Login.')).toBeInTheDocument();
      });

      expect(localStorage.getItem('token')).toBeNull();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  // Additional Tests
  describe('Form Validation', () => {
    it('should render login form with all elements', () => {
      renderLoginComponent();

      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('should update input fields on user input', () => {
      renderLoginComponent();

      const usernameInput = screen.getByPlaceholderText('Username');
      const passwordInput = screen.getByPlaceholderText('Password');

      fireEvent.change(usernameInput, { target: { value: 'newuser' } });
      fireEvent.change(passwordInput, { target: { value: 'newpass' } });

      expect(usernameInput.value).toBe('newuser');
      expect(passwordInput.value).toBe('newpass');
    });
  });
});
