# SnappBlock

![Snappblock](/snappblock.png)

Aiming at provide provenance and trustable photo content, the app directly upload image taken from smart phone camera to IPFS, and indexing the metadata with [LikeCoin chain's ISCN](https://docs.like.co/developer/international-standard-content-number-iscn).

## About this project

### Inspiration

Bitcoin value is comes from blockchain technology which a non-tamperable ledger, and we think photos is a media that delivers a valuable story, but you cannot tell is it a true story behind the photo that you found on internet.

### What it does

Upload the original photo taken by your phone camera to a decentralized storage and indexing the metadata with Likecoin's ISCN.

### How we built it

The app will be launched on IOS and Android, build with React Native with IPFS and ISCN integration

### Challenges we ran into

Since Keplr still have not supports Likechain, the app cannot utilize wallet connect to sign message, so we have to implement the wallet feature by ourselves.

### Accomplishments that we're proud of

This would be a first photo app ride on ISCN.

### What we learned

Gained more understanding of IPFS, Cosmos wallet implement.

## What's next for SnappBlock

- [ ] Integrate Like feature to reward content creators
- [ ] Adopt wallet connect with 3rd party wallets
- [ ] Better explorer feature

## Development

### start local IPFS Daemon

```
ipfs daemon
```

### start react native

```
npx react-native start
```

### start ios simulator

```
npx react-native run-ios
```
