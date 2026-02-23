import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ label, onPress, variant = 'primary' }) => {
  return (
    <button 
      onClick={onPress}
      className={`${styles.button} ${styles[variant]}`}
    >
      {label}
    </button>
  );
};
