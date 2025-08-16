import React, { ReactNode } from 'react';
import GoogleIcon from "../../../../public/icons8-google.svg";


interface LoginButtonProp{
    text?: string;
    beforeIcon?: ReactNode;
    afterIcon?: ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
    isGoogle: boolean;
}

const IconButton = ({ text, beforeIcon, afterIcon, onClick, variant = 'primary', disabled = false, isGoogle = true }: LoginButtonProp) => {
    const baseClasses = `
    w-full h-[50px] flex flex-row items-center gap-2 px-4
    font-medium text-sm transition duration-100 cursor-pointer rounded-md
    disabled:cursor-not-allowed
  `;
  const variantClasses = {
    primary: `
      bg-dark-900 border border-main text-main
      hover:bg-main-hover hover:text-gray-900
      active:bg-gray-600 active: border-main-shade
      disabled:bg-login-disabled disabled:text-gray-600 disabled:brightness-50 disabled:border-dark-900 disabled:pointer-events-none
    `,
    secondary: `
      bg-login-secondary-normal text-gray-400
      hover:bg-gray-600
      active:bg-gray-500 active:text-dark-900
      disabled:bg-dark-900 disabled:text-gray-600 disabled:pointer-events-none
    `,
  };
  
    return(
        <button 
        onClick={onClick}
        disabled={disabled ? true : false}
        className={`${baseClasses} ${variantClasses[variant]}`}>
            {beforeIcon && <span>{beforeIcon}</span>}
            {isGoogle ? <img src={GoogleIcon.src} className='w-5 h-5'/> : ""}
            <span className={`flex-grow ${isGoogle || beforeIcon ? "-ml-5":""}`}>{text}</span>
            {afterIcon && <span>{afterIcon}</span>}
        </button>
    )
    
    
};

export default IconButton;