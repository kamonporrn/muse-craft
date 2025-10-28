'use client';

import React from 'react';
import RoleCard from '../../components/RoleCard';
import { CustomerIcon, SellerIcon, AuctionIcon } from '../../components/icons';

const RolePage: React.FC = () => {
  return (
    <div className="role-container">
      <div className="role-content">
        <header className="role-header">
           <img 
            src="/musecraft_logo.png" 
            alt="Muse Craft Logo" 
            className="role-page-logo" 
          />
        </header>
        <h1 className="role-title">Welcome to Muse Craft</h1>

        <div className="role-cards-wrapper">
          <RoleCard
            icon={<CustomerIcon />}
            title="Customer"
            buttonText="Start Shopping"
            variant="customer"
          />
          <RoleCard
            icon={<SellerIcon />}
            title="Seller"
            buttonText="Start Selling"
            variant="seller"
          />
          <RoleCard
            icon={<AuctionIcon />}
            title="Auctions"
            buttonText="Start Bidding"
            variant="auctions"
          />
        </div>
      </div>
    </div>
  );
};

export default RolePage;
