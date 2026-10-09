"use client";
import { cn } from "@/lib/utils";
import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

/** Collapsed rail width and expanded panel width, in px. */
export const SIDEBAR_RAIL_WIDTH = 80;
export const SIDEBAR_PANEL_WIDTH = 320;

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
  active?: boolean;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** True when labels should be readable: hovered open, or pinned wide. */
  expanded: boolean;
  /** True when the sidebar never animates and stays at full width. */
  pinned: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  const reduceMotion = useReducedMotion();

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  // Pinned means "always wide and always labelled" — no hover affordance at all.
  const pinned = !animate || !!reduceMotion;

  return (
    <SidebarContext.Provider value={{ open, setOpen, expanded: open || pinned, pinned }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, pinned } = useSidebar();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  // Open immediately, but wait a beat before closing so brushing past the rail
  // does not restart the width animation mid-flight.
  const handleOpen = () => {
    cancelClose();
    if (!pinned) setOpen(true);
  };

  const handleClose = () => {
    if (pinned) return;
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  // The spacer is the only thing the layout's flex row measures, so the main
  // column never reflows while the panel slides out over it.
  return (
    <aside
      className="relative hidden h-full shrink-0 md:block"
      style={{ width: pinned ? SIDEBAR_PANEL_WIDTH : SIDEBAR_RAIL_WIDTH }}
    >
      <motion.div
        className={cn(
          "absolute inset-y-0 left-0 z-40 flex flex-col overflow-hidden border-r-[3px] border-ink bg-card px-3 py-4 text-foreground",
          className
        )}
        initial={false}
        animate={{
          width: pinned || open ? SIDEBAR_PANEL_WIDTH : SIDEBAR_RAIL_WIDTH,
        }}
        transition={pinned ? { duration: 0 } : { duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        onFocusCapture={handleOpen}
        {...props}
      >
        {children}
      </motion.div>
    </aside>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "flex h-12 w-full flex-row items-center justify-between border-b-[3px] border-ink bg-card px-4 py-2 text-foreground md:hidden"
      )}
      {...props}
    >
      <div className="z-20 flex w-full justify-end">
        <button
          type="button"
          aria-label="Open navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.3, ease: "easeInOut" }
            }
            className={cn(
              "fixed inset-0 z-[100] flex h-full w-full flex-col justify-between bg-card p-10 text-foreground",
              className
            )}
          >
            <button
              type="button"
              aria-label="Close navigation"
              className="absolute right-10 top-10 z-50"
              onClick={() => setOpen(!open)}
            >
              <X className="h-6 w-6" />
            </button>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  const { expanded } = useSidebar();

  return (
    <Link
      href={link.href}
      aria-current={link.active ? "page" : undefined}
      className={cn(
        "group/sidebar relative flex min-w-0 items-center gap-2 overflow-hidden rounded-full border-[3px] px-3 py-2 transition-colors",
        link.active
          ? "border-ink bg-primary text-primary-foreground shadow-brutal-sm"
          : "border-transparent hover:bg-accent",
        expanded ? "justify-start" : "justify-center",
        className
      )}
      {...props}
    >
      {link.icon}

      {/* Kept in the DOM at opacity 0 so collapsed links still have an
          accessible name; the parent's width squeezes it to nothing. */}
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-xs font-bold transition-opacity duration-150",
          expanded ? "opacity-100" : "opacity-0",
          link.active ? "text-primary-foreground" : "text-muted-foreground"
        )}
      >
        {link.label}
      </span>
    </Link>
  );
};
