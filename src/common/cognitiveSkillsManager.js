
const SkillTypes = {
    MEMORY: 1,
    ATTENTION: 2,
    LANGUAGE: 3,
    SPATIAL: 4,
    AGILITY: 5
}

const getSkillTypeName = (type) => {
    switch (type) {
        case SkillTypes.MEMORY:
            return "기억력";
        case SkillTypes.ATTENTION:
            return "주의력";
        case SkillTypes.LANGUAGE:
            return "언어력";
        case SkillTypes.SPATIAL:
            return "시공간력";
        case SkillTypes.AGILITY:
            return "순발력";
        default:
            return "UNKNOWN";
    }
}

export { SkillTypes, getSkillTypeName };