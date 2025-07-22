import React, { ReactNode } from 'react';
import GoogleIcon from "../../../../public/icons8-google.svg";


interface LoginButtonProp{
    text?: any,
    beforeIcon?: ReactNode;
    afterIcon?: ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    variant?: 'primary' | 'secondary';
    disabled?: Boolean;
    isGoogle: Boolean;
}

const IconButton = ({ text, beforeIcon, afterIcon, onClick, variant = 'primary', disabled = false, isGoogle = true }: LoginButtonProp) => {
    const baseClasses = `
    w-full h-[50px] flex flex-row items-center gap-2 px-4
    font-medium text-sm transition duration-100 cursor-pointer rounded-md
    disabled:cursor-not-allowed
  `;
  const variantClasses = {
    primary: `
      bg-login-normal login-text-on-dark border border-main
      hover:bg-login-hover hover:text-gray-400
      active:bg-login-active
      disabled:bg-login-disabled disabled:text-gray-600
    `,
    secondary: `
      bg-login-secondary-normal text-login-text-on-white border border-login-stroke
      hover:bg-login-secondery-hover
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