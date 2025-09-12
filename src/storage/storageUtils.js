const createTableTitleString = (gameTitle) => {
    return gameTitle + '_data';
};

const createDateFormatString = (date) => {
    if (date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }
    return null;
};

export { createTableTitleString, createDateFormatString };