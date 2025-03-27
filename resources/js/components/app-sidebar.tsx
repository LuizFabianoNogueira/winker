import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, LayoutGrid, UsersIcon } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItemsAdmin: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Livros',
        href: '/books',
        icon: BookOpen,
    },
    {
        title: 'Emprestimos',
        href: '/loans',
        icon: BookOpen,
    },
    {
        title: 'Reservas',
        href: '/reservations',
        icon: BookOpen,
    },
    {
        title: 'Users',
        href: '/users',
        icon: UsersIcon,
    }
];

const mainNavItemsUser: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Livros',
        href: '/books',
        icon: BookOpen,
    },
    {
        title: 'Emprestimos',
        href: '/loans',
        icon: BookOpen,
    },
    {
        title: 'Reservas',
        href: '/reservations',
        icon: BookOpen,
    },

];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {

    const page = usePage<SharedData>();
    const { auth } = page.props;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={ (auth.user.role === 'admin' ? mainNavItemsAdmin : mainNavItemsUser )} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
