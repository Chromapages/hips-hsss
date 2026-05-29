/**
 * Re-export sidebar hooks from AppSidebar for convenience.
 * The sidebar context is provided by AppSidebarProvider.
 */
export { useAppSidebar as useSidebar, AppSidebarProvider } from "./AppSidebar";

export type { AppSidebarProps } from "./AppSidebar";