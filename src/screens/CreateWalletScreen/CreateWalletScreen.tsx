import React, { useState, useEffect, FC } from 'react';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { useAppState } from '../../hooks';
import { GenerateWalletView } from './GenerateWalletView';
import { ShowMnemonicView } from './ShowMnemonicView';
import { StackScreenProps } from '@react-navigation/stack';
import { WelcomeStackParamList } from '../../types';
import { SaveMneonicFormType } from './EncryptWalletModal';

export const CreateWalletScreen: FC<
  StackScreenProps<WelcomeStackParamList, 'CreateWallet'>
> = () => {
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
    <ShowMnemonicView wallet={wallet} onSubmit={handleOnSubmit} />
  ) : (
    <GenerateWalletView onSubmit={handleOnGenerateWallet} />
  );
};
