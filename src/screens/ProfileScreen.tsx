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
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import QRCode from 'react-qr-code';
import { MaterialIcons } from '@expo/vector-icons';
import Clipboard from '@react-native-clipboard/clipboard';
import { useAppState } from '../hooks';
import { LikecoinLogo, Modal, useModal } from '../components';

export function ProfileScreen() {
  const { reset, wallet, storedWalletName, balance } = useAppState();
  const [address, setAddress] = useState('Unknown address');
  const qrCodeModalProps = useModal();
  const toast = useToast();
  const shortanAddress = `${address.slice(0, 12)}...${address.slice(-4)}`;
  const balanceStr = balance ? balance.shiftedBy(-9).toFixed(0, 0) : '0';

  const copyAddress = () => {
    if (address !== 'Unknown address') {
      Clipboard.setString(address);

      toast.show({
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
      <VStack
        space={4}
        alignItems="center"
        flex={1}
        justifyContent="space-between"
      >
        <VStack h="50%" space={2}>
          <TouchableOpacity onPress={() => qrCodeModalProps.show()}>
            <HStack alignItems="center" justifyContent="center">
              <Text fontSize="lg" fontWeight="bold" mr={1}>
                {storedWalletName}
              </Text>
              <Icon
                size="6"
                color="gray.500"
                as={<MaterialIcons name="qr-code" />}
              />
            </HStack>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => copyAddress()}>
            <HStack
              borderRadius="full"
              px={2}
              py={1}
              borderWidth={1}
              borderColor="gray.300"
              justifyContent="center"
              alignItems="center"
            >
              <Text color="gray.500" fontSize="sm" mr={1}>
                {shortanAddress}
              </Text>
              <Icon
                size="4"
                color="gray.500"
                as={<MaterialIcons name="content-copy" />}
              />
            </HStack>
          </TouchableOpacity>

          <Divider my="2" />

          <VStack space={1} alignItems="center" justifyContent="center">
            <LikecoinLogo width="36px" height="36px" />
            <Text fontSize="3xl" fontWeight="bold">
              {balanceStr} LIKE
            </Text>

            <IconButton
              mt={4}
              variant="solid"
              borderRadius="full"
              onPress={() => qrCodeModalProps.show()}
              icon={
                <Icon size="sm" as={<MaterialIcons name="file-download" />} />
              }
            />
            <Text fontSize="sm" color="primary">
              Receive
            </Text>
          </VStack>
        </VStack>

        <Box h="50%" w="100%">
          <Button
            onPress={() => handleOnLogout()}
            variant="outline"
            colorScheme="red"
          >
            Log Out
          </Button>
        </Box>
      </VStack>

      <Modal title="QR Code Preview" showFooter={false} {...qrCodeModalProps}>
        <Flex alignItems="center" p={4}>
          <QRCode value={address} />
        </Flex>
      </Modal>
    </View>
  );
}
