import * as React from 'react'
import Truncate from 'react-truncate'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import DoneIcon from '@material-ui/icons/Done'
import StarsIcon from '@material-ui/icons/Stars'
import Button from '../base/Button'
import Card from '../base/Card'
import Checkbox from '../base/Checkbox'
import StarRating from '../base/StarRating'
import {SearchSettings, SearchPhase, SearchState, SettingsType, UserState} from '../../reducers/StateTypes'
import {QuestDetails} from '../../reducers/QuestTypes'
import {PLAYTIME_MINUTES_BUCKETS} from '../../Constants'
import {CONTENT_RATING_DESC, GenreType, LANGUAGES} from 'expedition-qdl/lib/schema/Constants'

const Moment = require('moment');

export interface SearchStateProps extends SearchState {
  isDirectLinked: boolean;
  phase: SearchPhase;
  search: SearchSettings;
  settings: SettingsType;
  user: UserState;
}

export interface SearchDispatchProps {
  onLoginRequest: (subscribe: boolean) => void;
  onFilter: () => void;
  onSearch: (search: SearchSettings, settings: SettingsType) => void;
  onQuest: (quest: QuestDetails) => void;
  onPlay: (quest: QuestDetails, isDirectLinked: boolean) => void;
  onReturn: () => void;
}

export interface SearchProps extends SearchStateProps, SearchDispatchProps {};


// We make this a react component to hold a bit of state and avoid sending
// redux actions for every single change to input.
export interface SearchSettingsCardProps {
  user: UserState;
  search: SearchSettings;
  settings: SettingsType;
  onSearch: (search: SearchSettings, settings: SettingsType) => void;
}

export class SearchSettingsCard extends React.Component<SearchSettingsCardProps, {}> {
  state: SearchSettings;

  constructor(props: SearchSettingsCardProps) {
    super(props)
    this.state = this.props.search;
  }

  onChange(attrib: string, value: any) {
    this.setState({[attrib]: value});
  }

// TODO remove the clutter here / move to Theme.tsx
  render() {
    const rating = (this.state.contentrating) ? CONTENT_RATING_DESC[this.state.contentrating] : undefined;
    const timeBuckets = PLAYTIME_MINUTES_BUCKETS.map((minutes: number, index: number) => {
      return <MenuItem key={index} value={minutes}>{`${minutes} min`}</MenuItem>;
    });
    // TODO Once we have 3 romance quests, change code to just display genre list
    const visibleGenres: GenreType[] = ['Comedy', 'Drama', 'Horror', 'Mystery'];
    return (
      <Card title="Quest Search">
        <form className="searchForm" autoComplete="off">
          <div className="searchDescription">
            For {this.props.settings.numPlayers} adventurer{this.props.settings.numPlayers > 1 ? 's' : ''} with {this.props.settings.contentSets.horror ? 'The Horror' : 'the base game'} (based on settings)
          </div>
          <FormControl fullWidth={true}>
            <TextField
              id="text"
              className="textfield"
              fullWidth={true}
              label="text search - title, author, ID"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.onChange('text', e.target.value)}
              value={this.state.text}
            />
          </FormControl>
          <FormControl className="selectfield" fullWidth={true}>
            <InputLabel htmlFor="order">Sort by</InputLabel>
            <Select
              inputProps={{
                id: 'order',
              }}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>, c: React.ReactNode) => this.onChange('order', e.target.value)}
              value={this.state.order}
            >
              <MenuItem value="+ratingavg">Highest rated</MenuItem>
              <MenuItem value="-created">Newest</MenuItem>
              <MenuItem value="+title">Title (A-Z)</MenuItem>
              <MenuItem value="-title">Title (Z-A)</MenuItem>
            </Select>
          </FormControl>
          <FormControl className="selectfield halfLeft ranged">
            <InputLabel htmlFor="mintimeminutes">Minimum time</InputLabel>
            <Select
              inputProps={{
                id: 'mintimeminutes',
              }}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>, c: React.ReactNode) => this.onChange('mintimeminutes', e.target.value)}
              value={this.state.mintimeminutes}
            >
              <MenuItem value={undefined}><em>Any length</em></MenuItem>
              {timeBuckets}
            </Select>
          </FormControl>
          <FormControl className="selectfield halfRight">
            <InputLabel htmlFor="maxtimeminutes">Maximum time</InputLabel>
            <Select
              inputProps={{
                id: 'maxtimeminutes',
              }}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>, c: React.ReactNode) => this.onChange('maxtimeminutes', e.target.value)}
              value={this.state.maxtimeminutes}
            >
              <MenuItem value={undefined}><em>Any length</em></MenuItem>
              {timeBuckets}
            </Select>
          </FormControl>
          <FormControl className="selectfield halfLeft">
            <InputLabel htmlFor="age">Recency</InputLabel>
            <Select
              inputProps={{
                id: 'age',
              }}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>, c: React.ReactNode) => this.onChange('age', e.target.value)}
              value={this.state.age}
            >
              <MenuItem value={undefined}>All time</MenuItem>
              <MenuItem value={31536000}>Published this year</MenuItem>
              <MenuItem value={2592000}>Published this month</MenuItem>
              <MenuItem value={604800}>Published this week</MenuItem>
            </Select>
          </FormControl>
          <FormControl className="selectfield halfRight">
            <InputLabel htmlFor="language">Language</InputLabel>
            <Select
              inputProps={{
                id: 'language',
              }}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>, c: React.ReactNode) => this.onChange('language', e.target.value)}
              value={this.state.language}
            >
              {LANGUAGES.map((language:string, i: number) => { return <MenuItem key={i} value={language}>{language}</MenuItem>})}
            </Select>
          </FormControl>
          <FormControl className="selectfield halfLeft">
            <InputLabel htmlFor="genre">Genre</InputLabel>
            <Select
              inputProps={{
                id: 'genre',
              }}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>, c: React.ReactNode) => this.onChange('genre', e.target.value)}
              value={this.state.genre}
            >
              <MenuItem value={undefined}>All genres</MenuItem>
              {visibleGenres.map((genre:string, i: number) => { return <MenuItem key={i} value={genre}>{genre}</MenuItem>})}
            </Select>
          </FormControl>
          <FormControl className="selectfield halfRight">
            <InputLabel htmlFor="contentrating">Content Rating</InputLabel>
            <Select
              inputProps={{
                id: 'contentrating',
              }}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>, c: React.ReactNode) => this.onChange('contentrating', e.target.value)}
              value={this.state.contentrating}
            >
              <MenuItem value={undefined}>All ratings</MenuItem>
              <MenuItem value="Kid-friendly">Kid-friendly</MenuItem>
              <MenuItem value="Teen">Teen</MenuItem>
              <MenuItem value="Adult">Adult</MenuItem>
            </Select>
          </FormControl>
          <FormControl className="selectfield halfLeft">
            <InputLabel htmlFor="requirespenpaper">Requires Pen & Paper</InputLabel>
            <Select
              inputProps={{
                id: 'requirespenpaper',
              }}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>, c: React.ReactNode) => this.onChange('requirespenpaper', e.target.value)}
              value={this.state.requirespenpaper}
            >
              <MenuItem value={undefined}>No Preference</MenuItem>
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </FormControl>
          {rating && <div className="ratingDescription">
            <span>"{this.state.contentrating}" rating means: {rating.summary}</span>
          </div>}
          <Button onClick={() => this.props.onSearch(this.state, this.props.settings)} id="search">Search</Button>
        </form>
      </Card>
    );
  }
}

function renderSettings(props: SearchProps): JSX.Element {
  return (<SearchSettingsCard search={props.search} settings={props.settings} onSearch={props.onSearch} user={props.user} />);
}

export function formatPlayPeriod(minMinutes: number, maxMinutes: number): string {
  if (maxMinutes >= 999) {
    if (minMinutes >= 999) {
      return '2+ hrs';
    } else if (minMinutes >= 60) {
      return Math.round(minMinutes / 60) + '+ hrs';
    } else {
      return Math.round(minMinutes) + '+ min';
    }
  } else if (minMinutes >= 60 && maxMinutes >= 60) {
    return Math.round(minMinutes / 60) + '-' + Math.round(maxMinutes / 60) + ' hrs';
  } else {
    return minMinutes + '-' + maxMinutes + ' min';
  }
}

export function smartTruncateSummary(summary: string) {
  // Extract sentences
  const match = summary.match(/(.*?(?:\.|\?|!))(?: |$)/gm);

  if (match === null) {
    return summary;
  }

  let result = '';
  for (const m of match) {
    if (result.length + m.length > 120) {
      if (result === '') {
        return summary.trim();
      }

      result = result.trim();
      if (result.endsWith('.')) {
        // Continue a natural ellispis
        return result + '..';
      }
      return result;
    }
    result += m;
  }
  return summary.trim();
}

export interface SearchResultProps {
  index: number;
  lastPlayed: Date | null;
  quest: QuestDetails;
  search: SearchSettings;
  onQuest: (quest: QuestDetails) => void;
}

export function renderResult(props: SearchResultProps): JSX.Element {
  const orderField = props.search.order && props.search.order.substring(1);
  const quest = props.quest;
  let orderDetails = <span></span>;
  if (orderField) {
    const ratingCount = quest.ratingcount || 0;
    const ratingAvg = quest.ratingavg || 0;
    orderDetails = (
      <div className={`searchOrderDetail ${orderField}`}>
        {orderField === 'ratingavg' && ratingCount >= 1 && <StarRating readOnly={true} value={+ratingAvg} quantity={ratingCount}/>}
        {orderField === 'created' && ('Published ' + Moment(quest.created).format('MMM YYYY'))}
      </div>
    );
  }
  const classes = ['searchResult'];
  if (props.lastPlayed) {
    classes.push('played');
  }

  return (
    <Button key={props.index} onClick={() => props.onQuest(quest)} id={'quest-'+props.index}>
      <div className={classes.join(' ')}>
        <table className="searchResultsTitleTable">
          <tbody>
            <tr>
              <th className="leftcell">
                  <Truncate lines={2}>
                    {quest.title}
                  </Truncate>
              </th>
              <th className="rightcell">
                {props.lastPlayed && <DoneIcon className="inline_icon questPlayedIcon" />}
                {quest.official && <span className="indicator_spacer"><img className="inline_icon questOfficialIcon" src="images/compass_small.svg"/></span>}
                {quest.awarded && <StarsIcon className="inline_icon questAwardedIcon" />}
              </th>
            </tr>
          </tbody>
        </table>
        <div className="summary">
          <Truncate lines={3}>
            {smartTruncateSummary(quest.summary || '')}
          </Truncate>
        </div>
        {quest.mintimeminutes !== undefined && quest.maxtimeminutes !== undefined &&
          <div className="timing">
            {formatPlayPeriod(quest.mintimeminutes, quest.maxtimeminutes)}
          </div>
        }
        {orderDetails}
        <span className="expansions">
          {quest.expansionhorror && <img className="inline_icon" src="images/horror_small.svg"></img>}
        </span>
      </div>
    </Button>
  );
}

function renderResults(props: SearchProps, hideHeader?: boolean): JSX.Element {
  const results: JSX.Element[] = (props.results || []).map((quest: QuestDetails, index: number) => {
    return renderResult({index, quest, search: props.search, onQuest: props.onQuest, lastPlayed: (props.user.quests[quest.id] || {}).lastPlayed});
  });

  return (
    <Card
      title="Quest Search Results"
      className="search_card"
      header={(hideHeader) ? undefined : <div className="searchHeader">
        <Button className="searchResultInfo" disabled={true}>{props.results.length} quests for {props.settings.numPlayers} <img className="inline_icon" src="images/adventurer_small.svg"/></Button>
        <Button className="filter_button" onClick={() => props.onFilter()} id="filter">Filter &amp; Sort ></Button>
      </div>}
    >
      {results.length === 0 && !props.searching &&
        <div>
          <div>No quests found matching the search terms.</div>
          {!hideHeader && <div>Try broadening the search by using fewer filters.</div>}
          <Button className="filter_button" onClick={() => props.onFilter()} id="filter">Modify Search</Button>
        </div>
      }
      {results.length === 0 && props.searching && <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>}
      {results}
    </Card>
  );
}

export interface SearchDetailsProps {
  isDirectLinked: boolean;
  lastPlayed: Date | null;
  quest: QuestDetails | null;
  onPlay: (quest: QuestDetails, isDirectLinked: boolean) => void;
  onReturn: () => void;
}

export function renderDetails(props: SearchDetailsProps): JSX.Element {
  const quest = props.quest;
  if (!quest) {
    return <Card title="Quest Details">Loading...</Card>
  }
  const requires = [];
  if (quest.expansionhorror && quest.requirespenpaper) {
    requires.push(<span><span><img className="inline_icon" src="images/horror_small.svg"/>The Horror</span>, <span><img className="inline_icon" src="images/book_small.svg"/> Pen and Paper</span></span>);
  }
  if (quest.expansionhorror && !quest.requirespenpaper) {
    requires.push(<span><img className="inline_icon" src="images/horror_small.svg"/>The Horror</span>);
  }
  if (!quest.expansionhorror && quest.requirespenpaper) {
    requires.push(<span><img className="inline_icon" src="images/book_small.svg"/> Pen and Paper</span>);
  }
  if (!quest.expansionhorror && !quest.requirespenpaper) {
    requires.push(<span>None</span>);
  }
  const ratingAvg = quest.ratingavg || 0;
  return (
    <Card title="Quest Details">
      <div className="searchDetails">
        <h2>{quest.title}</h2>
        <div>{quest.summary}</div>
        <div className="author">by {quest.author}</div>
        {(quest.ratingcount && quest.ratingcount >= 1) ? <StarRating readOnly={true} value={+ratingAvg} quantity={quest.ratingcount}/> : ''}
        <div className="indicators">
          {props.lastPlayed && <div className="inline_icon"><DoneIcon className="inline_icon" /> Last played {Moment(props.lastPlayed).fromNow()}</div>}
          {quest.official && <div className="inline_icon"><img className="inline_icon" src="images/compass_small.svg"/> Official Quest!</div>}
          {quest.awarded && <div className="inline_icon"><StarsIcon className="inline_icon" /> {quest.awarded}</div>}
        </div>
      </div>
      <Button className="bigbutton" onClick={(e)=>props.onPlay(quest, props.isDirectLinked)} id="play">Play</Button>
      <Button id="searchDetailsBackButton" onClick={(e)=>props.onReturn()} >Pick a different quest</Button>
      <div className="searchDetailsExtended">
        <h3>Details</h3>
        <table className="searchDetailsTable">
          <tbody>
            <tr><th>Requires</th><td>{requires}</td></tr>
            <tr><th>Content rating</th><td>{quest.contentrating}</td></tr>
            {quest.mintimeminutes !== undefined && quest.maxtimeminutes !== undefined &&
              <tr><th>Play time</th><td>{formatPlayPeriod(quest.mintimeminutes, quest.maxtimeminutes)}</td></tr>
            }
            <tr><th>Players</th><td>{quest.minplayers}-{quest.maxplayers}</td></tr>
            <tr><th>Genre</th><td>{quest.genre}</td></tr>
            <tr><th>Language</th><td>{quest.language}</td></tr>
            <tr><th>Last updated</th><td>{Moment(quest.published).format('MMMM D, YYYY h:mm a')}</td></tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// We make this a react component to hold a bit of state and avoid sending
// redux actions for every single change to input.
interface SearchDisclaimerCardProps {
  onLoginRequest: (subscribe: boolean) => void;
}

class SearchDisclaimerCard extends React.Component<SearchDisclaimerCardProps, {}> {
  state: {
    subscribe: boolean;
  };

  constructor(props: SearchDisclaimerCardProps) {
    super(props)
    this.state = {
      subscribe: false,
    };
  }

  onSubscribeChange(value: boolean) {
    this.setState({subscribe: value});
  }

  render() {
    return (
      <Card title="Disclaimer">
        <p>
          Community quests are written by adventurers like yourselves using the free quest creator (Quests.ExpeditionGame.com).
          We offer no guarantees for the quests you are about to play, but do our best to review them for quality, and provide players with
          the ability to rate, review and report quests.
        </p>
        <p>
          We use your Google email as your identity when rating and reviewing quests.
        </p>
        <p>
          You must log in to continue:
        </p>
        <Checkbox label="Join the Mailing List" value={this.state.subscribe} onChange={(v: boolean) => { this.onSubscribeChange(v); }}>
          Learn about the latest quests, features and more - once per month!
        </Checkbox>
        <Button onClick={(e)=>this.props.onLoginRequest(this.state.subscribe)}>Continue with Google</Button>
      </Card>
    );
  }
}
function renderDisclaimer(props: SearchProps): JSX.Element {
  return (<SearchDisclaimerCard onLoginRequest={props.onLoginRequest}/>);
}

const Search = (props: SearchProps): JSX.Element => {
  switch(props.phase) {
    case 'DISCLAIMER':
      return renderDisclaimer(props);
    case 'SETTINGS':
      return renderSettings(props);
    case 'SEARCH':
      return renderResults(props);
    case 'PRIVATE':
      return renderResults(props, true);
    case 'DETAILS':
      return renderDetails({
        isDirectLinked: props.isDirectLinked,
        lastPlayed: (props.user.quests[(props.selected || {id: '-1'}).id] || {}).lastPlayed,
        quest: props.selected,
        onPlay: props.onPlay,
        onReturn: props.onReturn,
      });
    default:
      throw new Error('Unknown search phase ' + props.phase);
  }
}

export default Search;
