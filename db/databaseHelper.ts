//db/databaseHelper.ts
import db from "./database";
import { Hike } from "./models/Hike";
import { Observation } from "./models/Observation";


const parseHikeRow = (row: any): Hike => ({
    ...row,
    parkingAvailable: !!row.parkingAvailable,
    length: parseFloat(row.length),
    images: JSON.parse(row.images || "[]"),
});


const parseObservationRow = (row: any): Observation => ({
    ...row,
    id: row.id,
    hikeId: row.hikeId,
    name: row.name,
    description: row.description,
});

export const hikeService = {
    addHike: async (hike: Hike): Promise<number> => {
        const result = await db.runAsync(
            `INSERT INTO Hike (name, location, date, parkingAvailable, length, difficulty, description, images)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                hike.name ?? null,
                hike.location ?? null,
                hike.date ?? null,
                hike.parkingAvailable ? 1 : 0,
                hike.length ?? null,
                hike.difficulty ?? null,
                hike.description ?? null,
                JSON.stringify(hike.images ?? []),
            ]
        );

        return result.lastInsertRowId;
    },

    getHikeById: async (id: number): Promise<Hike | null> => {
        const result = await db.getFirstAsync(`SELECT * FROM Hike WHERE id = ?`, [id]);
        if (!result) return null;
        return parseHikeRow(result);
    },


    getAllHikes: async (): Promise<Hike[]> => {
        const result = await db.getAllAsync(`SELECT * FROM Hike`);
        return result.map((row: any) => ({
            ...row,
            parkingAvailable: !!row.parkingAvailable,
            images: JSON.parse(row.images || "[]"),
        }));
    },

    updateHike: async (id: number, hike: Hike) => {
        await db.runAsync(
            `UPDATE Hike
       SET name = ?, location = ?, date = ?, parkingAvailable = ?, length = ?, difficulty = ?, description = ?, images = ?
       WHERE id = ?`,
            [
                hike.name ?? null,
                hike.location ?? null,
                hike.date ?? null,
                hike.parkingAvailable ? 1 : 0,
                hike.length ?? null,
                hike.difficulty ?? null,
                hike.description ?? null,
                JSON.stringify(hike.images ?? []),
                id,
            ]
        );
    },

    deleteHike: async (id: number) => {
        await db.runAsync(`DELETE FROM Hike WHERE id = ?`, [id]);
    },

    deleteAllHikes: async () => {
        await db.runAsync(`DELETE FROM Observation`);
        await db.runAsync(`DELETE FROM Hike`);
    },
};

export const observationService = {
    addObservation: async (obs: Observation) => {
        const result = await db.runAsync(
            `INSERT INTO Observation (name, description, hikeId) VALUES (?, ?, ?)`,
            [obs.name, obs.description, obs.hikeId]
        );
        return result.lastInsertRowId;
    },

    getObservationById: async (id: number): Promise<Observation | null> => {
        const result = await db.getFirstAsync(`SELECT * FROM Observation WHERE id = ?`, [id]);
        if (!result) return null;
        return parseObservationRow(result);
    },

    getObservationsByHike: async (hikeId: number): Promise<Observation[]> => {
        const result = await db.getAllAsync(`SELECT * FROM Observation WHERE hikeId = ?`, [hikeId]);
        return result.map(parseObservationRow);
    },
    updateObservation: async (id: number, obs: Observation) => {
        await db.runAsync(
            `UPDATE Observation
       SET name = ?, description = ?
       WHERE id = ?`,
            [obs.name, obs.description, id]
        );
    },
    deleteObservation: async (id: number) => {
        await db.runAsync(`DELETE FROM Observation WHERE id = ?`, [id]);
    },

    deleteObservationsByHike: async (hikeId: number) => {
        await db.runAsync(`DELETE FROM Observation WHERE hikeId = ?`, [hikeId]);
    }
};
