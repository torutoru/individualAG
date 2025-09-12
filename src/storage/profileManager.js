
const AGE_KEY = 'user_age';
const NAME_KEY = 'user_name';

const saveUserProfile = (age, name) => {
  if (age) {
    localStorage.setItem(AGE_KEY, age);
  } else {
    localStorage.setItem(AGE_KEY, 'Unknown');
  }

  if (name) {
    localStorage.setItem(NAME_KEY, name);
  } else {
    localStorage.setItem(NAME_KEY, 'Unknown');
  }
};

const loadUserProfile = () => {
    const name = localStorage.getItem(NAME_KEY) || 'Unknown';
    const age = localStorage.getItem(AGE_KEY) || 'Unknown';
    return { name, age };
};

export { saveUserProfile, loadUserProfile };