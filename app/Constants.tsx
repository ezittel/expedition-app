import {QuestDetails} from './reducers/QuestTypes'

export const NODE_ENV = (process && process.env && process.env.NODE_ENV) || 'dev';
// Should be overriden via env vars to use local server
export const API_HOST = (process && process.env && process.env.API_HOST) || 'http://betaapi.expeditiongame.com';
export const AUTH_SETTINGS = {
  URL_BASE: API_HOST,
  API_KEY: 'AIzaSyCgvf8qiaVoPE-F6ZGqX6LzukBftZ6fJr8',
  SCOPES: 'profile email',
  // web:
  CLIENT_ID: (process && process.env && process.env.OAUTH2_CLIENT_ID) || '545484140970-jq9jp7gdqdugil9qoapuualmkupigpdl.apps.googleusercontent.com',
  // iOS: (REVERSE_CLIENT_ID) '545484140970-lgcbm3df469kscbngg2iof57muj3p588.apps.googleusercontent.com',
  // Android: '545484140970-qrhcn069bbvae1mub2237h5k32mnp04k.apps.googleusercontent.com',
  STRIPE: (NODE_ENV === 'production') ? 'pk_live_vcpOgs95UFKNV0kYOwj9JWPp' : 'pk_test_8SATEnwfIx0U2vkomn04kSou',
  RAVEN: 'https://990df74f1b58424395ec3d3ec6f79b42@sentry.io/420182',
};

const splitURL = API_HOST.split('/');
export const MULTIPLAYER_SETTINGS = {
  newSessionURI: API_HOST + '/multiplayer/v1/new_session',
  connectURI: API_HOST + '/multiplayer/v1/connect',
  firstLoadURI: API_HOST + '/multiplayer/v1/user',
  websocketSession: ((NODE_ENV === 'production') ? 'wss://' : 'ws://') + splitURL[splitURL.length-1] + '/ws/multiplayer/v1/session',
};

export const FEATURED_QUESTS: QuestDetails[] = [ // Featured quest ids generated from publishing, but don't leave them published!
  {id: '0B7K9abSH1xEOeEZSVVMwNHNqaFE', partition: 'expedition-public', theme: 'base', official: true, title: 'Learning to Adventure', summary: 'Your first adventure.', author: 'Todd Medema', publishedurl: 'quests/learning_to_adventure.xml', minplayers: 1, maxplayers: 6, mintimeminutes: 20, maxtimeminutes: 30, genre: 'Drama', contentrating: 'Everyone', language: 'English' },
  {id: '0B7K9abSH1xEOWVpEV1JGWDFtWmc', partition: 'expedition-public', theme: 'horror', official: true, title: 'Learning 2: The Horror', summary: 'Your first adventure continues with Expedition: The Horror.', author: 'Todd Medema', publishedurl: 'quests/learning_to_adventure_2_the_horror.xml', expansionhorror: true, minplayers: 1, maxplayers: 6, mintimeminutes: 20, maxtimeminutes: 40, genre: 'Drama', contentrating: 'Everyone', language: 'English' },
  {id: '0BzrQOdaJcH9MU3Z4YnE2Qi1oZGs', partition: 'expedition-public', theme: 'base', official: true, title: 'Oust Albanus', summary: 'Your party encounters a smelly situation.', author: 'Scott Martin', publishedurl: 'quests/oust_albanus.xml', minplayers: 1, maxplayers: 6, mintimeminutes: 20, maxtimeminutes: 40, genre: 'Comedy', contentrating: 'Everyone', language: 'English' },
  {id: '0B7K9abSH1xEORjdkMWtTY3ZtNGs', partition: 'expedition-public', theme: 'base', official: true, title: 'Mistress Malaise', summary: 'Mystery, Misfortune, and a Mistress.', author: 'Scott Martin', publishedurl: 'quests/mistress_malaise.xml', minplayers: 1, maxplayers: 6, mintimeminutes: 30, maxtimeminutes: 60, genre: 'Drama', contentrating: 'Everyone', language: 'English' },
  {id: '0B7K9abSH1xEOUUR1Z0lncm9NRjQ', partition: 'expedition-public', theme: 'base', official: true, title: 'Dungeon Crawl', summary: 'How deep can you delve?', author: 'Todd Medema', publishedurl: 'quests/dungeon_crawl.xml', minplayers: 1, maxplayers: 6, mintimeminutes: 20, maxtimeminutes: 60, genre: 'Drama', contentrating: 'Everyone'},
];
if (NODE_ENV === 'dev') { // http://quests.expeditiongame.com/#0B7K9abSH1xEOV3M2bTVMdWc4NVk
  FEATURED_QUESTS.unshift({id: '1', title: 'Test quest', summary: 'DEV', author: 'DEV', publishedurl: 'quests/test_quest.xml'});
}

export const MAX_ADVENTURER_HEALTH = 12;
export const MIN_FEEDBACK_LENGTH = 16;

export const UNSUPPORTED_BROWSERS = /^(.*amazon silk.*)|(.*(iphone|ipad|ipod|ios) os 9_.*)$/i;

export const URLS = {
  // lowercase to match lowercase platform names
  android: 'https://play.google.com/store/apps/details?id=io.fabricate.expedition',
  ios: 'https://itunes.apple.com/us/app/expedition-roleplaying-card/id1085063478?ls=1&mt=8',
  web: 'http://expeditiongame.com/app',
  QUEST_CREATOR: 'https://quests.expeditiongame.com/?utm_source=app',
};

export const INIT_DELAY = {
  SILENT_LOGIN_MILLIS: 1000,
  LOAD_AUDIO_MILLIS: 2000,
}

export const CARD_TRANSITION_ANIMATION_MS = 300;
export const VIBRATION_SHORT_MS = 30; // for navigation / card changes
export const VIBRATION_LONG_MS = 400; // for unique events, like start of the timer
export const NAVIGATION_DEBOUNCE_MS = 600;
export const DOUBLE_TAP_MS = 500; // Maximum ms between tap / clicks to count as a double click
export const AUDIO_COMMAND_DEBOUNCE_MS = 300;
export const MUSIC_INTENSITY_MAX = 36;

export const PLAYTIME_MINUTES_BUCKETS = [20, 30, 45, 60, 90, 120];

// Based on 4 players, scaling up / down on a curve
// since a bit more or less damage makes a huge difference in # of rounds survivable
export const PLAYER_DAMAGE_MULT: {[key: number]: number} = {
  1: 0.5,
  2: 0.5,
  3: 0.8,
  4: 1,
  5: 1.1,
  6: 1.2,
};

// Give solo players 2x time since they're controlling two adventurers
export const PLAYER_TIME_MULT: {[key: number]: number} = {
  1: 2,
  2: 1,
  3: 1,
  4: 1,
  5: 1,
  6: 1,
};

export const COMBAT_DIFFICULTY: {[key: string]: any} = {
  EASY: {
    surgePeriod: 4,
    damageMultiplier: 0.7,
    maxRoundDamage: 4,
  },
  NORMAL: {
    surgePeriod: 3,
    damageMultiplier: 1.0,
    maxRoundDamage: 6,
  },
  HARD: {
    surgePeriod: 3,
    damageMultiplier: 1.2,
    maxRoundDamage: 7,
  },
  IMPOSSIBLE: {
    surgePeriod: 2,
    damageMultiplier: 1.4,
    maxRoundDamage: 8,
  },
};

export const SPLASH_SCREEN_TIPS = [
  `Tip: You can change which expansions you're playing with in settings.`,
  `Tip: Enemies deal more damage over time, so try to win quickly!`,
  `Make sure to rate quests after you play them!`,
  `You can submit feedback at any time from the top right menu.`,
  `Write your own quests at quests.expeditiongame.com!`,
  `Tip: Turn your phone off silent to enjoy haptic vibration feedback.`,
  `Tip: Searching quests only shows quests for the number of players you select.`,
  `Did you know you can use the back of enemy cards as custom enemies?`,
  `To avoid untimely interruptions, make sure you have a phone charger handy!`
];

// A slight variation on the cubehelix pattern. This contains 6 categories,
// which is convenient for e.g. displaying 6 distinct character icons.
// https://jiffyclub.github.io/palettable/cubehelix/
// https://github.com/jiffyclub/palettable/blob/29ca166e8eb81797a5417d637f8d0b4901d4dbd0/palettable/cubehelix/cubehelix.py
export const COLORBLIND_FRIENDLY_PALETTE = [
  '#182044',
  '#0e5e4a',
  '#507d23',
  '#be7555',
  '#db8acb',
  '#bfc9fb',
];
