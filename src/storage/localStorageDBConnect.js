import { loadUserProfile } from "./profileManager";
import { GameTitles } from "../common/gameManager";
import { createDateFormatString, createTableTitleString } from "./storageUtils";



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

        if (gameTitle && Object.values(GameTitles).includes(gameTitle)) {
            const tableStr = createTableTitleString(gameTitle);
            const gameData = JSON.parse(localStorage.getItem(tableStr) || '[]');

            gameData.push({ date: currentDateFormat, name: userName, level: level, playTime: playTime });

            localStorage.setItem(tableStr, JSON.stringify(gameData));
        }
    },

    /**
         * 
         * @param {string} gameTitle 
         * @param {string | undefined} userName
         * @param {Date | undefined} searchDate 
         */
    getGameData: async (gameTitle, userName, searchDate) => {
        const currentDateFormat = createDateFormatString(searchDate || new Date());

        if (gameTitle && Object.values(GameTitles).includes(gameTitle)) {
            const tableStr = createTableTitleString(gameTitle);
            const gameData = JSON.parse(localStorage.getItem(tableStr) || '[]');
            const result = [];

            let searchMode;
            if (userName && searchDate) {
                searchMode = 0;
            } else if (userName) {
                searchMode = 1;
            } else if (searchDate) {
                searchMode = 2;
            } else {
                return gameData;
            }

            gameData.forEach((data) => {
                switch (searchMode) {
                    case 0:
                        // user, date
                        if (data.name === user && data.date === currentDateFormat) {
                            result.push(data);
                        }
                        break;
                    case 1:
                        // user
                        if (data.name === user) {
                            result.push(data);
                        }
                        break;
                    default:
                        // date
                        if (data.date === currentDateFormat) {
                            result.push(data);
                        }
                        break;
                }
            });
            return result;
        }
        return [];
    }
};