import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  MessageSquare, 
  BookOpen, 
  LogOut,
  ChevronLeft,
  Menu,
  FileText,
  Languages
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Jobs',
    href: '/admin/jobs',
    icon: Briefcase,
  },
  {
    title: 'Applications',
    href: '/admin/applications',
    icon: Users,
  },
  {
    title: 'Inquiries',
    href: '/admin/inquiries',
    icon: MessageSquare,
  },
  {
    title: 'Service Pages',
    href: '/admin/service-pages',
    icon: FileText,
  },
  {
    title: 'Translations',
    href: '/admin/translations',
    icon: Languages,
  },
  // Case Studies hidden as requested
  // {
  //   title: 'Case Studies',
  //   href: '/admin/case-studies',
  //   icon: BookOpen,
  // },
];

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const location = useLocation();
  const { signOut, profile } = useAuth();

  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0, width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "bg-card border-r border-border h-screen flex flex-col shadow-lg sticky top-0",
        collapsed ? "w-20" : "w-70"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-xl font-bold text-primary">ASMI Admin</h1>
            <p className="text-xs text-muted-foreground">Management Portal</p>
          </motion.div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8 hover:bg-slate-100"
        >
          {collapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href === '/admin' && location.pathname === '/admin/');
            
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center rounded-none px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <item.icon 
                    className={cn(
                      "h-4 w-4 shrink-0",
                      collapsed ? "mx-auto" : "mr-3"
                    )} 
                  />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ delay: 0.1 }}
                    >
                      {item.title}
                    </motion.span>
                  )}
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute right-0 w-1 bg-white rounded-l-full h-8"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-border mt-auto">
        {!collapsed && profile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-4 p-3 bg-white border border-slate-200 rounded-none"
          >
            <p className="text-sm font-medium truncate">{profile.full_name || profile.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{profile.role}</p>
          </motion.div>
        )}
        
        <Button
          variant="ghost"
          onClick={signOut}
          className={cn(
            "w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className={cn("h-4 w-4", !collapsed && "mr-3")} />
          {!collapsed && "Sign Out"}
        </Button>
      </div>
    </motion.div>
  );
}
