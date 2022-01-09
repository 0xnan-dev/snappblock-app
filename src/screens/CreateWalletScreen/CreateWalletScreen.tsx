import React, { useState, useEffect } from 'react';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';

import { useAppState } from '../../hooks';
import { GenerateWalletView } from './GenerateWalletView';
import { SaveMneonicFormType, ShowMnemoicView } from './ShowMnemoicView';

export const CreateWalletScreen = () => {
  const { storeWallet, createWallet } = useAppState();
  const [wallet, setWallet] = useState<DirectSecp256k1HdWallet | null>(null);

  const handleOnGenerateWallet = async () => {
    const newWallet = await createWallet();

    setWallet(newWallet);
  };

  const handleOnSubmit = async ({ password }: SaveMneonicFormType) => {
    if (wallet) {
      await storeWallet(wallet, password);
    }
  };

  useEffect(() => {
    setWallet(null);
  }, []);

  return wallet && wallet.mnemonic ? (
    <ShowMnemoicView wallet={wallet} onSubmit={handleOnSubmit} />
  ) : (
    <GenerateWalletView onSubmit={handleOnGenerateWallet} />
  );
};
