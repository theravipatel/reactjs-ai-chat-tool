export function createMessage(role, text) {
    return {
        id: crypto.randomUUID(),
        role,
        text,
    };
}

export function createSessionTitle(message) {
    return message.slice(0, 30);
}

export function appendMessage(history, message) {
    return [...history, message];
}

export function createChatSession({
    id,
    title,
    history,
    interactionId,
}) {
    return {
        id,
        title,
        history,
        interactionId,
    };
}

export function updateChatSession(
    sessions,
    sessionId,
    history,
    interactionId
) {
    return sessions.map((session) =>
        session.id === sessionId
            ? {
                ...session,
                history,
                interactionId,
            }
            : session
    );
}

export function saveSessionToList(sessions, session) {
    const existingSession = sessions.some(
        (item) => item.id === session.id
    );

    return existingSession
        ? sessions.map((item) =>
            item.id === session.id ? session : item
        )
        : [session, ...sessions];
}