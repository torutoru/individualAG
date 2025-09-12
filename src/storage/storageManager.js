import { GameTitles } from '../common/gameManager';
import IndexDBConnctor from './indexDBConnect';
import StorageConnector from './localStorageDBConnect';
import { loadUserProfile } from './profileManager';

const dataStore = !window.indexedDB ? StorageConnector : IndexDBConnctor;

const saveBlinkUserGameData = (gameLevel, playTime) => {
    dataStore.insertGameData(GameTitles.BLINK, gameLevel, playTime);
};

const getBlinkUserGameData = async () => {
    return dataStore.getGameData(GameTitles.BLINK, loadUserProfile().name, new Date());
}

export { saveBlinkUserGameData, getBlinkUserGameData };