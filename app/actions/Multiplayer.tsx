import React from 'react'
import Redux from 'redux'
import {toCard} from './Card'
import {handleFetchErrors} from './Web'
import {remotePlaySettings} from '../Constants'
import {LocalAction, NavigateAction, MultiplayerClientStatus} from './ActionTypes'
import {MultiplayerSessionMeta, UserState} from '../reducers/StateTypes'
import {logEvent} from '../Main'
import {openSnackbar} from '../actions/Snackbar'
import {MultiplayerEvent, StatusEvent} from 'expedition-qdl/lib/multiplayer/Events'
import {getMultiplayerClient} from '../Multiplayer'

export function local(a: Redux.Action): LocalAction {
  const inflight = (a as any)._inflight;
  return {type: 'LOCAL', action: a, _inflight: inflight} as any as LocalAction;
}

export function remotePlayDisconnect() {
  getMultiplayerClient().disconnect();
  return {type: 'MULTIPLAYER_DISCONNECT'};
}

export function remotePlayNewSession(user: UserState) {
  return (dispatch: Redux.Dispatch<any>): any => {
    fetch(remotePlaySettings.newSessionURI, {
      method: 'POST',
      mode: 'cors',
      headers: new Headers({
        'Accept': 'text/html',
      }),
      credentials: 'include',
    })
    .then(handleFetchErrors)
    .then((response: Response) => {
      return response.json();
    })
    .then((data: {secret: string}) => {
      if (!data.secret) {
        return dispatch(openSnackbar('Error parsing new session secret'));
      }
      return dispatch(remotePlayConnect(user, data.secret));
    })
    .catch((error: Error) => {
      logEvent('MULTIPLAYER_new_session_err', error.toString());
      dispatch(openSnackbar('Error creating session: ' + error.toString()));
    });
  };
}

export function remotePlayConnect(user: UserState, secret: string) {
  let sessionID = '';
  const clientID = user.id.toString();
  const instanceID = Date.now().toString();

  return (dispatch: Redux.Dispatch<any>): any => {
    fetch(remotePlaySettings.connectURI, {
      method: 'POST',
      mode: 'cors',
      headers: new Headers({
        'Accept': 'application/json',
      }),
      credentials: 'include',
      body: JSON.stringify({instance: instanceID, secret}),
    })
    .then(handleFetchErrors)
    .then((response: Response) => {
      return response.json();
    })
    .then((data: {session: string}) => {
      if (!data.session) {
        return dispatch(openSnackbar('Error parsing session'));
      }
      sessionID = data.session;
    })
    .then(() => {
      // Dispatch navigation and settings **before** opening the client connection.
      // This lets us navigate to the lobby, then immediately receive a MULTI_EVENT
      // to fast-forward to the current state.
      dispatch({type: 'MULTIPLAYER_SESSION', session: {secret, id: sessionID}});
      return dispatch(toCard({name: 'REMOTE_PLAY', phase: 'LOBBY'}));
    })
    .then(() => {
      const c = getMultiplayerClient();
      c.configure(clientID, instanceID);
      return c.connect(sessionID, secret);
    })
    .catch((error: Error) => {
      logEvent('MULTIPLAYER_connect_err', error.toString());
      console.error(error);
      dispatch(openSnackbar('Error connecting: ' + error.toString()));
    });
  };
}

export function loadMultiplayer(user: UserState) {
  return (dispatch: Redux.Dispatch<any>): any => {
    if (!user || !user.id) {
      throw new Error('you are not logged in');
    }
    fetch(remotePlaySettings.firstLoadURI, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    })
    // NOTE: We do not handle fetch errors here - failing this
    // fetch should not prevent users from using multiplayer.
    // .then(handleFetchErrors)
    .then((response: Response) => {
      return response.json();
    })
    .then((data: {history: MultiplayerSessionMeta[]}) => {
      dispatch({type: 'MULTIPLAYER_HISTORY', history: data.history});
      dispatch(toCard({name: 'REMOTE_PLAY', phase: 'CONNECT'}));
    })
    .catch((error: Error) => {
      logEvent('MULTIPLAYER_init_err', error.toString());
      dispatch(openSnackbar('Online multiplayer service unavailable: ' + error.toString()));
    })
  };
}

export function setMultiplayerStatus(ev: StatusEvent) {
  return (dispatch: Redux.Dispatch<any>): any => {
    const c = getMultiplayerClient();
    c.sendStatus(ev);
    dispatch({
      type: 'MULTIPLAYER_CLIENT_STATUS',
      client: c.getID(),
      instance: c.getInstance(),
      status: ev,
    } as MultiplayerClientStatus);
    return null;
  }
}