// Icons referenced by name in the content files ("icon": "radar").
// Only the icons listed here are included in the website bundle.
// To use another icon from https://lucide.dev/icons, import it and add it below.
import {
  Activity,
  BadgeCheck,
  BrainCircuit,
  CircleDot,
  ClipboardCheck,
  Cpu,
  Globe,
  HandHeart,
  Hospital,
  House,
  ListChecks,
  MessagesSquare,
  Network,
  Radar,
  Radio,
  Router,
  ScanHeart,
  ShieldCheck,
  UserRound,
  UsersRound,
} from 'lucide-react'

const ICONS = {
  activity: Activity,
  'badge-check': BadgeCheck,
  'brain-circuit': BrainCircuit,
  'clipboard-check': ClipboardCheck,
  cpu: Cpu,
  globe: Globe,
  'hand-heart': HandHeart,
  hospital: Hospital,
  house: House,
  'list-checks': ListChecks,
  'messages-square': MessagesSquare,
  network: Network,
  radar: Radar,
  radio: Radio,
  router: Router,
  'scan-heart': ScanHeart,
  'shield-check': ShieldCheck,
  'user-round': UserRound,
  'users-round': UsersRound,
}

export function getIcon(name) {
  return ICONS[name] ?? CircleDot
}
