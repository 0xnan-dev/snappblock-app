/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useRef} from 'react';
import {Box, Button} from 'native-base';
import {RNCamera} from 'react-native-camera';
import {useIpfs} from '../navigation/ipfs-http-client';
import {signISCNTxn} from '../lib/signIscnTxn';

const SnapshotScreen = () => {
  const cameraRef: any = useRef(null);
  const {client} = useIpfs();

  const takePicture = async () => {
    try {
      if (cameraRef) {
        const options = {quality: 0.5, base64: true};
        const data = await cameraRef!.current.takePictureAsync(options);
        await fetchPhoto(data, client);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPhoto = async (photo: any, client: any) => {
    // console.debug('photo', photo);
    try {
      const response = await fetch(photo.uri);
      const blob = await response.blob();
      const file = {
        path: photo.filename,
        content: blob,
      };
      const options = {
        wrapWithDirectory: true,
      };
      // console.debug('Demo App .add photo', {
      //   result: inspect(await client.add(file)),
      // });
      const result = await client.add(file, options);
      console.debug(
        `result --> ${result}`,
        result?.[0],
        result?.cid,
        result?.cid?.toString(),
      );
      const url = `https://ipfs.io/ipfs/${result?.cid?.toString()}`;
      console.debug(`Url --> ${url}`);

      await signIscn(result?.cid?.toString());
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
              name: '0xNan',
            },
            rewardProportion: 95,
            contributionType: 'http://schema.org/author',
          },
        ],
        type: 'Snapshot',
        name: '0xNan Demo',
        usageInfo: 'https://creativecommons.org/licenses/by/4.0',
        keywords: ['0xNan', 'snapshot'],
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
