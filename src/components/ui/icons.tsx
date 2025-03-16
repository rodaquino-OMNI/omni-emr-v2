
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Command,
  File,
  FileText,
  HelpCircle,
  Image,
  Laptop,
  Loader2,
  Moon,
  MoreVertical,
  Pizza,
  Plus,
  Settings,
  SunMedium,
  Trash,
  Twitter,
  User,
  X,
  Facebook,
  Github,
  Mail,
  MessageSquare,
  Phone,
  UserPlus,
  LogIn,
  PanelLeft,
  Calendar,
  Users
} from "lucide-react";

export type Icon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export const Icons = {
  logo: Command,
  close: X,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  post: FileText,
  page: File,
  media: Image,
  settings: Settings,
  billing: Pizza,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  arrowRight: ArrowRight,
  help: CircleHelp,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  gitHub: Github,
  twitter: Twitter,
  check: Check,
  facebook: Facebook,
  google: Mail,
  message: MessageSquare,
  phone: Phone,
  userPlus: UserPlus,
  logIn: LogIn,
  panel: PanelLeft,
  calendar: Calendar,
  team: Users,
};
