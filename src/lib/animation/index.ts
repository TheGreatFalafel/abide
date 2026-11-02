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
  avatarStateFromFeedback,
  normalizeAvatarCharacterState,
} from './avatarMachine'

export {
  ARI_RIVE_ARTBOARD,
  ARI_RIVE_LOOPING_TRIGGERS,
  ARI_RIVE_SRC,
  ARI_RIVE_STATE_MACHINE,
  riveTriggerForAriState,
} from './riveAri'
