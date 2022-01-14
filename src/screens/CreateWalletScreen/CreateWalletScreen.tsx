import React, { useState, useEffect, FC } from 'react';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { StackScreenProps } from '@react-navigation/stack';
import { useAppState } from '../../hooks';
import { WelcomeStackParamList } from '../../types/navigation';
import { GenerateWalletView } from './GenerateWalletView';
import { ShowMnemonicView } from './ShowMnemonicView';
import { SaveMneonicFormType } from './EncryptWalletModal';

export const CreateWalletScreen: FC<
  StackScreenProps<WelcomeStackParamList, 'CreateWallet'>
> = () => {
  const { isLoading, storeWallet, createWallet } = useAppState();
  const [wallet, setWallet] = useState<DirectSecp256k1HdWallet | null>(null);

  const handleOnGenerateWallet = async () => {
    const newWallet = await createWallet();

    setWallet(newWallet);
  };

  const handleOnSubmit = async ({
    walletName,
    password,
  }: SaveMneonicFormType) => {
    if (wallet) {
      await storeWallet(walletName, wallet, password);
    }
  };

  useEffect(() => {
    setWallet(null);
  }, []);

  return wallet && wallet.mnemonic ? (
    <ShowMnemonicView
      isLoading={isLoading}
      wallet={wallet}
      onSubmit={handleOnSubmit}
    />
  ) : (
    <GenerateWalletView onSubmit={handleOnGenerateWallet} />
  );
};
