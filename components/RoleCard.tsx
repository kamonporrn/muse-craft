
import React from 'react';

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  buttonText: string;
  variant: 'customer' | 'seller' | 'auctions';
}

const RoleCard: React.FC<RoleCardProps> = ({ icon, title, buttonText, variant }) => {
  return (
    <div className={`role-card role-card-${variant}`}>
      <div className={`role-card-icon-wrapper role-card-icon-${variant}`}>
        {icon}
      </div>
      <h3 className="role-card-title">{title}</h3>
      <button className={`role-card-button role-card-button-${variant}`}>
        {buttonText}
      </button>
    </div>
  );
};

export default RoleCard;