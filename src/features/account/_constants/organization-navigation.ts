// [職責] 為「帳戶治理」功能切片定義其在組織級別的導航結構
import {
  Users,
  Globe,
  Grid3X3,
  Calendar,
  MessageSquare,
  History
} from "lucide-react";

/**
 * GOVERNANCE_NAV_ITEMS
 * 定義了與帳戶和組織本身治理直接相關的導航項目。
 * 這些是 `account` 功能切片的核心。
 */
export const GOVERNANCE_NAV_ITEMS = [
  { path: "/members", icon: Users, translationKey: 'navigation.members' },
  { path: "/teams", icon: Users, translationKey: 'navigation.internalTeams' },
  { path: "/partners", icon: Globe, translationKey: 'navigation.partnerTeams' },
  { path: "/matrix", icon: Grid3X3, translationKey: 'navigation.permissions' },
];

/**
 * AGGREGATED_CAPABILITY_NAV_ITEMS
 * 定義了那些雖然是獨立能力，但在組織層級具有聚合視圖的導航項目。
 * 這些項目在功能上跨越多個工作區。
 */
export const AGGREGATED_CAPABILITY_NAV_ITEMS = [
  { path: "/schedule", icon: Calendar, translationKey: 'navigation.schedule' },
  { path: "/daily", icon: MessageSquare, translationKey: 'navigation.daily' },
  { path: "/audit", icon: History, translationKey: 'navigation.audit' },
];
