import React, {RefObject, useRef} from 'react';
import {Box, Button} from 'native-base';
import {RNCamera} from 'react-native-camera';
import {useIPFS} from '../hooks';
import {signISCNTxn} from '../lib/signIscnTxn';

const SnapshotScreen = () => {
  const cameraRef = useRef() as RefObject<RNCamera>;
  const {upload} = useIPFS();

  const takePicture = async () => {
    if (!cameraRef.current) {
      return;
    }

    try {
      const options = {quality: 0.5, base64: true};
      const data = await cameraRef.current?.takePictureAsync(options);

      if (data) {
        const ipfsPath = await upload(data.uri);
        await signIscn(ipfsPath);
      }
    } catch (error) {
      console.error('Demo App .add photo', {error});
    }
  };

  const signIscn = async (cid: string) => {
    try {
      const payload = {
        contentFingerprints: [
          'hash://sha256/9564b85669d5e96ac969dd0161b8475bbced9e5999c6ec598da718a3045d6f2e',
        ],
        ipfsHash: `ipfs://${cid}`,
        stakeholders: [
          {
            entity: {
              '@id': 'did:cosmos:12zu5qe7mdkh45e3qhq768tpzwd90q8rjgp88cu',
              name: '0xNaN',
            },
            rewardProportion: 95,
            contributionType: 'http://schema.org/author',
          },
        ],
        type: 'Snapshot',
        name: '0xNaN Demo',
        usageInfo: 'https://creativecommons.org/licenses/by/4.0',
        keywords: ['0xNaN', 'snapshot'],
        description: 'This is a description',
      };

      await signISCNTxn(payload);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      <RNCamera
        ref={cameraRef}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onGoogleVisionBarcodesDetected={({barcodes}) => {
          console.debug(barcodes);
        }}
      />
      <Box style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
        <Button marginY="10px" colorScheme="primary" onPress={takePicture}>
          SNAP
        </Button>
      </Box>
    </Box>
  );
};
export default SnapshotScreen;
