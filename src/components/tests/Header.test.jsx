import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../Header';
import '@testing-library/jest-dom';


test('renders header text', () => {
  render(<Header />);
  const headerElement = screen.getByText(/my tasks/i); // Match the actual text in the Header component
  expect(headerElement).toBeInTheDocument();
});

test('renders the leaf icon', () => {
  render(<Header />);
  const imgElement = screen.getByAltText(/leaf icon/i); // Match the alt text of the image
  expect(imgElement).toBeInTheDocument();
});