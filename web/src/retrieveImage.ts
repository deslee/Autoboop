import geohash from 'ngeohash'
import { db } from './firebase'
import uniqueRandomArray from 'unique-random-array'

export default async function retrieveImage(x: number, y: number) {
    if (x > 1) {
        x /= 100
    }
    if (y > 1) {
        y /= 100
    }
    const latitude = -180 + 360*x
    const longitude = -180 + 360*y

    let precision = 8;
    while (precision > 1) {
        const hash = geohash.encode(latitude, longitude)
        let snapshot = await db.collection('cats').where('mouth.hash', '>=', hash).limit(15).get()
        if (snapshot.size === 0) {
            // check the neighbors
            const neighbors = geohash.neighbors(hash)
            const randomNeighbor = uniqueRandomArray(neighbors)
            for (var i = 0; i < neighbors.length; ++i) {
                const neighbor = randomNeighbor();
                const neighborSnapshot = await db.collection('cats').where('mouth.hash', '>=', neighbor).orderBy('mouth.hash', 'asc').limit(15).get()
                if (neighborSnapshot.size > 0) {
                    snapshot = neighborSnapshot
                }
            }

            if (snapshot.size === 0) {
                precision--;
                continue;
            }
        }
        const random = uniqueRandomArray(snapshot.docs)
        const cat = random()
        const mouth = cat.data().mouth
        return {
            fileName: cat.id,
            ...mouth
        }
    }

    return undefined;
}