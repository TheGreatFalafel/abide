export {
  ARI_CHARACTER_STATES,
  AVATAR_CHARACTER_STATES,
  type AnimationFeedbackEvent,
  type AnimationMotionMode,
  type AriCharacterState,
  type AriPresentation,
  type AvatarCharacterState,
} from './types'

export {
  ariPresentationFromFeedback,
  ariStateFromFeedback,
  normalizeAriCharacterState,
  resolveAriPresentation,
  type ResolveAriPresentationOpts,
} from './ariMachine'

export {
  avatarShouldReact,
  avatarStateFromCharacterEvent,
  avatarStateFromFeedback,
  normalizeAvatarCharacterState,
} from './avatarMachine'

export {
  CHARACTER_EVENT_LOOPING,
  CHARACTER_EVENT_ONESHOT,
  CHARACTER_EVENTS,
  ariStateFromCharacterEvent,
  characterEventFromAriState,
  characterEventFromFeedback,
  isCharacterEvent,
  normalizeCharacterEvent,
  type CharacterEvent,
} from './characterEvents'

export {
  ARI_RIVE_ARTBOARD,
  ARI_RIVE_ASPECT,
  ARI_RIVE_CONTRACT,
  ARI_RIVE_HEIGHT,
  ARI_RIVE_LOOPING_TRIGGERS,
  ARI_RIVE_SRC,
  ARI_RIVE_STATE_MACHINE,
  ARI_RIVE_WIDTH,
  riveTriggerForAriState,
  riveTriggerForCharacterEvent,
  riveTriggerFromCharacterEvent,
} from './riveAri'

export {
  isLoopingEvent,
  resolveEventBinding,
  type RiveCharacterContract,
  type RiveCharacterLoadState,
  type RiveInputBinding,
  type RiveInputKind,
} from './riveCharacter'

export {
  AVATAR_RIVE_ARTBOARD,
  AVATAR_RIVE_CONTRACT,
  AVATAR_RIVE_COSMETIC_SLOTS,
  AVATAR_RIVE_SRC,
  AVATAR_RIVE_STATE_MACHINE,
  probeAvatarRive,
  resetAvatarRiveProbe,
  type AvatarRiveCosmeticInputs,
  type AvatarRiveCosmeticSlot,
} from './avatarRive'

export {
  ARI_3D_LOOPING_MOTIONS,
  ARI_3D_MODEL_URL,
  ariMotionFromCharacterState,
  ariMotionFromFeedback,
  isAri3dProductEnabled,
  probeAri3dModel,
  resetAri3dModelProbe,
} from './ari3d'
