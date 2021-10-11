import Config from "react-native-config";

export const timestampToString = (create_at: number, suffix?: boolean): string => {
    let diffTime: string | number = (new Date().getTime() - (create_at || 0)) / 1000
    if (diffTime < 60) diffTime = 'Just now'
    else if (diffTime > 60 && diffTime < 3600) {
        diffTime = Math.floor(diffTime / 60)
            + (Math.floor(diffTime / 60) > 1 ? (suffix ? ' minutes' : 'm') : (suffix ? ' minute' : 'm')) + (suffix ? ' ago' : '')
    } else if (diffTime > 3600 && diffTime / 3600 < 24) {
        diffTime = Math.floor(diffTime / 3600)
            + (Math.floor(diffTime / 3600) > 1 ? (suffix ? ' hours' : 'h') : (suffix ? ' hour' : 'h')) + (suffix ? ' ago' : '')
    }
    else if (diffTime > 86400 && diffTime / 86400 < 30) {
        diffTime = Math.floor(diffTime / 86400)
            + (Math.floor(diffTime / 86400) > 1 ? (suffix ? ' days' : 'd') : (suffix ? ' day' : 'd')) + (suffix ? ' ago' : '')
    } else {
        diffTime = new Date(create_at || 0).toDateString()
    }
    return diffTime
}

export const generateUsernameKeywords = (fullText: string): string[] => {
    const keywords: string[] = []
    const splitedText = fullText.split('')
    splitedText.map((s, index) => {
        const temp = splitedText.slice(0, index + 1).join('')
        keywords.push(temp)
    })
    return Array.from(new Set(keywords))
}

export const uriToBlob = (uri: string) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function () {
            reject(new Error('uriToBlob failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });
}
export type MapBoxAddress = {
    id?: string,
    place_name?: string,
    keyword?: string[],
    avatarURI?: string,
    sources?: number[],
    storySources?: number[],
    center?: [number, number]
}
export const searchLocation = (query: string): Promise<MapBoxAddress[]> => {
    return new Promise((resolve, reject) => {
        fetch(`http://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(query.trim())}.json?access_token=${Config.MAPBOX_ACCESS_TOKEN}`)
            .then(res => res.json())
            .then(data => {
                const address: MapBoxAddress[] = []
                const result: {
                    features: MapBoxAddress[]
                } = data
                result.features.map(feature => {
                    address.push({
                        id: feature.id,
                        place_name: feature.place_name,
                        center: feature.center
                    })
                })
                resolve(address)
            })
            .catch(err => reject(err))
    })
}
export const convertToFirebaseDatabasePathName = (text: string) => {
    return text.replace(/\./g, "!").replace(/#/g, "@")
        .replace(/\$/g, "%").replace(/\[/g, "&")
        .replace(/\]/g, "*")
}
export const revertFirebaseDatabasePathName = (text: string) => {
    return text.replace(/\!/g, ".").replace(/\@/g, "#")
        .replace(/\%/g, "$").replace(/\&/g, "[")
        .replace(/\*/g, "]")
}
export function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}