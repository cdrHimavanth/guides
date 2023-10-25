/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'dashboard',
        title: 'Dashboard',
        type : 'basic',
        icon : 'heroicons_outline:chart-square-bar',
        link : '/dashboard'
    },
    {
        id   : 'uploads',
        title: 'Uploads',
        type : 'basic',
        icon : 'heroicons_outline:arrow-circle-up',
        link : '/uploads'
    },
    {
        id   : 'positions',
        title: 'Positions',
        type : 'basic',
        icon : 'feather:pocket',
        link : '/positions'
    },
    {
        id   : 'candidateinfo',
        title: 'Candidate Info',
        type : 'basic',
        icon : 'heroicons_outline:users',
        link : '/candidate-info'
    },
    {
        id   : 'bidinfo',
        title: 'Bid Info',
        type : 'basic',
        icon : 'heroicons_outline:currency-dollar',
        link : '/bidinfo'
    },
    {
        id   : 'hrreports',
        title: 'HR Reports',
        type : 'basic',
        icon : 'heroicons_outline:document-report',
        link : '/hrreports'
    },
    {
        id   : 'admin',
        title: 'Admin',
        type : 'basic',
        icon : 'heroicons_outline:cog',
        link : '/admin',
        children: []
    },
    // {
    //     id   : 'help',
    //     title: 'Help',
    //     type : 'basic',
    //     icon : 'heroicons_outline:question-mark-circle',
    //     link : '/help'
    // },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'group',
        icon : 'heroicons_outline:home',
        link : '/example'
    }
];
