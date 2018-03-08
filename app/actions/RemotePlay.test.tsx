describe('RemotePlay actions', () => {
  describe('routeEvent', () => {
    it('does not dispatch INTERACTION events');
    it('resolves and dispatches ACTION events');
    it('shows a snackbar on ERROR events');
    it('safely handles unknown events');
    it('rejects COMMIT when no matching inflight action');
    it('rejects REJECT when no matching inflight action');
    it('rejects ACTIONs when id is not an increment');
  });

  describe('remotePlayNewSession', () => {
    it('creates a new session');
    it('catches and logs web errors');
  });

  describe('remotePlayConnect', () => {
    it('connects to a session');
    it('catches and logs web errors');
  });

  describe('loadRemotePlay', () => {
    it('fetches past sessions by user id');
    it('catches and logs web errors');
  });
});
