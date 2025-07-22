import React, { ReactNode } from 'react';

interface ButtonProp{
    text?: any,
    beforeIcon?: ReactNode;
    afterIcon?: ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    variant?: 'primary' | 'secondary' | 'tertiary';
    disabled?: Boolean;
}

const Button = ({ text, beforeIcon, afterIcon, onClick, variant = 'primary', disabled = false }: ButtonProp) => {
    const baseClasses = `
    w-full h-[46px] flex flex-row justify-center items-center gap-2
    font-semibold transition duration-100 cursor-pointer
    disabled:cursor-not-allowed
  `;
  const variantClasses = {
    primary: `
      bg-main text-dark-950 rounded-xl 
      hover:bg-main-shade hover:text-gray-400
      active:bg-main-shade-secondary
      disabled:bg-dark-900 disabled:text-gray-600
    `,
    secondary: `
      bg-dark-950 text-main border border-main rounded-xl 
      hover:bg-dark-900 hover:text-gray-400 hover:border-0
      active:bg-gray-600 active:text-gray-400 active:border-0
      disabled:bg-dark-900  disabled:text-gray-600 disabled:border-0
    `,
    tertiary: `
      w-min h-min p-3 rounded-md
      hover:bg-dark-900
      active:bg-gray-600 active:text-gray-400 
      disabled:bg-dark-900  disabled:text-gray-600
    `,
  };
  
    return(
        <button 
        onClick={onClick}
        disabled={disabled ? true : false}
        className={`${baseClasses} ${variantClasses[variant]}`}>
            {beforeIcon && <span>{beforeIcon}</span>}
            {text && <span>{text}</span>}
            {afterIcon && <span>{afterIcon}</span>}
        </button>
    )
    
    
};

export default Button;