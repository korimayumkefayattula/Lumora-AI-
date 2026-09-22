// Google Workspace Services (Calendar, Gmail, Chat, Forms, Picker, Keep)
// Follows least privilege client-side authentication with Firebase Auth tokens.

export interface CalendarEventItem {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  htmlLink?: string;
}

export interface GmailMessagePreview {
  id: string;
  threadId: string;
  snippet?: string;
  subject?: string;
  from?: string;
  date?: string;
}

export interface ChatSpaceItem {
  name: string;
  displayName: string;
  type: string;
  spaceThreadingState?: string;
}

export interface ChatMessageItem {
  name: string;
  text: string;
  createTime: string;
  sender?: { displayName?: string; name?: string; type?: string };
}

export interface GoogleFormItem {
  formId: string;
  title: string;
  description?: string;
  responderUri?: string;
}

// ----------------------------------------------------------------------------
// 1. Google Calendar API
// ----------------------------------------------------------------------------
export async function fetchCalendarEvents(token: string): Promise<CalendarEventItem[]> {
  const now = new Date();
  const timeMin = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const timeMax = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(
    timeMin
  )}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime&maxResults=25`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Google Calendar API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return (data.items || []).map((item: any) => ({
    id: item.id,
    summary: item.summary || 'Untitled Study Event',
    description: item.description,
    location: item.location,
    start: item.start || {},
    end: item.end || {},
    htmlLink: item.htmlLink,
  }));
}

export async function createCalendarEvent(
  token: string,
  event: {
    summary: string;
    description?: string;
    startDateTime: string;
    endDateTime: string;
  }
): Promise<CalendarEventItem> {
  const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      summary: event.summary,
      description: event.description || 'Created via Lumora AI Study Assistant',
      start: { dateTime: event.startDateTime },
      end: { dateTime: event.endDateTime },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create calendar event (${res.status}): ${errorText}`);
  }

  return await res.json();
}

export async function deleteCalendarEvent(token: string, eventId: string): Promise<void> {
  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok && res.status !== 404) {
    const errorText = await res.text();
    throw new Error(`Failed to delete calendar event (${res.status}): ${errorText}`);
  }
}

// ----------------------------------------------------------------------------
// 2. Gmail API
// ----------------------------------------------------------------------------
export async function fetchRecentEmails(token: string, maxResults = 8): Promise<GmailMessagePreview[]> {
  const listRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&q=${encodeURIComponent(
      'category:primary OR label:INBOX'
    )}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!listRes.ok) {
    const errorText = await listRes.text();
    throw new Error(`Gmail API error (${listRes.status}): ${errorText}`);
  }

  const listData = await listRes.json();
  const messages = listData.messages || [];

  const detailed = await Promise.all(
    messages.map(async (msg: { id: string; threadId: string }) => {
      try {
        const detailRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!detailRes.ok) return { id: msg.id, threadId: msg.threadId };
        const detailData = await detailRes.json();
        const headers = detailData.payload?.headers || [];
        const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || 'No Subject';
        const from = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || 'Unknown Sender';
        const date = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';

        return {
          id: msg.id,
          threadId: msg.threadId,
          snippet: detailData.snippet,
          subject,
          from,
          date,
        };
      } catch {
        return { id: msg.id, threadId: msg.threadId };
      }
    })
  );

  return detailed;
}

export async function sendEmail(
  token: string,
  to: string,
  subject: string,
  bodyText: string
): Promise<{ id: string }> {
  // Construct RFC 2822 raw email string
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const messageParts = [
    `To: ${to}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    bodyText,
  ];
  const message = messageParts.join('\r\n');
  const encodedMessage = btoa(unescape(encodeURIComponent(message)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: encodedMessage }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to send email (${res.status}): ${errorText}`);
  }

  return await res.json();
}

// ----------------------------------------------------------------------------
// 3. Google Chat API
// ----------------------------------------------------------------------------
export async function fetchChatSpaces(token: string): Promise<ChatSpaceItem[]> {
  const res = await fetch('https://chat.googleapis.com/v1/spaces?pageSize=20', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Google Chat API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return (data.spaces || []).map((s: any) => ({
    name: s.name,
    displayName: s.displayName || s.name.replace('spaces/', 'Study Room '),
    type: s.type || 'SPACE',
    spaceThreadingState: s.spaceThreadingState,
  }));
}

export async function fetchChatMessages(token: string, spaceName: string): Promise<ChatMessageItem[]> {
  const res = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages?pageSize=20`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Google Chat messages error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return (data.messages || []).map((m: any) => ({
    name: m.name,
    text: m.text || '',
    createTime: m.createTime || new Date().toISOString(),
    sender: m.sender,
  }));
}

export async function sendChatMessage(token: string, spaceName: string, text: string): Promise<ChatMessageItem> {
  const res = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to send chat message (${res.status}): ${errorText}`);
  }

  return await res.json();
}

// ----------------------------------------------------------------------------
// 4. Google Forms API
// ----------------------------------------------------------------------------
export async function createAcademicQuizForm(
  token: string,
  title: string,
  documentTitle: string
): Promise<GoogleFormItem> {
  const res = await fetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      info: {
        title,
        documentTitle,
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Google Forms API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return {
    formId: data.formId,
    title: data.info?.title || title,
    description: data.info?.description,
    responderUri: data.responderUri,
  };
}

export async function fetchFormDetails(token: string, formId: string): Promise<any> {
  const res = await fetch(`https://forms.googleapis.com/v1/forms/${formId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch form (${res.status}): ${errorText}`);
  }

  return await res.json();
}

export async function fetchFormResponses(token: string, formId: string): Promise<any> {
  const res = await fetch(`https://forms.googleapis.com/v1/forms/${formId}/responses`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch form responses (${res.status}): ${errorText}`);
  }

  return await res.json();
}

// ----------------------------------------------------------------------------
// 5. Google Picker API Client Widget (per references/picker.md)
// ----------------------------------------------------------------------------
export function openGooglePicker(
  accessToken: string,
  onPick: (file: { id: string; name: string; url: string; mimeType: string }) => void,
  onError?: (err: any) => void
) {
  const win = window as any;
  const gapi = win.gapi;
  const google = win.google;

  const launch = () => {
    try {
      const pickerOrigin =
        win.location.ancestorOrigins && win.location.ancestorOrigins.length > 0
          ? win.location.ancestorOrigins[win.location.ancestorOrigins.length - 1]
          : win.location.origin;

      const picker = new win.google.picker.PickerBuilder()
        .addView(win.google.picker.ViewId.DOCS)
        .setOAuthToken(accessToken)
        .setCallback((data: any) => {
          if (data.action === win.google.picker.Action.PICKED) {
            const file = data.docs[0];
            onPick({
              id: file.id,
              name: file.name,
              url: file.url,
              mimeType: file.mimeType,
            });
          }
        })
        .setOrigin(pickerOrigin)
        .build();
      picker.setVisible(true);
    } catch (err) {
      console.error('Google Picker error:', err);
      if (onError) onError(err);
    }
  };

  if (!gapi || !google || !google.picker) {
    if (gapi) {
      gapi.load('picker', {
        callback: launch,
        onerror: (err: any) => {
          console.error('Failed to load Google Picker library:', err);
          if (onError) onError(err);
        },
      });
    } else {
      const err = new Error('Google APIs script is still loading. Please try again in a few seconds.');
      if (onError) onError(err);
    }
  } else {
    launch();
  }
}
