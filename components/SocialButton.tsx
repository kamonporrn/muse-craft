import React from 'react';

interface SocialButtonProps {
  icon: React.ReactNode;
  text: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon, text }) => {
  return (
    <button className="social-button">
      {icon}
      {text}
    </button>
  );
};

export default SocialButton;