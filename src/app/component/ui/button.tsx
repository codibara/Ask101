import React, { ReactNode } from 'react';
import Link from 'next/link';

interface ButtonProp{
    text?: any,
    beforeIcon?: ReactNode;
    afterIcon?: ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    variant?: 'primary' | 'secondary' | 'tertiary';
    disabled?: Boolean;
    isLink: Boolean;
    href?: string;
    isLoading?: Boolean;
}

const Button = ({ text, beforeIcon, afterIcon, onClick, variant = 'primary', disabled = false, isLink = false, href = "#", isLoading = false}: ButtonProp) => {
  const baseClasses = `
    w-full md:max-w-[280px] h-[46px] flex flex-row justify-center items-center gap-2
    font-semibold transition duration-100 cursor-pointer
    disabled:cursor-not-allowed
  `;
  const variantClasses = {
    primary: `
      bg-main text-dark-950 rounded-xl border border-dark-900
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
  
  const content = (
      <>
        {isLoading && 
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="8"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
            className="opacity-75"
            fill="currentColor"
            d="M12 2a10 10 0 1 1-7.07 17.07l2.83-2.83A6 6 0 1 0 12 6V2z"
          />
          </svg>
        }
        {beforeIcon && <span>{beforeIcon}</span>}
        {text && <span>{text}</span>}
        {afterIcon && <span>{afterIcon}</span>}
      </>
  );

  if (isLink) {
    return (
        <Link href={href} className={`${baseClasses} ${variantClasses[variant]}`}>
          {content}
        </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading ? true : false}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {content}
    </button>
  );
    
    
};

export default Button;