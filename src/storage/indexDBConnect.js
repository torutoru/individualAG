import { loadUserProfile } from "./profileManager";
import { GameTitles } from "../common/gameManager";
import { createDateFormatString, createTableTitleString } from "./storageUtils";
import localStorageDBConnect from "./localStorageDBConnect";

const DB_NAME = 'IndividualAGDB';
const DB_VERSION = 1;

let db;
const request = window.indexedDB.open(DB_NAME, DB_VERSION);

request.onerror = (event) => {
    console.error('IndexedDB error event', event);
    db = undefined;
};
request.onupgradeneeded = (event) => {
    db = event.target.result;

    const gameTableNames = Object.values(GameTitles);
    gameTableNames.forEach((tName) => {
        const objectStore = db.createObjectStore(createTableTitleString(tName), { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex("index_name_date", ["name", "date"], { unique: false });
        objectStore.createIndex("index_name", "name", { unique: false });
        objectStore.createIndex("index_date", "date", { unique: false });
    });
};
request.onsuccess = function (event) {
    db = event.target.result;
};

const findGameDataByNameAndDate = (tableStr, dbMode, userName, searchDate) => {
    return new Promise((resolve, reject) => {
        try {
            const transaction = db.transaction(tableStr, dbMode);
            const store = transaction.objectStore(tableStr);
            let index;
            if (userName && searchDate) {
                index = store.index("index_name_date");
            } else if (userName) {
                index = store.index("index_name");
            } else if (searchDate) {
                index = store.index("index_date");
            } else {
                throw new Error('No search criteria provided');
            }
            
            const request = index.getAll([userName, searchDate]);
            request.onsuccess = (e) => resolve(e.target.result);
            request.onerror = (e) => reject(e.target.error);
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    /**
     * 
     * @param {string} gameTitle 
     * @param {number} level 
     * @param {number} playTime 
     */
    insertGameData: async (gameTitle, level, playTime) => {
        const currentDateFormat = createDateFormatString(new Date());
        const userName = loadUserProfile().name;

        if (db) {
            if (gameTitle && Object.values(GameTitles).includes(gameTitle)) {
                try {
                    const tableStr = createTableTitleString(gameTitle);
                    const transaction = db.transaction(tableStr, 'readwrite');
                    const store = transaction.objectStore(tableStr);

                    store.add({ date: currentDateFormat, name: userName, level: level, playTime: playTime });
                } catch (error) {
                    console.error('Error inserting data:', error);
                    db = undefined;
                }
            }
        } else {
            // local storage
            console.log('DB is not ready');
            localStorageDBConnect.insertGameData(gameTitle, level, duringTime);
        }
    },

    /**
     * 
     * @param {string} gameTitle 
     * @param {string | undefined} userName
     * @param {Date | undefined} searchDate 
     */
    getGameData: async (gameTitle, userName, searchDate) => {
        const queryDate = createDateFormatString(searchDate || new Date());
        // const userName = loadUserProfile().name;

        if (gameTitle && Object.values(GameTitles).includes(gameTitle)) {
            if (db) {
                try {
                    const result = await findGameDataByNameAndDate(createTableTitleString(gameTitle), 'readonly', userName, queryDate);
                    return result;
                } catch (e) {
                    console.error('Error getGameData:', e);
                    db = null;
                }
            } else {
                return localStorageDBConnect.getGameData(gameTitle, searchDate);
            }
        }
        return [];
    }
};