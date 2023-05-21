'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Space, SpaceEvent } from '@mux/spaces-web';

import Participant from './Participant';

// 🚨 Don’t forget to add your own JWT!
const JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjg0NDQyMjI3LCJzdWIiOiI4NDYyN2Q2OC01ODcxLTQ1ZmYtOThkMi1kMTliMGY3ZTNmMWUiLCJlbWFpbCI6ImtvdGFuaS5raXp1a3VAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJkaXNjb3JkIiwicHJvdmlkZXJzIjpbImRpc2NvcmQiXX0sInVzZXJfbWV0YWRhdGEiOnsiYXZhdGFyX3VybCI6Imh0dHBzOi8vY2RuLmRpc2NvcmRhcHAuY29tL2F2YXRhcnMvODMzMjQ0MDIzODkxOTUxNjU3L2ZiZTAyYzcwMTEzZGYxYTUyMTgzZDhhNWI2MTZhYTc4LnBuZyIsImVtYWlsIjoia290YW5pLmtpenVrdUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiS2l6dWt1IiwiaXNzIjoiaHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkiLCJuYW1lIjoiS2l6dWt1IzkzOTMiLCJwaWN0dXJlIjoiaHR0cHM6Ly9jZG4uZGlzY29yZGFwcC5jb20vYXZhdGFycy84MzMyNDQwMjM4OTE5NTE2NTcvZmJlMDJjNzAxMTNkZjFhNTIxODNkOGE1YjYxNmFhNzgucG5nIiwicHJvdmlkZXJfaWQiOiI4MzMyNDQwMjM4OTE5NTE2NTciLCJzdWIiOiI4MzMyNDQwMjM4OTE5NTE2NTcifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJvYXV0aCIsInRpbWVzdGFtcCI6MTY4NDQzODYyN31dLCJzZXNzaW9uX2lkIjoiYmIyZDFiOGItZmIzYS00MzQzLThlMmQtMzU4ZTJjN2VmNGU4In0.jzA-o2I2CeXzOpItC1dCCdoYdcvtF9j-eHMdDXq6vxg';

function Test() {
  const spaceRef = useRef(null);
  const [localParticipant, setLocalParticipant] = useState(null);
  const [participants, setParticipants] = useState([]);
  const joined = !!localParticipant;

  const addParticipant = useCallback(
    (participant) => {
      setParticipants((currentParticipants) => [
        ...currentParticipants,
        participant
      ]);
    },
    [setParticipants]
  );

  const removeParticipant = useCallback(
    (participantLeaving) => {
      setParticipants((currentParticipants) =>
        currentParticipants.filter(
          (currentParticipant) =>
            currentParticipant.connectionId !== participantLeaving.connectionId
        )
      );
    },
    [setParticipants]
  );

  useEffect(() => {
    const space = new Space(JWT);

    space.on(SpaceEvent.ParticipantJoined, addParticipant);
    space.on(SpaceEvent.ParticipantLeft, removeParticipant);

    spaceRef.current = space;

    return () => {
      space.off(SpaceEvent.ParticipantJoined, addParticipant);
      space.off(SpaceEvent.ParticipantLeft, removeParticipant);
    };
  }, [addParticipant, removeParticipant]);

  const join = useCallback(async () => {
    // Join the Space
    let localParticipant = await spaceRef.current.join();

    // Get and publish our local tracks
    let localTracks = await localParticipant.getUserMedia({
      audio: true,
      video: true
    });
    await localParticipant.publishTracks(localTracks);

    // Set the local participant so it will be rendered
    setLocalParticipant(localParticipant);
  }, []);

  return (
    <div className='App'>
      <button onClick={join} disabled={joined}>
        Join Space
      </button>

      {localParticipant && (
        <Participant
          key={localParticipant.connectionId}
          participant={localParticipant}
        />
      )}

      {participants.map((participant) => {
        return (
          <Participant
            key={participant.connectionId}
            participant={participant}
          />
        );
      })}
    </div>
  );
}

export default Test;
