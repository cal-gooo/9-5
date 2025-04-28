// src/components/NoteFeed.tsx
import { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import {  useSubscribe } from '@nostr-dev-kit/ndk-hooks';
import EventViewer from './eventViewer';


function NoteFeed() {

  // there is no need to memoize filters
  // Subscribe to events matching the filter
  // `events` is a Set<NDKEvent> ordered by created_at (newest first by default)
  const { events, eose } = useSubscribe(
    [{ kinds: [NDKKind.Text] }], // no need to memoize filters, useSubscribe only depends on the explicit dependencies
    { /* in case you need to pass options for the subscription */ }, // NDKSubscriptionOptions
  );

  return (
    <div>
      <h3>Recent Notes</h3>
      {events.length === 0 && eose && <p>No notes found.</p>}
      <ul>
        {events.map((event: NDKEvent) => (
          <EventViewer eventId={event.id} />
        ))}
      </ul>
    </div>
  );
}



export default NoteFeed;