//db/databaseHelper.ts
import db from "./database";
import { Hike } from "./models/Hike";
import { Observation } from "./models/Observation";

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
};

export const observationService = {
    addObservation: async (obs: Observation) => {
        await db.runAsync(
            `INSERT INTO Observation (name, description, hikeId) VALUES (?, ?, ?)`,
            [obs.name, obs.description, obs.hikeId]
        );
    },

    getObservationsByHike: async (hikeId: number) => {
        return await db.getAllAsync(`SELECT * FROM Observation WHERE hikeId = ?`, [hikeId]);
    },
    updateObservation: async (id: number, obs: Observation) => {
        await db.runAsync(
            `UPDATE Observation
     SET name = ?, description = ?, hikeId = ?
     WHERE id = ?`,
            [obs.name, obs.description, obs.hikeId, id]
        );
    },
    deleteObservation: async (id: number) => {
        await db.runAsync(`DELETE FROM Observation WHERE id = ?`, [id]);
    },

    deleteObservationsByHike: async (hikeId: number) => {
        await db.runAsync(`DELETE FROM Observation WHERE hikeId = ?`, [hikeId]);
    }
};
