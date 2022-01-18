import {
  Icon,
  Flex,
  Text,
  Box,
  Button,
  View,
  VStack,
  HStack,
  Divider,
  IconButton,
  useToast,
  Pressable,
  useDisclose,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { MaterialIcons } from '@expo/vector-icons';
import Clipboard from '@react-native-clipboard/clipboard';
import { StatusBar } from 'expo-status-bar';
import { useAppState } from '../hooks';
import { LikecoinLogo, Modal } from '../components';

export function ProfileScreen() {
  const { reset, wallet, storedWalletName, balance } = useAppState();
  const [address, setAddress] = useState('Unknown address');
  const qrCodeModalProps = useDisclose();
  const toast = useToast();
  const shortanAddress = `${address.slice(0, 12)}...${address.slice(-4)}`;
  const balanceStr = balance ? balance.shiftedBy(-9).toFixed(0, 0) : '0';

  const copyAddress = () => {
    if (address !== 'Unknown address') {
      Clipboard.setString(address);

      toast.show({
        placement: 'top',
        description: 'Copied!',
      });
    }
  };

  const handleOnLogout = () => {
    reset();
  };

  useEffect(() => {
    if (wallet) {
      wallet.getAccounts().then(account => {
        setAddress(account[0].address);
      });
    }
  }, [wallet]);

  return (
    <View flex={1}>
      <StatusBar style="dark" />
      <VStack
        alignItems="center"
        flex={1}
        justifyContent="space-between"
        space={4}
      >
        <VStack space={2}>
          <Pressable onPress={() => qrCodeModalProps.onOpen()}>
            <HStack alignItems="center" justifyContent="center">
              <Text fontSize="lg" fontWeight="bold" mr={1}>
                {storedWalletName}
              </Text>
              <Icon
                as={<MaterialIcons name="qr-code" />}
                color="gray.500"
                size="6"
              />
            </HStack>
          </Pressable>

          <Pressable onPress={() => copyAddress()}>
            <HStack
              alignItems="center"
              borderColor="gray.300"
              borderRadius="full"
              borderWidth={1}
              justifyContent="center"
              px={2}
              py={1}
            >
              <Text color="gray.500" fontSize="sm" mr={1}>
                {shortanAddress}
              </Text>
              <Icon
                as={<MaterialIcons name="content-copy" />}
                color="gray.500"
                size="4"
              />
            </HStack>
          </Pressable>

          <Divider my="2" />

          <VStack alignItems="center" justifyContent="center" space={1}>
            <LikecoinLogo height="36pt" width="36pt" />
            <Text fontSize="3xl" fontWeight="bold">
              {balanceStr} LIKE
            </Text>

            <IconButton
              borderRadius="full"
              icon={
                <Icon as={<MaterialIcons name="file-download" />} size="sm" />
              }
              mt={4}
              variant="solid"
              onPress={() => qrCodeModalProps.onOpen()}
            />
            <Text color="primary" fontSize="sm">
              Receive
            </Text>
          </VStack>
        </VStack>

        <Box alignItems="center" flex={1} justifyContent="center" w="100%">
          <Button
            colorScheme="red"
            variant="outline"
            w="100%"
            onPress={() => handleOnLogout()}
          >
            Log Out
          </Button>
        </Box>
      </VStack>

      <Modal showFooter={false} title="QR Code Preview" {...qrCodeModalProps}>
        <Flex alignItems="center" p={4}>
          <QRCode value={address} />
        </Flex>
      </Modal>
    </View>
  );
}
