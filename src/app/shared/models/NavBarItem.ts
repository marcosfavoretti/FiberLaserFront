import { MegaMenuItem } from 'primeng/api';

export interface NavbarItem extends MegaMenuItem{
    type: 'button' | 'link';
}