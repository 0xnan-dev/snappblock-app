import React, { useRef } from 'react';
import {Box, Button, Text} from 'native-base';
import { RNCamera } from 'react-native-camera';
import { useIpfs } from '../navigation/ipfs-http-client';
import { signISCNTxn } from '../lib/signIscnTxn';

const SnapshotScreen = () => {
  const cameraRef:any = useRef(null);
  const { client } = useIpfs();

  console.log('client', client)

  const takePicture = async () => {
    try {
      if (cameraRef) {
        const options = { quality: 0.5, base64: true };
        const data = await cameraRef!.current.takePictureAsync(options);
        await fetchPhoto(data, client)
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPhoto = async (photo:any, client:any) => {
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

      await signIscn(result?.cid?.toString())

    } catch (error) {
      console.error('Demo App .add photo', {error});
    }
  };

  const signIscn = async (cid: string) => {
    try {
      const payload = {
        title: '0xNan Demo',
        description: 'This is a description',
        tagsString: 'article',
        url: 'https://nnkken.github.io/post/recursive-relation/',
        license: 'https://creativecommons.org/licenses/by/4.0',
        ipfsHash: `ipfs://${cid}`,
        // fileSHA256: 'hash://sha256/9564b85669d5e96ac969dd0161b8475bbced9e5999c6ec598da718a3045d6f2e',
        authorNames: '0xNan',
        authorUrls: 'http://github.com/0xNan',
      };
  
      const address = 'cosmos135h665npk02kn99mayfwr77m44y9ruqq4ua9tc'; // digital ocean node address
      // const address = "cosmos1uqfcn4ppzlnus9cc5u5jekj2wrjexrs0c5gjs6"; // local node address
  
      await signISCNTxn(payload, address);
    } catch (err) {
      console.error(err)
    }
  }

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
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.debug(barcodes);
          }}
        />
        <Box style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <Button
            marginY="10px"
            colorScheme="primary"
            onPress={takePicture}>
            SNAP
          </Button>
        </Box>
      </Box>
  );
};
export default SnapshotScreen;
