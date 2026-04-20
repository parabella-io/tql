import React from "react";
import { Separator } from "@/shared/components/ui/separator"
import { SidebarTrigger } from "@/shared/components/ui/sidebar"

type SideHeaderRootProps = {
    children: React.ReactNode;
};

const SideHeaderRoot = ({ children }: SideHeaderRootProps) => (
    <header className="p-2 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="m-2" />
            {children}
        </div>
    </header>
);

type SideHeaderTitleProps = {
    children: React.ReactNode;
};

const SideHeaderTitle = ({ children }: SideHeaderTitleProps) => (
    <h1 className="text-base font-medium">{children}</h1>
);

type SideHeaderActionsProps = {
    children?: React.ReactNode;
};

const SideHeaderActions = ({ children }: SideHeaderActionsProps) => (
    <div className="ml-auto flex items-center gap-2">
        {children}
    </div>
);

export const SideHeader = Object.assign(SideHeaderRoot, {
    Title: SideHeaderTitle,
    Actions: SideHeaderActions,
});