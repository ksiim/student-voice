import React, { useState } from 'react';
import styles from './Collapsible.module.scss';
import clsx from 'clsx';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean; // Новый пропс
}

const Collapsible: React.FC<CollapsibleProps> = ({
                                                   title,
                                                   children,
                                                   className,
                                                   defaultOpen = false,
  
                                                 }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const toggleCollapsible = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className={clsx(styles.collapsible, className)}>
      <button
        className={clsx(
          styles.collapsibleHeader,
          isOpen && styles.open
        )}
        onClick={toggleCollapsible}
        type="button"
      >
        <span className={styles.title}>{title}</span>
        <span className={styles.arrow}>{'>'}</span>
      </button>
      
      <div
        className={clsx(
          styles.collapsibleContent,
          isOpen && styles.visible
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Collapsible;