import { FC } from 'react';
import { Flex } from 'native-base';

export interface MnemonicTagsProps extends React.ComponentProps<typeof Flex> {
  mnemonic: string;
}

export const MnemonicTags: FC<MnemonicTagsProps> = props => <Flex {...props} />;
