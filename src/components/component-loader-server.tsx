"use client";

import { ComponentType, useEffect, useState } from "react";
import type { RegistryItem } from "shadcn/registry";

interface ComponentLoaderProps {
  component: RegistryItem;
}

// Pre-import all components using Vite's glob import
const componentModules = import.meta.glob(
  '/src/components/locospecui/*.tsx',
  { eager: false, import: 'default' }
) as Record<string, () => Promise<ComponentType<unknown>>>;

// Log available modules for debugging
console.log('Available component modules:', Object.keys(componentModules));

export default function ComponentLoader<TProps extends object>({
  component,
  ...props
}: ComponentLoaderProps & TProps) {
  const [Component, setComponent] = useState<ComponentType<TProps> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!component?.name) return;

    const loadComponent = async () => {
      try {
        const modulePath = `/src/components/locospecui/${component.name}.tsx`;
        const module = componentModules[modulePath];
        
        if (!module) {
          console.error('Available modules:', Object.keys(componentModules));
          throw new Error(`Module ${component.name} not found at ${modulePath}`);
        }

        const LoadedComponent = (await module()) as unknown as ComponentType<TProps>;
        setComponent(() => LoadedComponent);
      } catch (err) {
        console.error(`Failed to load component ${component.name}:`, err);
        setError(
          err instanceof Error ? err : new Error("Failed to load component")
        );
      }
    };

    loadComponent();
  }, [component?.name]);

  if (!component?.name) return null;
  if (error) return <div>Error loading component: {error.message}</div>;
  if (!Component) return <div>Loading {component.name}...</div>;

  return <Component {...(props as TProps)} currentPage={1} totalPages={10} />;
}
