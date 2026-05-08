import { NativeModules, NativeEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createInternalMessage,
  updateMessageStatus,
  getPendingMessages,
  type Message,
} from '../api/messagesApi';
import { normalizeTailToE164 } from '../utils/phone';
import {
  resolveRealPhone,
  isKnownEmulatorPhone,
} from '../utils/emulatorPhoneMap';
import { requestSmsPermissions } from './permissions';

const { SmsModule } = NativeModules;
const emitter = new NativeEventEmitter(SmsModule);

let listeners: (() => void)[] = [];

export function onMessagesChanged(cb: () => void) {
  listeners.push(cb);

  return () => {
    listeners = listeners.filter(l => l !== cb);
  };
}

function notify() {
  listeners.forEach(cb => cb());
}

const sendingMessageIds = new Set<number>();

async function sendPhysicalMessage(
  msg: Message,
  options?: {
    throwOnFail?: boolean;
  },
): Promise<void> {
  if (sendingMessageIds.has(msg.id_message)) {
    return;
  }

  sendingMessageIds.add(msg.id_message);

  try {
    const realPhone = resolveRealPhone(msg.phone_to);

    await SmsModule.sendSms(realPhone, msg.text);

    await updateMessageStatus(msg.id_message, 'sent');

    notify();
  } catch (e) {
    try {
      await updateMessageStatus(msg.id_message, 'failed');
    } catch {}

    notify();

    if (options?.throwOnFail) {
      throw e;
    }
  } finally {
    sendingMessageIds.delete(msg.id_message);
  }
}

export async function sendSms(toTail: string, text: string) {
  const hasPermission = await requestSmsPermissions();

  if (!hasPermission) {
    throw new Error('SMS permissions denied');
  }

  const deviceIdRaw = await AsyncStorage.getItem('deviceId');
  const deviceId = deviceIdRaw ? Number(deviceIdRaw) : null;

  if (!deviceId) {
    throw new Error('deviceId not found');
  }

  const phone = normalizeTailToE164(toTail);

  if (!phone) {
    throw new Error('Invalid phone');
  }

  const msg = await createInternalMessage({
    id_device: deviceId,
    phone_to: phone,
    text,
  });

  await sendPhysicalMessage(msg, {
    throwOnFail: true,
  });
}

let pendingPollStarted = false;
let pollIntervalId: ReturnType<typeof setInterval> | null = null;
let pollTickRunning = false;

async function processPendingMessagesOnce() {
  if (pollTickRunning) {
    return;
  }

  pollTickRunning = true;

  try {
    const currentDeviceId = await AsyncStorage.getItem('deviceId');

    if (!currentDeviceId) {
      stopPendingMessagesPoll();
      return;
    }

    const pendingMessages = await getPendingMessages(Number(currentDeviceId));

    if (pendingMessages.length === 0) {
      return;
    }

    for (const msg of pendingMessages) {
      await sendPhysicalMessage(msg);
    }
  } catch (e) {
  } finally {
    pollTickRunning = false;
  }
}

export async function startPendingMessagesPoll() {
  if (pendingPollStarted) {
    return;
  }

  pendingPollStarted = true;

  const hasPermission = await requestSmsPermissions();

  if (!hasPermission) {
    pendingPollStarted = false;
    return;
  }

  await processPendingMessagesOnce();

  pollIntervalId = setInterval(() => {
    processPendingMessagesOnce().catch(() => {});
  }, 5000);
}

export function stopPendingMessagesPoll() {
  if (pollIntervalId) {
    clearInterval(pollIntervalId);
    pollIntervalId = null;
  }

  pendingPollStarted = false;
  pollTickRunning = false;
}

let incomingListenerStarted = false;
let incomingSubscription: { remove: () => void } | null = null;

export async function startIncomingSmsListener() {
  if (incomingListenerStarted) {
    return;
  }

  incomingListenerStarted = true;

  const hasPermission = await requestSmsPermissions();

  if (!hasPermission) {
    incomingListenerStarted = false;
    return;
  }

  incomingSubscription = emitter.addListener(
    'SmsReceived',
    async ({ from }: { from: string; body: string }) => {
      try {
        if (!isKnownEmulatorPhone(from)) {
          return;
        }

        notify();
      } catch {}
    },
  );
}

export function stopIncomingSmsListener() {
  if (incomingSubscription) {
    incomingSubscription.remove();
    incomingSubscription = null;
  }

  incomingListenerStarted = false;
}
