import * as React from 'react'
import {Provider} from 'react-redux'
import Snackbar from 'material-ui/Snackbar'
import AudioContainer from './base/AudioContainer'
import DialogsContainer from './base/DialogsContainer'
import MultiplayerFooterContainer from './multiplayer/MultiplayerFooterContainer'
import MultiplayerSyncContainer from './multiplayer/MultiplayerSyncContainer'
import {CARD_TRANSITION_ANIMATION_MS} from '../Constants'
import {CardThemeType, TransitionType, SettingsType, SnackbarState, MultiplayerState} from '../reducers/StateTypes'
import {getStore} from '../Store'

const ReactCSSTransitionGroup: any = require('react-addons-css-transition-group');

export interface CompositorStateProps {
  card: JSX.Element;
  ts: number;
  cardKey: string;
  theme: CardThemeType;
  transition: TransitionType;
  settings: SettingsType;
  snackbar: SnackbarState;
  remotePlay: MultiplayerState;
}

export interface CompositorDispatchProps {
  closeSnackbar: () => void;
}

export interface CompositorProps extends CompositorStateProps, CompositorDispatchProps {}

export default class Compositor extends React.Component<CompositorProps, {}> {

  render() {
    const containerClass = ['app_container'];
    if (this.props.settings.fontSize === 'SMALL') {
      containerClass.push('smallFont');
    } else if (this.props.settings.fontSize === 'LARGE') {
      containerClass.push('largeFont');
    }

    return (
      <div className={containerClass.join(' ')}>
        <Provider store={getStore()}>
          <span>
            <ReactCSSTransitionGroup
                transitionName={this.props.transition}
                transitionEnterTimeout={CARD_TRANSITION_ANIMATION_MS}
                transitionLeaveTimeout={CARD_TRANSITION_ANIMATION_MS}>
              <div className={'base_main' + ((this.props.remotePlay && this.props.remotePlay.session) ? ' has_footer' : '')} key={this.props.cardKey}>
                {this.props.card}
              </div>
            </ReactCSSTransitionGroup>
            {this.props.remotePlay && this.props.remotePlay.session && <MultiplayerFooterContainer theme={this.props.theme}/>}
            <DialogsContainer />
            <MultiplayerSyncContainer />
            <Snackbar
              className="snackbar"
              open={this.props.snackbar.open}
              message={this.props.snackbar.message}
              autoHideDuration={this.props.snackbar.timeout}
              onRequestClose={this.props.closeSnackbar}
              action={this.props.snackbar.actionLabel}
              onActionClick={this.props.snackbar.action}
            />
            <AudioContainer />
          </span>
        </Provider>
      </div>
    );
  }
}
