import * as React from 'react'
import Redux from 'redux'
import {connect} from 'react-redux'
import Compositor, {CompositorStateProps, CompositorDispatchProps} from './Compositor'
import {closeSnackbar} from '../actions/Snackbar'
import {AppStateWithHistory, SavedQuestsPhase, SearchPhase, MultiplayerPhase, TransitionType} from '../reducers/StateTypes'
import {getCardTemplateTheme, renderCardTemplate} from './views/quest/cardtemplates/Template'
import CheckoutContainer from './views/CheckoutContainer'
import ToolsContainer from './views/ToolsContainer'
import FeaturedQuestsContainer from './views/FeaturedQuestsContainer'
import MultiplayerContainer from './views/MultiplayerContainer'
import PartySizeSelectContainer from './views/PartySizeSelectContainer'
import SavedQuestsContainer from './views/SavedQuestsContainer'
import SearchContainer from './views/SearchContainer'
import SettingsContainer from './views/SettingsContainer'
import SplashScreenContainer from './views/SplashScreenContainer'
import QuestSetupContainer from './views/quest/QuestSetupContainer'
import QuestEndContainer from './views/quest/QuestEndContainer'

const mapStateToProps = (state: AppStateWithHistory, ownProps: CompositorStateProps): CompositorStateProps => {
  let card = <SplashScreenContainer/>;
  switch(state.card.name) {
    case 'SPLASH_CARD':
      card = <SplashScreenContainer/>;
      break;
    case 'PLAYER_COUNT_SETTING':
      card = <PartySizeSelectContainer/>;
      break;
    case 'FEATURED_QUESTS':
      card = <FeaturedQuestsContainer/>;
      break;
    case 'SAVED_QUESTS':
      card = <SavedQuestsContainer  phase={state.card.phase as SavedQuestsPhase}/>;
      break;
    case 'QUEST_SETUP':
      card = <QuestSetupContainer/>;
      break;
    case 'QUEST_CARD':
      if (state.quest && state.quest.node) {
        card = renderCardTemplate(state.card, state.quest.node);
      }
      break;
    case 'QUEST_END':
      card = <QuestEndContainer/>;
      break;
    case 'CHECKOUT':
      card = <CheckoutContainer />;
      break;
    case 'ADVANCED':
      card = <ToolsContainer />;
      break;
    case 'SEARCH_CARD':
      card = <SearchContainer phase={state.card.phase as SearchPhase} />;
      break;
    case 'SETTINGS':
      card = <SettingsContainer />;
      break;
    case 'REMOTE_PLAY':
      card = <MultiplayerContainer phase={state.card.phase as MultiplayerPhase} />;
      break;
    default:
      throw new Error('Unknown card ' + state.card.name);
  }

  let transition: TransitionType = 'NEXT';
  if (state === undefined || Object.keys(state).length === 0) {
    transition = 'INSTANT';
  } else if (state.remotePlay && state.remotePlay.syncing) {
    transition = 'INSTANT';
  } else if (state.card.name === 'SPLASH_CARD') {
    transition = 'INSTANT';
  } else if (state._return) {
    transition = 'PREV';
  }

  return {
    card,
    theme: getCardTemplateTheme(state.card),
    transition,
    ts: state.card.ts,
    cardKey: state.card.key,
    settings: state.settings,
    snackbar: state.snackbar,
    remotePlay: state.remotePlay, // TODO rename to multiplayer
  };
}

export const mapDispatchToProps = (dispatch: Redux.Dispatch<any>, ownProps: any): CompositorDispatchProps => {
  return {
    closeSnackbar(): void {
      dispatch(closeSnackbar());
    },
  };
}

const CompositorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Compositor);

export default CompositorContainer
